"""Risk analysis model."""

import enum
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, Float, String, Text, Enum, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class RiskLevel(str, enum.Enum):
    low = "low"
    moderate = "moderate"
    high = "high"
    critical = "critical"


class RiskAnalysis(Base):
    __tablename__ = "risk_analyses"

    id = Column(Integer, primary_key=True, index=True)
    journal_entry_id = Column(
        Integer, ForeignKey("journal_entries.id"), nullable=False, unique=True,
    )
    risk_level = Column(Enum(RiskLevel), nullable=False)
    risk_score = Column(Float, nullable=False)
    detected_themes = Column(JSON, nullable=True)
    supportive_message = Column(Text, nullable=True)
    summary_for_guardian = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    journal_entry = relationship("JournalEntry", back_populates="analysis")
