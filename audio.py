import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from gnani.tts import GnaniTTSClient, AudioConfig

load_dotenv(Path(__file__).resolve().parent / ".env")

GNANI_API_KEY = os.getenv("GNANI_API_KEY")

router = APIRouter(prefix="/audio", tags=["Audio"])

LANGUAGE_CODES = {
    "en": "en-IN",
    "hi": "hi-IN",
    "te": "te-IN",
    "ta": "ta-IN",
    "kn": "kn-IN",
    "bn": "bn-IN",
}

DEFAULT_VOICES = {
    "en": "Kaveri",
    "hi": "Yashvi",
    "te": "Suhana",
    "ta": "Asmita",
    "kn": "Kaveri",
    "bn": "Mehuli",
}


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    language: str
    voice: str | None = None


@router.post("/tts")
def generate_speech(data: TTSRequest):

    if not GNANI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gnani API key is not configured."
        )

    language_code = LANGUAGE_CODES.get(data.language)

    if not language_code:
        raise HTTPException(
            status_code=400,
            detail="Unsupported language."
        )

    voice = data.voice or DEFAULT_VOICES[data.language]

    try:
        client = GnaniTTSClient(api_key=GNANI_API_KEY)

        audio = client.synthesize(
            data.text,
            voice=voice,
            model="timbre-v2.5",
            language=language_code,
            speed=0.85,
            audio_config=AudioConfig(
                container="mp3",
                sample_rate=48000,
                bitrate="128k"
            )
        )

        if not audio:
            raise RuntimeError("Gnani returned empty audio.")

        print(
            f"TTS SUCCESS: language={language_code}, "
            f"voice={voice}, bytes={len(audio)}"
        )

        return Response(
            content=audio,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3"
            }
        )

    except Exception as error:
        print("GNANI TTS ERROR:", repr(error))

        raise HTTPException(
            status_code=502,
            detail=f"Speech generation failed: {str(error)[:500]}"
        )