"""PHQ-9 check-in router: submit answers and view history."""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User, TeenParentLink, TrustedAdult
from app.models.checkin import PHQ9Response as PHQ9ResponseModel
from app.models.alert import Alert, AlertType
from app.schemas.checkin import PHQ9Create, PHQ9Response, PHQ9Detail
from app.services.phq9_scoring import score_phq9
from app.services.email_service import send_alert_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/checkin", tags=["checkin"])


@router.post("/", response_model=PHQ9Response, status_code=status.HTTP_201_CREATED)
async def submit_checkin(
    payload: PHQ9Create,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PHQ9ResponseModel:
    """Submit PHQ-9 answers, score them, store, and check for Q9 flag."""
    try:
        result = score_phq9(payload.answers)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    response = PHQ9ResponseModel(
        user_id=current_user.id,
        answers=payload.answers,
        total_score=result["total_score"],
        severity=result["severity"],
        question_9_flag=result["question_9_flag"],
    )
    db.add(response)
    db.commit()
    db.refresh(response)

    # If question 9 is flagged, create alerts and notify guardians
    if result["question_9_flag"]:
        parent_links = (
            db.query(TeenParentLink)
            .filter(TeenParentLink.teen_id == current_user.id)
            .all()
        )
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

        summary = (
            f"PHQ-9 self-harm question flagged. Severity: {result['severity']}. "
            f"Total score: {result['total_score']}/27."
        )

        for email in set(recipients):
            alert = Alert(
                teen_id=current_user.id,
                recipient_email=email,
                alert_type=AlertType.phq9_flag,
                risk_level="critical" if result["total_score"] >= 20 else "high",
                summary=summary,
            )
            db.add(alert)

            try:
                await send_alert_email(
                    recipient_email=email,
                    teen_name=current_user.username,
                    risk_level="high",
                    summary=summary,
                )
            except Exception as exc:
                logger.error("Failed to send PHQ-9 alert email to %s: %s", email, exc)

        db.commit()

    return response


@router.get("/history", response_model=list[PHQ9Detail])
def get_checkin_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[PHQ9ResponseModel]:
    """Return the current user's PHQ-9 history, newest first."""
    return (
        db.query(PHQ9ResponseModel)
        .filter(PHQ9ResponseModel.user_id == current_user.id)
        .order_by(PHQ9ResponseModel.created_at.desc())
        .all()
    )
