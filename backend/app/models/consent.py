"""Consent record model for tracking user consents."""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(Integer, primary_key=True, index=True)
    teen_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    consent_type = Column(String(100), nullable=False)
    consented = Column(Boolean, nullable=False)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    teen = relationship("User", back_populates="consent_records")
