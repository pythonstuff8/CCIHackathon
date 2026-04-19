"""User, TeenParentLink, and TrustedAdult models."""

import enum
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Boolean, Enum, ForeignKey, DateTime,
)
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, enum.Enum):
    teen = "teen"
    parent = "parent"
    counselor = "counselor"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    onboarding_complete = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    journal_entries = relationship("JournalEntry", back_populates="user")
    phq9_responses = relationship("PHQ9Response", back_populates="user")
    consent_records = relationship("ConsentRecord", back_populates="teen")


class TeenParentLink(Base):
    __tablename__ = "teen_parent_links"

    id = Column(Integer, primary_key=True, index=True)
    teen_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    teen = relationship("User", foreign_keys=[teen_id])
    parent = relationship("User", foreign_keys=[parent_id])


class TrustedAdult(Base):
    __tablename__ = "trusted_adults"

    id = Column(Integer, primary_key=True, index=True)
    teen_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(255), nullable=False)
    relation = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    teen = relationship("User", foreign_keys=[teen_id])
