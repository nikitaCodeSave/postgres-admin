# Architecture & Design Patterns

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────┐
│  React Frontend (Port 3000)             │
│  - Components (MigrationsPage)          │
│  - Hooks (useMigrations)                │
│  - API Client (axios)                   │
└────────────┬────────────────────────────┘
             │ HTTP REST API (JSON)
┌────────────▼────────────────────────────┐
│  FastAPI Backend (Port 8000)            │
│  - Routers (API endpoints)              │
│  - Services (AlembicService ⭐)         │
│  - Models (Pydantic)                    │
└────────────┬────────────────────────────┘
             │ asyncpg (SQL)
┌────────────▼────────────────────────────┐
│  PostgreSQL 17 (Port 5432)              │
│  - User tables                          │
│  - alembic_version                      │
└──────────────────────────────────────────┘
```

## Backend Architecture Patterns

### 1. Layered Architecture

**Router Layer** → **Service Layer** → **Model Layer** → **Database**

```python
# Router (app/routers/alembic.py)
# Handles HTTP requests, validation, responses
@router.get("/migrations")
async def get_migrations() -> list[MigrationInfo]:
    return await alembic_service.get_history()

# Service (app/services/alembic_service.py)
# Business logic, Alembic integration
class AlembicService:
    def get_history(self) -> list[MigrationInfo]:
        # Complex logic here
        pass

# Models (app/models/)
# SQLAlchemy ORM models
class User(Base):
    __tablename__ = "users"
    # ...
```

**Принципы**:
- Routers НЕ содержат бизнес-логику
- Services НЕ знают о HTTP
- Models НЕ знают о services

### 2. Dependency Injection

```python
from fastapi import Depends

def get_alembic_service() -> AlembicService:
    return AlembicService(config_path="alembic.ini")

@router.get("/migrations")
async def get_migrations(
    service: AlembicService = Depends(get_alembic_service)
) -> list[MigrationInfo]:
    return service.get_history()
```

### 3. Pydantic for Data Validation

```python
# Request models
class UpgradeRequest(BaseModel):
    revision: Optional[str] = "head"
    sql_mode: bool = False

# Response models
class MigrationInfo(BaseModel):
    revision: str
    message: str
    is_applied: bool

    model_config = ConfigDict(from_attributes=True)
```

### 4. Async/Await Throughout

```python
# All I/O operations async
async def get_user(session: AsyncSession, user_id: int) -> Optional[User]:
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# Use asyncio.gather for parallel operations
users, posts = await asyncio.gather(
    get_users(),
    get_posts(),
)
```

## Frontend Architecture Patterns

### 1. Component-Based Architecture

```
MigrationsPage (Container)
├── MigrationTimeline (Presentational)
│   └── MigrationItem (Presentational)
├── MigrationActions (Container)
│   ├── ApplyButton
│   └── RollbackButton
└── StatusBar (Presentational)
```

**Container Components**: Manage state, data fetching
**Presentational Components**: Pure UI, receive props

### 2. Custom Hooks for Logic Reuse

```typescript
// hooks/useMigrations.ts
export const useMigrations = () => {
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMigrations = async () => {
    // Logic here
  };

  const applyMigration = async (revision: string) => {
    // Logic here
  };

  return { migrations, loading, error, applyMigration };
};

// Usage in component
const { migrations, applyMigration } = useMigrations();
```

### 3. Service Layer for API Calls

```typescript
// services/api.ts
export const migrationApi = {
  getHistory: async (): Promise<Migration[]> => {
    const response = await axios.get('/api/migrations');
    return response.data;
  },

  upgrade: async (revision?: string): Promise<void> => {
    await axios.post('/api/migrations/upgrade', { revision });
  },
};
```

### 4. Type-Safe API Client

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  detail: string;
}

// Usage
const response: ApiResponse<Migration[]> = await api.get('/migrations');
```

## Project-Specific Patterns

### 1. AlembicService Pattern (CORE INNOVATION ⭐)

**Problem**: Alembic is CLI-only, hard to integrate in web app

**Solution**: Python API wrapper that exposes Alembic functionality programmatically

```python
from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory

class AlembicService:
    def __init__(self, config_path: str = "alembic.ini"):
        self.config = Config(config_path)
        self.script = ScriptDirectory.from_config(self.config)

    def get_history(self) -> list[MigrationInfo]:
        """Get all migrations via Alembic Python API."""
        revisions = list(self.script.walk_revisions())
        current = self.get_current_revision()

        return [
            MigrationInfo(
                revision=rev.revision,
                parent_revision=rev.down_revision,
                message=rev.doc,
                is_applied=self._is_applied(rev.revision, current),
            )
            for rev in revisions
        ]

    def upgrade(self, revision: str = "head") -> None:
        """Apply migrations using Alembic command API."""
        command.upgrade(self.config, revision)

    def downgrade(self, revision: str) -> None:
        """Rollback migrations using Alembic command API."""
        command.downgrade(self.config, revision)
```

