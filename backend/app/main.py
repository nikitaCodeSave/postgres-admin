"""Main FastAPI application for PostgreSQL Admin Dashboard"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import alembic

# Create FastAPI application
app = FastAPI(
    title="PostgreSQL Admin Dashboard API",
    description="Backend API for Visual Alembic UI and PostgreSQL management",
    version="0.1.0",
    debug=settings.debug,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(alembic.router)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "PostgreSQL Admin Dashboard API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
        "features": [
            "Visual Alembic UI (Killer Feature)",
            "Migration Management",
            "Database Browser (Coming Soon)",
        ],
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "configured" if settings.database_url else "not configured",
        "alembic_config": "configured" if settings.alembic_ini_path else "not configured",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
