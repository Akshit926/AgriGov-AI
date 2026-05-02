"""
AgriGov AI — FastAPI Backend
Intelligent AI-powered administration platform for agriculture department offices.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import connect_db, close_db
from app.routes import dashboard, documents, fraud, field, grievance, schemes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    print(f"\n{'='*50}")
    print(f"  {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"  Starting up...")
    print(f"{'='*50}\n")
    await connect_db()
    yield
    await close_db()
    print(f"\n[i] {settings.APP_NAME} shut down.\n")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Intelligent AI-powered administration platform for agriculture department offices. "
                "Automates document verification, fraud detection, field verification, "
                "grievance classification, and scheme demand prediction.",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard.router)
app.include_router(documents.router)
app.include_router(fraud.router)
app.include_router(field.router)
app.include_router(grievance.router)
app.include_router(schemes.router)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "ai_services": "active"}
