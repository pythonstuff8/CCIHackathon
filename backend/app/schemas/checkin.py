"""PHQ-9 check-in Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, Field


class PHQ9Create(BaseModel):
    answers: list[int] = Field(..., min_length=9, max_length=9)


class PHQ9Response(BaseModel):
    id: int
    total_score: int
    severity: str
    question_9_flag: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PHQ9Detail(BaseModel):
    id: int
    answers: list[int]
    total_score: int
    severity: str
    question_9_flag: bool
    created_at: datetime

    model_config = {"from_attributes": True}
