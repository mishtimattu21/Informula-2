from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import asyncio
import base64
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

from supabase_client import get_user_profile, upsert_user_profile
from prompt_formatter import format_prompt, parse_ingredient_list
from gemini_client import get_ingredient_report
import json
import re

# For OCR, reuse existing processing pipeline but expose helpers
from processing_ocr import extract_text_from_bytes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"ok": True}


def _extract_json(text: str):
    try:
        return json.loads(text)
    except Exception:
        pass
    # Try to find the first JSON object in the text
    match = re.search(r"\{[\s\S]*\}$", text.strip())
    if match:
        snippet = match.group(0)
        try:
            return json.loads(snippet)
        except Exception:
            pass
    # Try loose find between first '{' and last '}'
    if '{' in text and '}' in text:
        snippet = text[text.find('{'): text.rfind('}') + 1]
        try:
            return json.loads(snippet)
        except Exception:
            pass
    return None


DEFAULT_PROFILE = {
    'age': 'unknown',
    'gender': 'unknown',
    'diet_type': 'unknown',
    'past_medication': [],
    'allergies': [],
    'avoid_list': [],
}


def _resolve_profile(user_id: Optional[str], profile_payload: Optional[dict] = None) -> dict:
    user_profile = DEFAULT_PROFILE.copy()
    if profile_payload:
        for key in user_profile:
            if key in profile_payload and profile_payload[key] is not None:
                user_profile[key] = profile_payload[key]
        return user_profile
    if user_id:
        with ThreadPoolExecutor(max_workers=1) as pool:
            future = pool.submit(get_user_profile, user_id)
            try:
                profile = future.result(timeout=1.5)
                if profile:
                    return profile
            except FuturesTimeoutError:
                pass
    return user_profile


def _normalize_ingredient_key(name: str) -> str:
    base = re.sub(r"\s*\([^)]*\)", "", name.strip().lower())
    return re.sub(r"\s+", " ", base).strip()


def _index_insights(insights: list) -> dict:
    indexed: dict[str, dict] = {}
    for item in insights or []:
        if not isinstance(item, dict):
            continue
        raw_name = (item.get("ingredient") or "").strip()
        if not raw_name:
            continue
        for key in {_normalize_ingredient_key(raw_name), raw_name.strip().lower()}:
            if key and key not in indexed:
                indexed[key] = item
    return indexed


def _find_insight_for_ingredient(ingredient: str, indexed: dict) -> dict | None:
    keys = [_normalize_ingredient_key(ingredient), ingredient.strip().lower()]
    for key in keys:
        if key in indexed:
            return indexed[key]
    norm = _normalize_ingredient_key(ingredient)
    for key, item in indexed.items():
        if norm == key or norm in key or key in norm:
            return item
    return None


def _ensure_full_insights(parsed: dict, ingredients_text: str) -> dict:
    ingredients = parse_ingredient_list(ingredients_text)
    if not ingredients:
        return parsed

    indexed = _index_insights(parsed.get("insights") or [])
    merged: list[dict] = []
    used_keys: set[str] = set()

    for ingredient in ingredients:
        match = _find_insight_for_ingredient(ingredient, indexed)
        if match:
            merged.append({**match, "ingredient": ingredient})
            used_keys.add(_normalize_ingredient_key(ingredient))
        else:
            merged.append(
                {
                    "ingredient": ingredient,
                    "risk": "safe",
                    "description": "Listed on the label; detailed analysis was not returned for this entry.",
                    "source": "Informula",
                    "sources": [],
                }
            )

    for item in parsed.get("insights") or []:
        if not isinstance(item, dict):
            continue
        name = (item.get("ingredient") or "").strip()
        if not name:
            continue
        key = _normalize_ingredient_key(name)
        if key not in used_keys:
            merged.append(item)

    parsed["insights"] = merged
    parsed["totalIngredients"] = len(ingredients)
    parsed["flaggedIngredients"] = sum(
        1
        for item in merged
        if (item.get("risk") or "").lower() in ("high", "medium", "low")
    )
    return parsed


