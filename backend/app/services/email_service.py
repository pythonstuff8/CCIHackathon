"""Async email sending service for alerts."""

import logging
from email.message import EmailMessage

import aiosmtplib

from app.config import settings

logger = logging.getLogger(__name__)


async def send_alert_email(
    recipient_email: str,
    teen_name: str,
    risk_level: str,
    summary: str,
) -> bool:
    """Send an alert email to a guardian or counselor.

    Args:
        recipient_email: Email address of the recipient.
        teen_name: Display name of the teen.
        risk_level: Current risk level string.
        summary: Guardian-safe summary (no journal content).

    Returns:
        True if the email was sent successfully, False otherwise.
    """
    subject = f"Whisper Alert: {risk_level.capitalize()} risk detected for {teen_name}"

    body = f"""Hello,

Whisper has detected a {risk_level} risk level in a recent journal entry from {teen_name}.

Summary:
{summary}

What you can do:
- Check in with {teen_name} in a calm, non-judgmental way
- Let them know you care and are available to talk
- If this is a critical alert, consider reaching out to a mental health professional

Crisis Resources:
- 988 Suicide & Crisis Lifeline: Call or text 988
- Crisis Text Line: Text HOME to 741741

This is an automated alert from Whisper. Please do not reply to this email.

— The Whisper Team
"""

    message = EmailMessage()
    message["From"] = settings.SMTP_USER
    message["To"] = recipient_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        logger.info("Alert email sent to %s for teen %s", recipient_email, teen_name)
        return True
    except Exception as exc:
        logger.error(
            "Failed to send alert email to %s: %s", recipient_email, exc
        )
        return False
