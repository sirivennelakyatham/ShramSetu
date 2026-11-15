import os
import requests

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GNANI_API_KEY = os.getenv("GNANI_API_KEY")
GNANI_STT_URL = "https://api.vachana.ai/stt/v3"

LANGUAGE_CODES = {
    "en": "en-IN",
    "hi": "hi-IN",
    "te": "te-IN",
    "ta": "ta-IN",
    "kn": "kn-IN",
    "bn": "bn-IN",
}


@router.post("/speech/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language: str = Form("en")
):
    if not GNANI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gnani API key is missing from backend .env"
        )

    language_code = LANGUAGE_CODES.get(language, "en-IN")

    audio_data = await audio_file.read()

    if not audio_data:
        raise HTTPException(
            status_code=400,
            detail="No audio was received."
        )

    files = {
        "audio_file": (
            audio_file.filename or "recording.webm",
            audio_data,
            audio_file.content_type or "application/octet-stream"
        )
    }

    payload = {
        "language_code": language_code,
        "preferred_language": language_code,
        "format": "transcribe",
        "itn_native_numerals": "true"
    }

    headers = {
        "X-API-Key-ID": GNANI_API_KEY
    }

    try:
        response = requests.post(
            GNANI_STT_URL,
            files=files,
            data=payload,
            headers=headers,
            timeout=90
        )

        if not response.ok:
            print("GNANI STATUS:", response.status_code)
            print("GNANI RESPONSE:", response.text[:1500])

            raise HTTPException(
                status_code=502,
                detail=f"Gnani returned HTTP {response.status_code}. Check backend terminal."
            )

        result = response.json()

        transcript = result.get("transcript", "").strip()

        if not result.get("success") or not transcript:
            print("GNANI RESPONSE:", result)
            raise HTTPException(
                status_code=502,
                detail="Gnani did not return a transcript."
            )

        return {
            "success": True,
            "transcript": transcript
        }

    except requests.RequestException as exc:
        print("GNANI CONNECTION ERROR:", repr(exc))

        raise HTTPException(
            status_code=502,
            detail="Could not connect to Gnani speech recognition."
        )