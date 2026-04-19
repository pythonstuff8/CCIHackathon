"""Composite risk scoring that combines AI analysis, trend data, and PHQ-9."""

import logging

logger = logging.getLogger(__name__)

RISK_LEVEL_SCORES = {
    "low": 0.15,
    "moderate": 0.45,
    "high": 0.7,
    "critical": 0.9,
}


def _score_to_level(score: float) -> str:
    """Map a numeric risk score to a risk level string."""
    if score >= 0.8:
        return "critical"
    if score >= 0.6:
        return "high"
    if score >= 0.3:
        return "moderate"
    return "low"


def _calculate_trend_score(recent_analyses: list[dict]) -> float:
    """Calculate a trend score from recent risk analyses.

    A rising trend yields a higher score; a falling trend yields lower.
    Returns a value between 0.0 and 1.0.
    """
    if not recent_analyses or len(recent_analyses) < 2:
        return 0.5  # neutral — no trend data

    scores = [a.get("risk_score", 0.5) for a in recent_analyses]
    # Compare the latest half to the earlier half
    midpoint = len(scores) // 2
    recent_avg = sum(scores[:midpoint]) / midpoint
    earlier_avg = sum(scores[midpoint:]) / len(scores[midpoint:])

    # Rising trend → higher score, falling → lower
    trend_delta = recent_avg - earlier_avg
    # Normalize to 0-1 range centered at 0.5
    trend_score = 0.5 + (trend_delta * 2.5)
    return max(0.0, min(1.0, trend_score))


def _phq9_risk_score(phq9_score: int | None) -> float:
    """Convert a PHQ-9 total score to a 0-1 risk score."""
    if phq9_score is None:
        return 0.5  # neutral when no data
    # PHQ-9 ranges from 0-27
    return min(1.0, phq9_score / 27.0)


def calculate_composite_risk(
    ai_result: dict,
    recent_analyses: list[dict] | None = None,
    phq9_score: int | None = None,
) -> dict:
    """Calculate a composite risk score from multiple signals.

    Weights:
        - AI analysis: 50%
        - Trend data: 25%
        - PHQ-9 score: 25%

    Args:
        ai_result: Dict from AI analysis with risk_score and risk_level.
        recent_analyses: List of recent analysis dicts (newest first).
        phq9_score: Latest PHQ-9 total score, or None.

    Returns:
        Dict with composite_score (float 0-1) and risk_level (str).
    """
    ai_score = float(ai_result.get("risk_score", 0.5))

    # If AI flagged critical, override everything — safety first
    if ai_result.get("risk_level") == "critical":
        return {"composite_score": max(0.85, ai_score), "risk_level": "critical"}

    trend_score = _calculate_trend_score(recent_analyses or [])
    phq9 = _phq9_risk_score(phq9_score)

    composite = (ai_score * 0.50) + (trend_score * 0.25) + (phq9 * 0.25)
    composite = max(0.0, min(1.0, composite))

    return {
        "composite_score": round(composite, 3),
        "risk_level": _score_to_level(composite),
    }
