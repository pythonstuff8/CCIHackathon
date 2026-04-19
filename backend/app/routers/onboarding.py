"""Onboarding router: consent, trusted adults, completion, and parent linking."""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User, UserRole, TeenParentLink, TrustedAdult
from app.models.consent import ConsentRecord
from app.schemas.user import ConsentCreate, TrustedAdultCreate, TrustedAdultResponse, LinkParentRequest

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])


@router.post("/consent", status_code=status.HTTP_201_CREATED)
def record_consent(
    payload: ConsentCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Record a consent decision from the teen."""
    client_ip = request.client.host if request.client else None

    record = ConsentRecord(
        teen_id=current_user.id,
        consent_type=payload.consent_type,
        consented=payload.consented,
        ip_address=client_ip,
    )
    db.add(record)
    db.commit()
    return {"status": "consent_recorded", "consent_type": payload.consent_type}


@router.post(
    "/trusted-adults",
    response_model=TrustedAdultResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_trusted_adult(
    payload: TrustedAdultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TrustedAdult:
    """Add a trusted adult for the current teen."""
    adult = TrustedAdult(
        teen_id=current_user.id,
        name=payload.name,
        email=payload.email,
        relation=payload.relation,
    )
    db.add(adult)
    db.commit()
    db.refresh(adult)
    return adult


@router.post("/complete")
def complete_onboarding(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Mark the current user's onboarding as complete."""
    current_user.onboarding_complete = True
    db.commit()
    return {"status": "onboarding_complete"}


@router.post("/link-parent")
def link_parent(
    payload: LinkParentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Link the current teen to a parent by the parent's email."""
    if current_user.role != UserRole.teen:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teens can link to a parent",
        )

    parent = (
        db.query(User)
        .filter(
            User.email == payload.parent_email,
            User.role == UserRole.parent,
        )
        .first()
    )
    if not parent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No parent account found with that email",
        )

    # Prevent duplicate links
    existing = (
        db.query(TeenParentLink)
        .filter(
            TeenParentLink.teen_id == current_user.id,
            TeenParentLink.parent_id == parent.id,
        )
        .first()
    )
    if existing:
        return {"status": "already_linked"}

    link = TeenParentLink(teen_id=current_user.id, parent_id=parent.id)
    db.add(link)
    db.commit()
    return {"status": "linked", "parent_username": parent.username}