**Why this matters**:
- Direct Python API access (no subprocess calls)
- Type-safe return values
- Proper error handling
- Testable without Alembic CLI

### 2. Sidecar Pattern for User Projects

**Problem**: Users want to use UI with their existing projects

**Solution**: Mount user project as Docker volume

```yaml
# docker-compose.yml
services:
  backend:
    volumes:
      - ./example_project:/user-project:ro  # Read-only mount
    environment:
      - ALEMBIC_CONFIG=/user-project/alembic.ini
```

**Benefits**:
- No code changes needed in user project
- Isolated environments
- Works with any SQLAlchemy + Alembic project

### 3. Zero-Config Philosophy

**Principle**: Application должно работать без configuration files

**Implementation**:
```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Defaults that "just work"
    database_url: str = "postgresql://pguser:pgpass@db:5432/pgadmin"
    alembic_config_path: str = "/app/alembic.ini"
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
```

**Result**: `docker-compose up` и всё работает

### 4. API-First Design

**Principle**: Backend = pure API, frontend = pure client

```python
# Backend exposes OpenAPI
app = FastAPI(
    title="PostgreSQL Admin Dashboard API",
    description="REST API for Alembic migrations management",
    version="0.1.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc", # ReDoc
)
```

**Benefits**:
- API docs auto-generated
- Easy to test (curl, Postman)
- Frontend can be replaced
- Mobile app possible

## Error Handling Strategy

### Backend Errors
```python
# Custom exception types
class AlembicError(Exception):
    """Base exception for Alembic operations."""
    pass

class MigrationNotFoundError(AlembicError):
    """Raised when migration revision doesn't exist."""
    pass

# Convert to HTTP errors at router level
@router.post("/upgrade")
async def upgrade(request: UpgradeRequest):
    try:
        await service.upgrade(request.revision)
        return {"status": "success"}
    except MigrationNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except AlembicError as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Frontend Errors
```typescript
// Centralized error handling
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || 'API request failed';
  }
  return 'An unexpected error occurred';
};

// Usage
try {
  await api.upgradeMigrations();
} catch (error) {
  setError(handleApiError(error));
}
```

## Performance Patterns

### 1. Connection Pooling
```python
# SQLAlchemy async engine with pooling
engine = create_async_engine(
    settings.database_url,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)
```

### 2. Caching Strategy
```python
from functools import lru_cache

# Cache Alembic config (expensive to create)
@lru_cache(maxsize=1)
def get_alembic_config() -> Config:
    return Config("alembic.ini")
```

### 3. Pagination (Planned)
```python
@router.get("/migrations")
async def get_migrations(
    skip: int = 0,
    limit: int = 100,
) -> list[MigrationInfo]:
    return service.get_history(skip=skip, limit=limit)
```

## Security Considerations

### Current POC Level
- ⚠️ No authentication (local development only)
- ⚠️ No rate limiting
- ⚠️ CORS open for localhost

### Production Requirements
```python
# Add authentication
from fastapi import Security
from fastapi.security import HTTPBearer

security = HTTPBearer()

@router.post("/upgrade")
async def upgrade(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    # Verify JWT token
    pass

# Add rate limiting
from slowapi import Limiter

limiter = Limiter(key_func=lambda request: request.client.host)

@app.get("/migrations")
@limiter.limit("10/minute")
async def get_migrations():
    pass
```

## Testing Strategy

### Backend Tests (Planned)
```python
# tests/test_alembic_service.py
import pytest
from app.services.alembic_service import AlembicService

@pytest.fixture
def service():
    return AlembicService(config_path="test_alembic.ini")

async def test_get_history(service):
    history = service.get_history()
    assert isinstance(history, list)
    assert len(history) >= 0
```

### Frontend Tests (Planned)
```typescript
// components/__tests__/MigrationItem.test.tsx
import { render, screen } from '@testing-library/react';
import { MigrationItem } from '../MigrationItem';

test('renders migration info', () => {
  const migration = {
    revision: 'abc123',
    message: 'Create users table',
    is_applied: true,
  };

  render(<MigrationItem migration={migration} />);

  expect(screen.getByText('abc123')).toBeInTheDocument();
  expect(screen.getByText('Create users table')).toBeInTheDocument();
});
```

## Documentation Pattern

**Every feature follows**: Backlog → Implementation → Spec → CHANGELOG → Journal

```
1. /new-feature database-browser
2. Implement the feature
3. /create-spec database-browser
4. /log-change
5. /log-dev
```

Detailed architecture docs: `@docs/architecture/system-overview.md`