def run_pipeline(
    ingredients_text: str,
    user_id: Optional[str],
    product_type: str = '',
    product_name: str = '',
    profile_payload: Optional[dict] = None,
):
    user_profile = _resolve_profile(user_id, profile_payload)

    try:
        prompt = format_prompt(ingredients_text, user_profile, product_type, product_name)
        result = get_ingredient_report(prompt)
    except RuntimeError as e:
        return {'error': str(e)}
    except Exception as e:
        return {'error': str(e)}

    parsed = _extract_json(result)
    if parsed is not None:
        return _ensure_full_insights(parsed, ingredients_text)
    return {'error': 'LLM returned non-JSON', 'raw': result}


@app.post("/api/chat")
async def chat_reply(request: Request):
    body = await request.json()
    question = body.get('question', '')
    history = body.get('history', [])  # [{role:'user'|'ai', content: str}]
    initial_analysis = body.get('initialAnalysis', '')
    user_id = body.get('userId')

    user_profile = get_user_profile(user_id) if user_id else None

    # Build a concise prompt that includes initial analysis and brief history
    history_text = "\n".join([f"{m.get('role', 'user')}: {m.get('content','')}" for m in history][-6:])
    profile_text = ''
    if user_profile:
        profile_text = (
            f"User Profile -> age: {user_profile.get('age')}, gender: {user_profile.get('gender')}, "
            f"diet_type: {user_profile.get('diet_type', 'unknown')}, "
            f"allergies: {', '.join(user_profile.get('allergies', []))}, "
            f"avoid_list: {', '.join(user_profile.get('avoid_list', []))}"
        )

    prompt = (
        "You are an expert ingredient safety assistant. Answer clearly, cite a reputable source inline when applicable (short label).\n" 
        "Base your answer on the given analysis and conversation. Keep it practical and concise.\n\n"
        f"Initial Analysis:\n{initial_analysis}\n\n"
        f"Conversation (latest last):\n{history_text}\n\n"
        f"Question: {question}\n\n"
        f"{profile_text}\n"
        "Answer:"
    )

    try:
        answer = get_ingredient_report(prompt)
    except Exception as e:
        return { 'error': str(e) }
    return { 'answer': answer }


@app.get("/api/profile/{user_id}")
async def get_profile(user_id: str):
    profile = get_user_profile(user_id)
    if profile:
        return profile
    return None


@app.put("/api/profile")
async def save_profile(request: Request):
    body = await request.json()
    user_id = body.get("id")
    if not user_id:
        return {"error": "Profile id is required"}
    try:
        upsert_user_profile(body)
        return {"ok": True}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/analyze-image")
async def analyze_image(request: Request, file: Optional[UploadFile] = File(None), image: Optional[str] = Form(None), userId: Optional[str] = Form(None), productName: Optional[str] = Form(None), productType: Optional[str] = Form(None)):
    image_bytes: Optional[bytes] = None
    uid: Optional[str] = userId
    profile_payload: Optional[dict] = None
    product_type = productType or ''
    product_name = productName or ''

    if file is not None:
        image_bytes = await file.read()
    elif image is not None:
        _, b64 = (image.split(',', 1) + [image])[:2]
        image_bytes = base64.b64decode(b64)
    else:
        try:
            data = await request.json()
            img = data.get('image')
            uid = data.get('userId') or uid
            product_name = data.get('productName') or product_name
            product_type = data.get('productType') or product_type
            profile_payload = data.get('profile')
            if img:
                _, b64 = (img.split(',', 1) + [img])[:2]
                image_bytes = base64.b64decode(b64)
        except Exception:
            pass

    if image_bytes is None:
        return {'error': 'No image provided'}

    ingredients_text = await asyncio.to_thread(extract_text_from_bytes, image_bytes)
    json_result = await asyncio.to_thread(
        run_pipeline, ingredients_text, uid, product_type, product_name, profile_payload
    )
    return json_result


@app.post("/api/analyze-text")
async def analyze_text(request: Request):
    data = await request.json()
    ingredients = data.get('ingredients', '')
    user_id = data.get('userId')
    product_type = data.get('productType', '')
    product_name = data.get('productName', '')
    profile_payload = data.get('profile')
    json_result = await asyncio.to_thread(
        run_pipeline, ingredients, user_id, product_type, product_name, profile_payload
    )
    return json_result
