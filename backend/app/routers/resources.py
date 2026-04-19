"""Crisis resources router: publicly accessible crisis resource information."""

from fastapi import APIRouter

from app.utils.constants import CRISIS_RESOURCES

router = APIRouter(prefix="/api/resources", tags=["resources"])


@router.get("/")
def get_crisis_resources() -> list[dict]:
    """Return crisis resources. No authentication required."""
    return CRISIS_RESOURCES
