"""Alerts router: list and mark alerts as read."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.alert import Alert
from app.schemas.alert import AlertResponse

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/", response_model=list[AlertResponse])
def list_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Alert]:
    """List alerts for the current parent or counselor, matched by email."""
    return (
        db.query(Alert)
        .filter(Alert.recipient_email == current_user.email)
        .order_by(Alert.created_at.desc())
        .all()
    )


@router.patch("/{alert_id}/read", response_model=AlertResponse)
def mark_alert_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Alert:
    """Mark an alert as read. Only the recipient can mark it."""
    alert = (
        db.query(Alert)
        .filter(
            Alert.id == alert_id,
            Alert.recipient_email == current_user.email,
        )
        .first()
    )
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found",
        )

    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert
