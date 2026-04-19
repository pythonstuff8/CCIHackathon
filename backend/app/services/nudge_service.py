"""Supportive nudge message service based on risk levels."""


def get_nudge_message(risk_level: str) -> str:
    """Return an appropriate nudge message based on the current risk level.

    Args:
        risk_level: One of 'low', 'moderate', 'high', 'critical'.

    Returns:
        A supportive nudge string tailored to the risk level.
    """
    nudges = {
        "low": (
            "You're doing a great job expressing yourself. "
            "Keep writing — it's a healthy way to process what you're feeling. "
            "Remember, every emotion you feel is valid."
        ),
        "moderate": (
            "It sounds like you might be going through something tough right now. "
            "That's okay — everyone has hard days. "
            "Have you thought about talking to someone you trust about how you're feeling? "
            "Sometimes sharing the load makes it a little lighter."
        ),
        "high": (
            "What you're feeling matters, and you deserve support. "
            "Please consider reaching out to a trusted adult — a parent, teacher, "
            "counselor, or someone who cares about you. "
            "You don't have to go through this alone, and asking for help is a sign of strength."
        ),
        "critical": (
            "I'm really glad you shared this. What you're going through sounds really hard, "
            "and I want you to know that help is available right now.\n\n"
            "Please reach out to one of these resources:\n"
            "- 988 Suicide & Crisis Lifeline: Call or text 988\n"
            "- Crisis Text Line: Text HOME to 741741\n\n"
            "If you're in immediate danger, please call 911 or go to your nearest emergency room. "
            "You matter, and people care about you."
        ),
    }
    return nudges.get(risk_level, nudges["moderate"])
