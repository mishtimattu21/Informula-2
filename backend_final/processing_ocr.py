import os
import requests
from dotenv import load_dotenv

load_dotenv()

def extract_text_from_bytes(image_data: bytes) -> str:
    endpoint = os.getenv("ENDPOINT")
    api_key = os.getenv("AZURE_API_KEY")
    if not endpoint or not api_key:
        raise ValueError("Azure OCR configuration missing: ENDPOINT or AZURE_API_KEY")

    ocr_url = f"{endpoint}/vision/v3.2/read/analyze"
    headers = {
        "Ocp-Apim-Subscription-Key": api_key,
        "Content-Type": "application/octet-stream"
    }

    response = requests.post(ocr_url, headers=headers, data=image_data)
    response.raise_for_status()
    operation_url = response.headers["Operation-Location"]

    # poll
    import time
    while True:
        poll = requests.get(operation_url, headers={"Ocp-Apim-Subscription-Key": api_key})
        result = poll.json()
        status = result.get("status")
        if status in ("succeeded", "failed"):
            if status == "failed":
                raise RuntimeError("Azure OCR failed")
            break
        time.sleep(1)

    lines = []
    for read_result in result.get("analyzeResult", {}).get("readResults", []):
        for line in read_result.get("lines", []):
            lines.append(line.get("text", ""))
    return "\n".join(lines)


