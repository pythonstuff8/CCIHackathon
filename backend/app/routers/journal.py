"""Journal entry router: create, list, get, and soft-delete entries."""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.journal import JournalEntry
from app.models.analysis import RiskAnalysis, RiskLevel
from app.models.alert import Alert, AlertType
from app.models.checkin import PHQ9Response
from app.models.user import TeenParentLink, TrustedAdult
from app.schemas.journal import JournalEntryCreate
from app.services.ai_analysis import analyze_journal_entry
from app.services.risk_scoring import calculate_composite_risk
from app.services.email_service import send_alert_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/journal", tags=["journal"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    payload: JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Create a journal entry, trigger AI analysis, and return supportive feedback.

    This is the critical path:
    1. Save the journal entry
    2. Fetch recent entries for context
    3. Run AI analysis
    4. Calculate composite risk
    5. Store risk analysis
    6. Create alerts if risk is high/critical
    7. Return entry with supportive message
    """
    # 1. Save journal entry
    entry = JournalEntry(
        user_id=current_user.id,
        content=payload.content,
        mood_before=payload.mood_before,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # 2. Fetch recent entries for trend context
    recent_entries_models = (
        db.query(JournalEntry)
        .filter(
            JournalEntry.user_id == current_user.id,
            JournalEntry.is_deleted == False,  # noqa: E712
            JournalEntry.id != entry.id,
        )
        .order_by(JournalEntry.created_at.desc())
        .limit(5)
        .all()
    )
    recent_texts = [e.content for e in recent_entries_models]

    # 3. Run AI analysis
    ai_result = analyze_journal_entry(payload.content, recent_texts)

    # 4. Calculate composite risk
    recent_analyses = (
        db.query(RiskAnalysis)
        .join(JournalEntry)
        .filter(JournalEntry.user_id == current_user.id)
        .order_by(RiskAnalysis.created_at.desc())
        .limit(10)
        .all()
    )
    recent_analysis_dicts = [
        {"risk_score": a.risk_score, "risk_level": a.risk_level.value if a.risk_level else "moderate"}
        for a in recent_analyses
    ]

    latest_phq9 = (
        db.query(PHQ9Response)
        .filter(PHQ9Response.user_id == current_user.id)
        .order_by(PHQ9Response.created_at.desc())
        .first()
    )
    phq9_score = latest_phq9.total_score if latest_phq9 else None

    composite = calculate_composite_risk(ai_result, recent_analysis_dicts, phq9_score)

    # 5. Store risk analysis
    final_risk_level = composite["risk_level"]
    try:
        risk_enum = RiskLevel(final_risk_level)
    except ValueError:
        risk_enum = RiskLevel.moderate

    analysis = RiskAnalysis(
        journal_entry_id=entry.id,
        risk_level=risk_enum,
        risk_score=composite["composite_score"],
        detected_themes=ai_result.get("detected_themes", []),
        supportive_message=ai_result.get("supportive_message", ""),
        summary_for_guardian=ai_result.get("summary_for_guardian", ""),
    )
    db.add(analysis)
    db.commit()

    # 6. Create alerts if risk is high or critical
    if final_risk_level in ("high", "critical"):
        alert_type = AlertType.critical_risk if final_risk_level == "critical" else AlertType.high_risk

        # Find linked parents
        parent_links = (
            db.query(TeenParentLink)
            .filter(TeenParentLink.teen_id == current_user.id)
            .all()
        )
        # Find trusted adults
        trusted_adults = (
            db.query(TrustedAdult)
            .filter(TrustedAdult.teen_id == current_user.id)
            .all()
        )

        recipients: list[str] = []
        for link in parent_links:
            parent = db.query(User).filter(User.id == link.parent_id).first()
            if parent:
                recipients.append(parent.email)
        for adult in trusted_adults:
            recipients.append(adult.email)

        summary = ai_result.get("summary_for_guardian", "Risk detected in recent journal entry.")

        for email in set(recipients):
            alert = Alert(
                teen_id=current_user.id,
                recipient_email=email,
                alert_type=alert_type,
                risk_level=final_risk_level,
                summary=summary,
            )
            db.add(alert)

            # Send email asynchronously (fire-and-forget; failure is logged)
            try:
                await send_alert_email(
                    recipient_email=email,
                    teen_name=current_user.username,
                    risk_level=final_risk_level,
                    summary=summary,
                )
            except Exception as exc:
                logger.error("Failed to send alert email to %s: %s", email, exc)

        db.commit()

    # 7. Return entry with analysis
    return {
        "id": entry.id,
        "content": entry.content,
        "mood_before": entry.mood_before,
        "created_at": entry.created_at,
        "updated_at": entry.updated_at,
        "analysis": {
            "id": analysis.id,
            "risk_level": final_risk_level,
            "risk_score": composite["composite_score"],
            "detected_themes": ai_result.get("detected_themes", []),
            "supportive_message": ai_result.get("supportive_message", ""),
            "summary_for_guardian": ai_result.get("summary_for_guardian", ""),
            "created_at": analysis.created_at,
        },
    }


@router.get("/")
def list_journal_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    """List all non-deleted journal entries for the current user."""
    entries = (
        db.query(JournalEntry)
        .filter(
            JournalEntry.user_id == current_user.id,
            JournalEntry.is_deleted == False,  # noqa: E712
        )
        .order_by(JournalEntry.created_at.desc())
        .all()
    )
    result = []
    for entry in entries:
        analysis_data = None
        if entry.analysis:
            analysis_data = {
                "risk_level": entry.analysis.risk_level.value if entry.analysis.risk_level else "low",
                "risk_score": entry.analysis.risk_score,
                "detected_themes": entry.analysis.detected_themes or [],
                "supportive_message": entry.analysis.supportive_message or "",
            }
        result.append({
            "id": entry.id,
            "content": entry.content,
            "mood_before": entry.mood_before,
            "created_at": entry.created_at,
            "updated_at": entry.updated_at,
            "analysis": analysis_data,
        })
    return result


@router.get("/{entry_id}")
def get_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Get a single journal entry by ID. Only the owner can view their entries."""
    entry = (
        db.query(JournalEntry)
        .filter(
            JournalEntry.id == entry_id,
            JournalEntry.user_id == current_user.id,
            JournalEntry.is_deleted == False,  # noqa: E712
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    analysis_data = None
    if entry.analysis:
        analysis_data = {
            "id": entry.analysis.id,
            "risk_level": entry.analysis.risk_level.value if entry.analysis.risk_level else "low",
            "risk_score": entry.analysis.risk_score,
            "detected_themes": entry.analysis.detected_themes or [],
            "supportive_message": entry.analysis.supportive_message or "",
            "summary_for_guardian": entry.analysis.summary_for_guardian or "",
            "created_at": entry.analysis.created_at,
        }

    return {
        "id": entry.id,
        "content": entry.content,
        "mood_before": entry.mood_before,
        "created_at": entry.created_at,
        "updated_at": entry.updated_at,
        "analysis": analysis_data,
    }


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """Soft-delete a journal entry."""
    entry = (
        db.query(JournalEntry)
        .filter(
            JournalEntry.id == entry_id,
            JournalEntry.user_id == current_user.id,
            JournalEntry.is_deleted == False,  # noqa: E712
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    entry.is_deleted = True
    db.commit()
