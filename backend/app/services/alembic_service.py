"""Service for interacting with Alembic migrations - KILLER FEATURE"""

import os
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, text


class AlembicMigration:
    """Model for Alembic migration metadata"""

    def __init__(
        self,
        revision: str,
        down_revision: Optional[str],
        message: str,
        is_current: bool = False,
        is_pending: bool = False,
        created_date: Optional[str] = None,
    ):
        self.revision = revision
        self.down_revision = down_revision
        self.message = message
        self.is_current = is_current
        self.is_pending = is_pending
        self.created_date = created_date

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "revision": self.revision,
            "down_revision": self.down_revision,
            "message": self.message,
            "is_current": self.is_current,
            "is_pending": self.is_pending,
            "created_date": self.created_date,
        }


class AlembicService:
    """Service for managing Alembic migrations through Python API"""

    def __init__(self, alembic_ini_path: str, database_url: str):
        """
        Initialize Alembic service

        Args:
            alembic_ini_path: Path to alembic.ini file
            database_url: Database connection URL
        """
        self.alembic_ini_path = alembic_ini_path
        self.database_url = database_url
        self._config: Optional[Config] = None

    def _get_config(self) -> Config:
        """Get or create Alembic configuration"""
        if self._config is None:
            if not os.path.exists(self.alembic_ini_path):
                raise FileNotFoundError(f"Alembic config not found: {self.alembic_ini_path}")

            self._config = Config(self.alembic_ini_path)
            # Override database URL from environment
            self._config.set_main_option("sqlalchemy.url", self.database_url.replace('+asyncpg', ''))

        return self._config

    def _get_current_revision(self) -> Optional[str]:
        """Get current database revision from alembic_version table"""
        try:
            # Use sync engine for Alembic operations
            sync_db_url = self.database_url.replace('+asyncpg', '+psycopg2')
            engine = create_engine(sync_db_url)

            with engine.connect() as connection:
                context = MigrationContext.configure(connection)
                current_rev = context.get_current_revision()
                return current_rev
        except Exception as e:
            # Table might not exist yet
            return None

    def get_migrations(self) -> List[AlembicMigration]:
        """
        Get list of all migrations with their status

        Returns:
            List of AlembicMigration objects with metadata
        """
        config = self._get_config()
        script_dir = ScriptDirectory.from_config(config)
        current_revision = self._get_current_revision()

        migrations = []
        current_found = current_revision is None  # If no current, all are pending

        # Walk revisions from newest to oldest
        for revision in script_dir.walk_revisions():
            is_current = revision.revision == current_revision
            is_pending = not current_found

            if is_current:
                current_found = True

            # Extract creation date from revision file if possible
            created_date = None
            if hasattr(revision, 'module'):
                module_path = revision.module.__file__
                if module_path:
                    stat = os.stat(module_path)
                    created_date = datetime.fromtimestamp(stat.st_mtime).isoformat()

            migration = AlembicMigration(
                revision=revision.revision,
                down_revision=revision.down_revision,
                message=revision.doc or "No description",
                is_current=is_current,
                is_pending=is_pending,
                created_date=created_date,
            )
            migrations.append(migration)

        # Reverse to show oldest first
        migrations.reverse()

        return migrations

    def upgrade_to_head(self) -> Dict[str, str]:
        """
        Apply all pending migrations (alembic upgrade head)

        Returns:
            Dict with status and message
        """
        try:
            config = self._get_config()
            command.upgrade(config, "head")
            return {
                "status": "success",
                "message": "Successfully upgraded to head revision",
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to upgrade: {str(e)}",
            }

    def downgrade_one_step(self) -> Dict[str, str]:
        """
        Rollback one migration (alembic downgrade -1)

        Returns:
            Dict with status and message
        """
        try:
            config = self._get_config()
            command.downgrade(config, "-1")
            return {
                "status": "success",
                "message": "Successfully downgraded one revision",
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to downgrade: {str(e)}",
            }

    def get_current_info(self) -> Dict:
        """
        Get current migration status information

        Returns:
            Dict with current revision and pending count
        """
        current_revision = self._get_current_revision()
        migrations = self.get_migrations()
        pending_count = sum(1 for m in migrations if m.is_pending)

        return {
            "current_revision": current_revision or "No migrations applied",
            "total_migrations": len(migrations),
            "pending_migrations": pending_count,
            "is_up_to_date": pending_count == 0,
        }
