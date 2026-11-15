from sqlalchemy import (
    create_engine,
    Column,
    String,
    Text,
    DateTime
)
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timezone

from sqlalchemy import Boolean
from uuid import uuid4
from sqlalchemy import ForeignKey


# SQLite database file
DATABASE_URL = "sqlite:///./shramsetu.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# Existing Report database table — preserved
class Report(Base):
    __tablename__ = "reports"

    case_id = Column(String, primary_key=True, index=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    status = Column(String, default="report_saved")
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


# New table for LLM conversations
class ConversationSession(Base):
    __tablename__ = "conversation_sessions"

    session_id = Column(String, primary_key=True, index=True)

    language = Column(String, nullable=False)

    # Stores the full conversation history as JSON text
    messages = Column(Text, nullable=False, default="[]")

    # Stores information extracted by the LLM as JSON text
    extracted_data = Column(Text, nullable=False, default="{}")

    # active, ready_for_review, confirmed, abandoned
    status = Column(String, nullable=False, default="active")

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Private worker information — never sent to Gemini
class Worker(Base):
    __tablename__ = "workers"

    worker_id = Column(
        String,
        primary_key=True,
        default=lambda: f"WRK-{uuid4().hex[:12].upper()}"
    )

    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    preferred_language = Column(String, nullable=False, default="en")

    current_city = Column(String, nullable=True)
    state_of_origin = Column(String, nullable=True)

    contact_consent = Column(Boolean, nullable=False, default=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    # AI-generated grievance drafts — not yet confirmed
class GrievanceDraft(Base):
    __tablename__ = "grievance_drafts"

    session_id = Column(
        String,
        ForeignKey("conversation_sessions.session_id"),
        primary_key=True
    )

    report_json = Column(Text, nullable=False)

    status = Column(
        String,
        nullable=False,
        default="awaiting_worker_review"
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )