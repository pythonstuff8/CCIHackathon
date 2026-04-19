"""Guardian/counselor dashboard router: view linked teens, risk trends, and alerts."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User, UserRole, TeenParentLink
from app.models.journal import JournalEntry
from app.models.analysis import RiskAnalysis
from app.models.alert import Alert
from app.schemas.user import UserResponse
from app.schemas.analysis import GuardianAnalysisView
from app.schemas.alert import AlertResponse

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def _require_guardian(user: User) -> None:
    """Raise 403 if the user is not a parent or counselor."""
    if user.role not in (UserRole.parent, UserRole.counselor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only parents and counselors can access the dashboard",
        )


def _verify_linked_teen(db: Session, parent_id: int, teen_id: int) -> None:
    """Raise 403 if the parent is not linked to the given teen."""
    link = (
        db.query(TeenParentLink)
        .filter(
            TeenParentLink.parent_id == parent_id,
            TeenParentLink.teen_id == teen_id,
        )
        .first()
    )
    if not link:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not linked to this teen",
        )


@router.get("/teens", response_model=list[UserResponse])
def list_linked_teens(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[User]:
    """List all teens linked to the current parent or counselor."""
    _require_guardian(current_user)

    links = (
        db.query(TeenParentLink)
        .filter(TeenParentLink.parent_id == current_user.id)
        .all()
    )
    teen_ids = [link.teen_id for link in links]
    if not teen_ids:
        return []

    return db.query(User).filter(User.id.in_(teen_ids)).all()


@router.get("/teen/{teen_id}/risk-trend", response_model=list[GuardianAnalysisView])
def get_risk_trend(
    teen_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[RiskAnalysis]:
    """Get risk analysis trend for a linked teen.

    Returns GuardianAnalysisView which NEVER includes journal content
    or supportive messages — only risk_level, risk_score, detected_themes,
    summary_for_guardian, and created_at.
    """
    _require_guardian(current_user)
    _verify_linked_teen(db, current_user.id, teen_id)

    analyses = (
        db.query(RiskAnalysis)
        .join(JournalEntry)
        .filter(JournalEntry.user_id == teen_id)
        .order_by(RiskAnalysis.created_at.desc())
        .limit(30)
        .all()
    )
    return analyses


@router.get("/teen/{teen_id}/alerts", response_model=list[AlertResponse])
def get_teen_alerts(
    teen_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Alert]:
    """Get alerts for a specific linked teen."""
    _require_guardian(current_user)
    _verify_linked_teen(db, current_user.id, teen_id)

    return (
        db.query(Alert)
        .filter(
            Alert.teen_id == teen_id,
            Alert.recipient_email == current_user.email,
        )
        .order_by(Alert.created_at.desc())
        .all()
    )
