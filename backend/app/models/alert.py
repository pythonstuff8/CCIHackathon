"""Alert model for notifying guardians and counselors."""

import enum
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, Boolean, Enum, ForeignKey, DateTime

from app.database import Base


class AlertType(str, enum.Enum):
    high_risk = "high_risk"
    critical_risk = "critical_risk"
    phq9_flag = "phq9_flag"


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    teen_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    recipient_email = Column(String(255), nullable=False)
    alert_type = Column(Enum(AlertType), nullable=False)
    risk_level = Column(String(20), nullable=True)
    summary = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
