"""API routes for Alembic migration management - KILLER FEATURE"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict

from ..services.alembic_service import AlembicService
from ..config import settings

router = APIRouter(prefix="/api/alembic", tags=["Alembic Migrations"])


def get_alembic_service() -> AlembicService:
    """Dependency to get AlembicService instance"""
    return AlembicService(
        alembic_ini_path=settings.alembic_ini_path,
        database_url=settings.database_url,
    )


@router.get("/migrations", response_model=List[Dict])
async def get_migrations(
    service: AlembicService = Depends(get_alembic_service),
):
    """
    Get list of all Alembic migrations with their status

    Returns:
        List of migrations with metadata (revision, message, is_current, is_pending)
    """
    try:
        migrations = service.get_migrations()
        return [m.to_dict() for m in migrations]
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get migrations: {str(e)}")


@router.get("/status", response_model=Dict)
async def get_migration_status(
    service: AlembicService = Depends(get_alembic_service),
):
    """
    Get current migration status

    Returns:
        Current revision, total migrations, pending count
    """
    try:
        return service.get_current_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")


@router.post("/upgrade", response_model=Dict)
async def upgrade_migrations(
    service: AlembicService = Depends(get_alembic_service),
):
    """
    Apply all pending migrations (alembic upgrade head)

    Returns:
        Status and message
    """
    try:
        result = service.upgrade_to_head()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upgrade: {str(e)}")


@router.post("/downgrade", response_model=Dict)
async def downgrade_migration(
    service: AlembicService = Depends(get_alembic_service),
):
    """
    Rollback one migration (alembic downgrade -1)

    Returns:
        Status and message
    """
    try:
        result = service.downgrade_one_step()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to downgrade: {str(e)}")


@router.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {
        "status": "healthy",
        "service": "Alembic Migration Service",
        "version": "0.1.0",
    }
