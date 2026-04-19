"""PHQ-9 scoring logic."""

from app.utils.constants import PHQ9_SEVERITY


def score_phq9(answers: list[int]) -> dict:
    """Score a PHQ-9 response.

    Args:
        answers: List of 9 integers, each 0-3.

    Returns:
        Dict with total_score, severity, and question_9_flag.

    Raises:
        ValueError: If answers list is not exactly 9 items or values are out of range.
    """
    if len(answers) != 9:
        raise ValueError("PHQ-9 requires exactly 9 answers")

    for i, answer in enumerate(answers):
        if not (0 <= answer <= 3):
            raise ValueError(f"Answer {i + 1} must be between 0 and 3, got {answer}")

    total_score = sum(answers)

    # Determine severity
    severity = "minimal"
    for level, (low, high) in PHQ9_SEVERITY.items():
        if low <= total_score <= high:
            severity = level
            break

    # Flag if question 9 (self-harm ideation) has any non-zero response
    question_9_flag = answers[8] > 0

    return {
        "total_score": total_score,
        "severity": severity,
        "question_9_flag": question_9_flag,
    }
