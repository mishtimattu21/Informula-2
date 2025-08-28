from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import base64

from supabase_client import get_user_profile
from prompt_formatter import format_prompt
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


def run_pipeline(ingredients_text: str, user_id: Optional[str]):
    user_profile = get_user_profile(user_id) if user_id else {
        'age': 'unknown',
        'gender': 'unknown',
        'past_medication': [],
        'allergies': [],
        'avoid_list': []
    }
    prompt = format_prompt(ingredients_text, user_profile)
    result = get_ingredient_report(prompt)
    parsed = _extract_json(result)
    if parsed is not None:
        return parsed
    # If not valid JSON, wrap as error payload
    return { 'error': 'LLM returned non-JSON', 'raw': result }


@app.post("/api/analyze-image")
async def analyze_image(request: Request, file: Optional[UploadFile] = File(None), image: Optional[str] = Form(None), userId: Optional[str] = Form(None), productName: Optional[str] = Form(None), productQuery: Optional[str] = Form(None)):
    # Accept either multipart form-data (file) OR JSON body { image: base64, userId, ... }
    image_bytes: Optional[bytes] = None
    uid: Optional[str] = userId

    # Multipart path
    if file is not None:
        image_bytes = await file.read()
    elif image is not None:
        header, b64 = (image.split(',', 1) + [image])[:2]
        image_bytes = base64.b64decode(b64)
    else:
        # Try JSON
        try:
            data = await request.json()
            img = data.get('image')
            uid = data.get('userId') or uid
            if img:
                header, b64 = (img.split(',', 1) + [img])[:2]
                image_bytes = base64.b64decode(b64)
        except Exception:
            pass

    if image_bytes is None:
        return { 'error': 'No image provided' }

    ingredients_text = extract_text_from_bytes(image_bytes)
    json_result = run_pipeline(ingredients_text, uid)
    return json_result


@app.post("/api/analyze-text")
async def analyze_text(request: Request):
    data = await request.json()
    ingredients = data.get('ingredients', '')
    user_id = data.get('userId')
    json_result = run_pipeline(ingredients, user_id)
    return json_result


