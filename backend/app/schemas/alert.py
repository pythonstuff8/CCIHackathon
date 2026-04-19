"""Alert Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: int
    teen_id: int
    recipient_email: str
    alert_type: str
    risk_level: str | None
    summary: str | None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
