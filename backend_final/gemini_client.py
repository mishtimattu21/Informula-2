import os
import re
from functools import lru_cache
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Lite models first (fastest). Set GEMINI_ANALYSIS_MODELS=gemini-3.1-flash-lite,gemini-2.5-flash-lite in .env
_DEFAULT = "gemini-3.1-flash-lite,gemini-2.5-flash-lite,gemini-2.5-flash"
DEFAULT_MODELS = [
    m.strip()
    for m in os.getenv("GEMINI_ANALYSIS_MODELS", _DEFAULT).split(",")
    if m.strip()
]

CONFIGURED_MODEL = os.getenv("GEMINI_MODEL", "").strip()
MODEL_CANDIDATES = (
    [CONFIGURED_MODEL] + [m for m in DEFAULT_MODELS if m != CONFIGURED_MODEL]
    if CONFIGURED_MODEL
    else DEFAULT_MODELS
)

API_KEY_LIMIT_MESSAGE = "API Key Limit Reached"


def _estimate_output_tokens(prompt_text: str) -> int:
    match = re.search(r"There are (\d+) ingredients below", prompt_text)
    ingredient_count = int(match.group(1)) if match else max(
        1, prompt_text.lower().count(",") + 1
    )
    # Room for every ingredient (brief safe entries + detailed flagged)
    return min(8192, 450 + ingredient_count * 110)


def _is_api_key_issue(exc: Exception) -> bool:
    message = str(exc).lower()
    return (
        "429" in message
        or "quota" in message
        or "rate limit" in message
        or "api key" in message
        or "invalid key" in message
        or "401" in message
        or "403" in message
    )


@lru_cache(maxsize=8)
def _get_model(model_name: str, max_output_tokens: int) -> genai.GenerativeModel:
    return genai.GenerativeModel(
        model_name,
        generation_config=genai.GenerationConfig(
            temperature=0.15,
            max_output_tokens=max_output_tokens,
        ),
    )


def get_ingredient_report(prompt_text: str) -> str:
    max_tokens = _estimate_output_tokens(prompt_text)
    last_error: Exception | None = None

    for index, model_name in enumerate(MODEL_CANDIDATES):
        try:
            model = _get_model(model_name, max_tokens)
            response = model.generate_content(prompt_text)
            return response.text or ""
        except Exception as exc:
            last_error = exc
            if _is_api_key_issue(exc) and index < len(MODEL_CANDIDATES) - 1:
                continue
            if _is_api_key_issue(exc):
                raise RuntimeError(API_KEY_LIMIT_MESSAGE) from exc
            raise

    if last_error is not None:
        raise last_error
    raise RuntimeError("No Gemini model configured")
