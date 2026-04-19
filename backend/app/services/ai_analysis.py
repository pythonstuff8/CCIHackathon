"""AI-powered journal entry analysis using Google Gemini."""

import json
import logging

import google.generativeai as genai

from app.config import settings
from app.utils.prompts import JOURNAL_ANALYSIS_SYSTEM_PROMPT, build_analysis_prompt

logger = logging.getLogger(__name__)

# Default result returned when AI analysis fails
_FALLBACK_RESULT = {
    "risk_level": "moderate",
    "risk_score": 0.5,
    "detected_themes": ["unable_to_analyze"],
    "supportive_message": (
        "Thanks for sharing what's on your mind. Writing things down takes courage. "
        "If you're going through a tough time, remember you don't have to handle it alone — "
        "talking to someone you trust can really help."
    ),
    "summary_for_guardian": (
        "The system was unable to fully analyze this entry. "
        "A moderate risk level has been assigned as a precaution. "
        "Please check in with your teen."
    ),
}


def _configure_genai() -> None:
    """Configure the Gemini API client."""
    genai.configure(api_key=settings.GEMINI_API_KEY)


def analyze_journal_entry(
    content: str,
    recent_entries: list[str] | None = None,
) -> dict:
    """Analyze a journal entry using Gemini and return structured risk data.

    Args:
        content: The journal entry text to analyze.
        recent_entries: Optional list of recent entry texts for trend context.

    Returns:
        Dict with risk_level, risk_score, detected_themes,
        supportive_message, and summary_for_guardian.
    """
    try:
        _configure_genai()

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash-lite",
            system_instruction=JOURNAL_ANALYSIS_SYSTEM_PROMPT,
        )

        user_prompt = build_analysis_prompt(content, recent_entries)
        response = model.generate_content(user_prompt)

        if not response.text:
            logger.warning("Gemini returned empty response")
            return _FALLBACK_RESULT.copy()

        # Strip markdown code fences if present
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        result = json.loads(text)

        # Validate required keys
        required = {"risk_level", "risk_score", "detected_themes", "supportive_message", "summary_for_guardian"}
        if not required.issubset(result.keys()):
            logger.warning("Gemini response missing required keys: %s", required - result.keys())
            return _FALLBACK_RESULT.copy()

        # Clamp risk_score to [0, 1]
        result["risk_score"] = max(0.0, min(1.0, float(result["risk_score"])))

        # Validate risk_level
        valid_levels = {"low", "moderate", "high", "critical"}
        if result["risk_level"] not in valid_levels:
            result["risk_level"] = "moderate"

        return result

    except json.JSONDecodeError as exc:
        logger.error("Failed to parse Gemini JSON response: %s", exc)
        return _FALLBACK_RESULT.copy()
    except Exception as exc:
        logger.error("AI analysis failed: %s", exc)
        return _FALLBACK_RESULT.copy()
