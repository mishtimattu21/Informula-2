import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

POLL_INTERVAL_SEC = 0.4


def extract_text_from_bytes(image_data: bytes) -> str:
    endpoint = os.getenv("ENDPOINT")
    api_key = os.getenv("AZURE_API_KEY")
    if not endpoint or not api_key:
        raise ValueError("Azure OCR configuration missing: ENDPOINT or AZURE_API_KEY")

    endpoint = endpoint.rstrip("/")
    key = api_key.strip().strip('"')
    ocr_url = f"{endpoint}/vision/v3.2/read/analyze"
    headers = {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/octet-stream",
    }

    response = requests.post(ocr_url, headers=headers, data=image_data, timeout=18)
    response.raise_for_status()
    operation_url = response.headers["Operation-Location"]

    result = None
    for attempt in range(40):
        if attempt > 0:
            time.sleep(POLL_INTERVAL_SEC)
        poll = requests.get(
            operation_url,
            headers={"Ocp-Apim-Subscription-Key": key},
            timeout=8,
        )
        result = poll.json()
        status = result.get("status")
        if status == "succeeded":
            break
        if status == "failed":
            raise RuntimeError("Azure OCR failed")
    else:
        raise RuntimeError("Azure OCR timed out")

    lines = []
    for read_result in result.get("analyzeResult", {}).get("readResults", []):
        for line in read_result.get("lines", []):
            text = line.get("text", "").strip()
            if text:
                lines.append(text)
    return "\n".join(lines)
