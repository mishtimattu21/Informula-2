import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("models/gemini-1.5-flash")

def get_ingredient_report(prompt_text):
    response = model.generate_content(prompt_text)
    return response.text
