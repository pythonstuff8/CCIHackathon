"""PHQ-9 check-in response model."""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class PHQ9Response(Base):
    __tablename__ = "phq9_responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    answers = Column(JSON, nullable=False)
    total_score = Column(Integer, nullable=False)
    severity = Column(String(50), nullable=False)
    question_9_flag = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="phq9_responses")
