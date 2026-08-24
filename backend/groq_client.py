from groq import Groq
from groq import APIConnectionError, APIStatusError
from dotenv import load_dotenv
import json
import os
import time

load_dotenv()

_api_key = os.getenv("GROQ_API_KEY")
if not _api_key:
    raise RuntimeError(
        "GROQ_API_KEY is not set. Add it to backend/.env before starting the server."
    )

client = Groq(api_key=_api_key, timeout=60.0)

MAX_RETRIES = 3
RETRY_DELAY_SEC = 1.0


def _chat_with_retry(**kwargs):
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            return client.chat.completions.create(**kwargs)
        except APIConnectionError as exc:
            last_error = exc
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY_SEC * (attempt + 1))
    raise last_error


def call_persona(system_prompt: str, question: str, answer: str) -> dict:
    response = _chat_with_retry(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"Question:{question}\n\nCandidate's answer:{answer}",
            },
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    return json.loads(response.choices[0].message.content)


def groq_error_message(exc: Exception) -> tuple[str, int]:
    if isinstance(exc, APIConnectionError):
        return (
            "Could not reach the Groq API. Check your internet connection and try again.",
            503,
        )
    if isinstance(exc, APIStatusError):
        if exc.status_code == 401:
            return ("Invalid Groq API key. Check GROQ_API_KEY in backend/.env.", 503)
        if exc.status_code == 429:
            return ("Groq rate limit reached. Wait a moment and try again.", 429)
        return (f"Groq API error ({exc.status_code}). Try again shortly.", 502)
    return (str(exc) or "Unexpected error calling Groq.", 500)
