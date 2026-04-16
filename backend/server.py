from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime, timezone
from google import genai
from google.genai import types

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import certifi

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url, tlsCAFile=certifi.where())
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

SYSTEM_MESSAGE = """You are a healthcare educational assistant. Analyze symptoms and respond with ONLY a valid JSON object (no markdown, no code blocks, just raw JSON).

The JSON must contain:
{
  "conditions": [
    {
      "name": "Condition Name",
      "description": "Brief 1-2 sentence description of the condition.",
      "likelihood": "high" | "medium" | "low"
    }
  ],
  "next_steps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "disclaimer": "This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider."
}

Rules:
- Provide 3-5 conditions sorted by likelihood (high first)
- Provide 3-5 actionable next steps
- Never make definitive diagnoses
- Always recommend consulting a healthcare professional
- Respond ONLY with raw JSON, absolutely no other text"""


# --- Pydantic Models ---
class SymptomInput(BaseModel):
    symptoms: str


class Condition(BaseModel):
    name: str
    description: str
    likelihood: str


class SymptomCheckResponse(BaseModel):
    id: str
    symptoms: str
    conditions: List[Condition]
    next_steps: List[str]
    disclaimer: str
    created_at: str


# --- Helper ---
def doc_to_response(doc: dict) -> SymptomCheckResponse:
    created = doc.get("created_at", "")
    if isinstance(created, datetime):
        created = created.isoformat()
    return SymptomCheckResponse(
        id=doc["id"],
        symptoms=doc["symptoms"],
        conditions=[Condition(**c) for c in doc["conditions"]],
        next_steps=doc["next_steps"],
        disclaimer=doc["disclaimer"],
        created_at=created,
    )


# --- Routes ---
@api_router.get("/")
async def root():
    return {"message": "Healthcare Symptom Checker API"}


@api_router.post("/symptoms/check", response_model=SymptomCheckResponse)
async def check_symptoms(input: SymptomInput):
    if not input.symptoms or len(input.symptoms.strip()) < 5:
        raise HTTPException(status_code=400, detail="Please provide a meaningful symptom description.")

    llm_key = os.environ.get("GEMINI_API_KEY")
    if not llm_key:
        raise HTTPException(status_code=500, detail="LLM API key not configured. Set GEMINI_API_KEY environment variable.")

    try:
        client = genai.Client(api_key=llm_key)
        prompt = f"Based on these symptoms, suggest possible conditions and next steps with educational disclaimer: {input.symptoms}"
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_MESSAGE
            )
        )
        response_text = response.text
        logger.info(f"LLM raw response: {response_text[:200]}")

        # Strip any markdown fences if present
        cleaned = response_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()

        parsed = json.loads(cleaned)

        conditions = [Condition(**c) for c in parsed.get("conditions", [])]
        next_steps = parsed.get("next_steps", [])
        disclaimer = parsed.get("disclaimer", "This information is for educational purposes only.")

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e} | response: {response_text}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response. Please try again.")
    except Exception as e:
        logger.error(f"LLM error: {e}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    record_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    doc = {
        "id": record_id,
        "symptoms": input.symptoms,
        "conditions": [c.model_dump() for c in conditions],
        "next_steps": next_steps,
        "disclaimer": disclaimer,
        "created_at": now.isoformat(),
    }
    await db.symptom_checks.insert_one(doc)

    return SymptomCheckResponse(
        id=record_id,
        symptoms=input.symptoms,
        conditions=conditions,
        next_steps=next_steps,
        disclaimer=disclaimer,
        created_at=now.isoformat(),
    )


@api_router.get("/history", response_model=List[SymptomCheckResponse])
async def get_history():
    docs = await db.symptom_checks.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [doc_to_response(d) for d in docs]


@api_router.get("/history/{check_id}", response_model=SymptomCheckResponse)
async def get_history_item(check_id: str):
    doc = await db.symptom_checks.find_one({"id": check_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Record not found.")
    return doc_to_response(doc)


@api_router.delete("/history/{check_id}")
async def delete_history_item(check_id: str):
    result = await db.symptom_checks.delete_one({"id": check_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found.")
    return {"message": "Deleted successfully."}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
