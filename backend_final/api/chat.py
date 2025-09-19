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
async def chat_reply(request: Request):
    try:
        data = await request.json()
        question = data.get('question', '')
        return {"answer": f"Test response to: {question}"}
    except Exception as e:
        return {"error": str(e)}
