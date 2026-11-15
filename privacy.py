import re


def anonymise_text(text: str, worker=None) -> str:
    """
    Removes common personal identifiers before text is
    sent to an external LLM.

    This is a development safeguard, not guaranteed anonymisation.
    """

    if not text:
        return ""

    cleaned = text

    # Remove known worker details from the private database
    if worker:
        private_values = [
            worker.name,
            worker.phone
        ]

        for value in private_values:
            if value and len(value.strip()) >= 2:
                cleaned = re.sub(
                    re.escape(value.strip()),
                    "[REDACTED]",
                    cleaned,
                    flags=re.IGNORECASE
                )

    # Email addresses
    cleaned = re.sub(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        "[EMAIL REDACTED]",
        cleaned
    )

    # Indian mobile numbers
    cleaned = re.sub(
        r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
        "[PHONE REDACTED]",
        cleaned
    )

    # Aadhaar-like 12-digit numbers
    cleaned = re.sub(
        r"(?<!\d)\d{4}[\s-]?\d{4}[\s-]?\d{4}(?!\d)",
        "[IDENTITY NUMBER REDACTED]",
        cleaned
    )

    # PAN-like numbers
    cleaned = re.sub(
        r"\b[A-Z]{5}\d{4}[A-Z]\b",
        "[IDENTITY NUMBER REDACTED]",
        cleaned,
        flags=re.IGNORECASE
    )

    # Explicitly stated names in English
    cleaned = re.sub(
        r"\b(my name is|I am|I'm)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b",
        r"\1 [NAME REDACTED]",
        cleaned,
        flags=re.IGNORECASE
    )

    return cleaned.strip()


def anonymise_messages(messages: list, worker=None) -> list:
    """
    Sanitises conversation messages before sending
    conversation history to the LLM.
    """

    safe_messages = []

    for message in messages:
        safe_messages.append({
            "role": message.get("role", "user"),
            "content": anonymise_text(
                message.get("content", ""),
                worker
            )
        })

    return safe_messages