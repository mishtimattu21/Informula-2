from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def analyze_image(request: Request):
    try:
        data = await request.json()
        image = data.get('image', '')
        return {"message": "Image analysis endpoint working", "received": len(image) > 0}
    except Exception as e:
        return {"error": str(e)}
