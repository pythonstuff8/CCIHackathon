"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import auth, journal, checkin, alerts, dashboard, onboarding, resources

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize database on startup."""
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized.")
    yield


app = FastAPI(
    title="Whisper API",
    description="Backend API for the Whisper teen crisis companion app.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(journal.router)
app.include_router(checkin.router)
app.include_router(alerts.router)
app.include_router(dashboard.router)
app.include_router(onboarding.router)
app.include_router(resources.router)


@app.get("/api/health")
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "healthy", "app": "whisper"}
