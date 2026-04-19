"""Journal entry Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, Field


class JournalEntryCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)
    mood_before: int | None = Field(None, ge=1, le=5)


class JournalEntryResponse(BaseModel):
    id: int
    content: str
    mood_before: int | None
    created_at: datetime
    updated_at: datetime
    supportive_message: str | None = None
    risk_level: str | None = None

    model_config = {"from_attributes": True}


class AnalysisSummary(BaseModel):
    risk_level: str
    risk_score: float
    detected_themes: list[str] = []
    supportive_message: str = ""

    model_config = {"from_attributes": True}


class JournalEntryListItem(BaseModel):
    id: int
    content: str
    mood_before: int | None
    created_at: datetime
    updated_at: datetime
    analysis: AnalysisSummary | None = None

    model_config = {"from_attributes": True}
