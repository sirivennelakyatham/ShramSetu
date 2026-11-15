from typing import Literal
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import Base, engine, SessionLocal, Report
from audio import router as audio_router
from pathway_rules import get_pathways
from speech import router as speech_router
from llm_conversation import router as conversation_router
from complaint_router import router as routing_router
from ngo_email import router as ngo_email_router

app = FastAPI(
    title="ShramSetu API",
    description="A multilingual, voice-first worker protection and support platform",
    version="1.0.0"
)

@app.post("/complaint-pathways")
def complaint_pathways(report: dict):
    try:
        pathways = get_pathways(report)
        return {
            "success": True,
            "count": len(pathways),
            "pathways": pathways
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to find complaint pathways: {str(e)}"
        )

app.include_router(audio_router)
app.include_router(speech_router)
app.include_router(conversation_router)
app.include_router(routing_router)
app.include_router(ngo_email_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables automatically
Base.metadata.create_all(bind=engine)


# Information received from the worker
class ReportRequest(BaseModel):
    category: Literal[
        "unpaid_wages",
        "safety_injury",
        "abuse_exploitation",
        "other"
    ]

    description: str = Field(min_length=1, max_length=5000)

    language: Literal["te", "hi", "en", "ta", "kn", "bn"]


@app.get("/")
def home():
    return {
        "message": "Welcome to ShramSetu!",
        "status": "Backend is running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": "ShramSetu"
    }


# Receive and save a worker's report
@app.post("/reports")
def receive_report(report: ReportRequest):

    db = SessionLocal()

    try:
        # Generate a unique Case ID
        case_id = f"SS-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid4().hex[:6].upper()}"

        # Create a new database record
        new_report = Report(
            case_id=case_id,
            category=report.category,
            description=report.description,
            language=report.language,
            status="report_saved"
        )

        # Save the report
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        return {
            "message": "Report saved successfully!",
            "case_id": new_report.case_id,
            "status": new_report.status,
            "category": new_report.category,
            "description": new_report.description,
            "language": new_report.language,
            "created_at": new_report.created_at.isoformat()
        }

    except Exception as error:
        db.rollback()
        print("Database error:", error)
        raise HTTPException(
            status_code=500,
            detail="Could not save the report."
        )

    finally:
        db.close()