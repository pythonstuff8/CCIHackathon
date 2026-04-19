"""Risk analysis Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel


class RiskAnalysisResponse(BaseModel):
    id: int
    journal_entry_id: int
    risk_level: str
    risk_score: float
    detected_themes: list[str] | None
    supportive_message: str | None
    summary_for_guardian: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class GuardianAnalysisView(BaseModel):
    """View for parents/counselors. NEVER exposes journal content or supportive messages."""

    risk_level: str
    risk_score: float
    detected_themes: list[str] | None
    summary_for_guardian: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
