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
async def analyze_text(request: Request):
    try:
        data = await request.json()
        ingredients = data.get('ingredients', '')
        
        # Simple test response
        return {
            "overallScore": 85,
            "riskLevel": "Low", 
            "totalIngredients": 1,
            "flaggedIngredients": 0,
            "insights": [{
                "ingredient": ingredients,
                "risk": "safe",
                "description": f"Test response for {ingredients}",
                "source": "Test",
                "sources": ["Test"]
            }],
            "initialAnalysis": f"Test analysis for {ingredients}"
        }
    except Exception as e:
        return {"error": str(e)}
