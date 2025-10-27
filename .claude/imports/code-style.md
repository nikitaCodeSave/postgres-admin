# Code Style & Conventions

## Python (Backend)

### Formatting
- **Black** formatter (100 characters line length)
- **Ruff** linter (Python 3.12 target)
- **Type hints** обязательны для всех function signatures
- **Docstrings** для public functions (Google style)

```python
from typing import Optional

async def get_migration_history(
    limit: Optional[int] = None,
    offset: int = 0
) -> list[MigrationInfo]:
    """Get migration history from Alembic.

    Args:
        limit: Maximum number of migrations to return
        offset: Number of migrations to skip

    Returns:
        List of migration information objects

    Raises:
        AlembicError: If Alembic command fails
    """
    pass
```

### Naming Conventions
- **snake_case** - functions, variables, file names
- **PascalCase** - classes
- **SCREAMING_SNAKE_CASE** - constants
- **_leading_underscore** - private/internal methods

```python
# Good
def calculate_total_amount() -> float:
    pass

class AlembicService:
    pass

DATABASE_URL = "postgresql://..."

def _internal_helper() -> None:
    pass
```

### Import Organization
```python
# 1. Standard library
import os
from typing import Optional

# 2. Third-party
from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# 3. Local app imports
from app.config import settings
from app.services.alembic_service import AlembicService
from app.models.migration import MigrationInfo
```

### FastAPI Patterns
```python
# Router setup
router = APIRouter(prefix="/api/alembic", tags=["alembic"])

# Async endpoints always
@router.get("/migrations")
async def get_migrations() -> list[MigrationInfo]:
    """Get all migrations."""
    return await alembic_service.get_history()

# Use Pydantic models for request/response
@router.post("/upgrade")
async def upgrade_migrations(
    request: UpgradeRequest
) -> UpgradeResponse:
    """Apply pending migrations."""
    pass

# HTTP exceptions for errors
if not migration_exists:
    raise HTTPException(
        status_code=404,
        detail=f"Migration {revision} not found"
    )
```

### SQLAlchemy 2.0 Style
```python
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)

    # Relationships with type hints
    posts: Mapped[list["Post"]] = relationship(back_populates="user")
```

### Async/Await Consistency
```python
# Always async for I/O operations
async def get_user(user_id: int) -> Optional[User]:
    async with get_session() as session:
        result = await session.get(User, user_id)
        return result

# Use asyncio utilities when needed
import asyncio
results = await asyncio.gather(
    fetch_users(),
    fetch_posts(),
)
```

## TypeScript (Frontend)

### Formatting
- **2-space indentation** (не tabs, не 4 spaces)
- **Semicolons** required
- **Single quotes** для строк
- **Trailing commas** in objects/arrays
- **ESLint** + **@typescript-eslint**

```typescript
import { useState, useEffect } from 'react';

const MIGRATIONS_ENDPOINT = '/api/migrations';

export const useMigrations = (): UseMigrationsReturn => {
  const [migrations, setMigrations] = useState<Migration[]>([]);

  // ...
};
```

### Naming Conventions
- **camelCase** - variables, functions, methods
- **PascalCase** - components, classes, interfaces, types
- **SCREAMING_SNAKE_CASE** - constants
- **kebab-case** - file names

```typescript
// Files
migration-item.tsx
use-migrations.ts
api-client.ts

// Code
interface MigrationInfo {
  revision: string;
  message: string;
}

const API_BASE_URL = 'http://localhost:8000';

function fetchMigrations(): Promise<Migration[]> {
  // ...
}

export const MigrationItem: React.FC<Props> = ({ migration }) => {
  // ...
};
```

### Import Organization
```typescript
// 1. React & external libraries
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal services/utils
import { apiClient } from '../services/api';
import { formatDate } from '../utils/date';

// 3. Types
import type { Migration, MigrationStatus } from '../types';

// 4. Styles (if separate)
import './MigrationItem.css';
```

### React Patterns

#### Functional Components Only
```typescript
// ✅ Good - Functional with TypeScript
export const MigrationItem: React.FC<MigrationItemProps> = ({
  migration,
  onApply,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="migration-item">
      {/* ... */}
    </div>
  );
};

// ❌ Bad - Class components (not used in this project)
class MigrationItem extends React.Component { }
```

#### Type Safety
```typescript
// Define props interface
interface MigrationItemProps {
  migration: Migration;
  onApply: (revision: string) => void;
  onRollback?: (revision: string) => void; // Optional
}

// Use type for return values
const useMigrations = (): UseMigrationsReturn => {
  // ...
};

// Type event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  // ...
};
```

#### Hooks Best Practices
```typescript
// Custom hooks start with "use"
export const useMigrations = () => {
  const [data, setData] = useState<Migration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Cleanup function
    const abortController = new AbortController();

    fetchData(abortController.signal);

    return () => abortController.abort();
  }, [/* dependencies */]);

  return { data, loading, error };
};
```

### TailwindCSS Conventions
```tsx
// Use clsx for conditional classes
import clsx from 'clsx';

<div className={clsx(
  'migration-item',
  'p-4 rounded-lg',
  isApplied && 'bg-green-100',
  !isApplied && 'bg-gray-100',
  isLoading && 'opacity-50 cursor-wait'
)}>
```

## File Organization

### Backend Structure
```
app/
├── __init__.py
├── main.py              # FastAPI app entry
├── config.py            # Settings (Pydantic)
├── models/              # SQLAlchemy models
│   ├── __init__.py
│   ├── base.py          # Base class
│   └── user.py          # Individual models
├── routers/             # API endpoints
│   ├── __init__.py
│   └── alembic.py       # Grouped by domain
├── services/            # Business logic
│   ├── __init__.py
│   └── alembic_service.py
└── utils/               # Utilities
    ├── __init__.py
    └── helpers.py
```

### Frontend Structure
```
src/
├── main.tsx             # Entry point
├── App.tsx              # Root component
├── components/          # React components
│   ├── MigrationsPage.tsx
│   ├── MigrationItem.tsx
│   └── LoadingSpinner.tsx
├── hooks/               # Custom hooks
│   └── useMigrations.ts
├── services/            # API clients
│   └── api.ts
├── types/               # TypeScript types
│   └── migration.ts
└── utils/               # Utility functions
    └── formatters.ts
```

## Comments & Documentation

### When to Comment
```python
# ✅ Good - Explain WHY, not WHAT
# Cache migration history for 5 minutes to reduce Alembic calls
@lru_cache(maxsize=1)
def get_cached_history() -> list[MigrationInfo]:
    pass

# ✅ Good - Explain complex logic
# Use Set to deduplicate while preserving order O(n) instead of list O(n²)
seen = set()
unique_items = [x for x in items if not (x in seen or seen.add(x))]

# ❌ Bad - State the obvious
# Create a variable called count
count = 0
```

### Docstrings (Python)
```python
# Google style for consistency
def process_migration(
    revision: str,
    direction: str = "up"
) -> MigrationResult:
    """Process a database migration.

    Args:
        revision: Migration revision hash (e.g., "abc123")
        direction: Direction to migrate ("up" or "down")

    Returns:
        Result object with status and affected tables

    Raises:
        AlembicError: If migration execution fails
        ValueError: If direction is invalid

    Example:
        >>> result = process_migration("abc123", "up")
        >>> print(result.status)
        "success"
    """
    pass
```

### JSDoc (TypeScript)
```typescript
/**
 * Fetch migration history from backend API
 *
 * @param limit - Maximum number of migrations to return
 * @returns Promise resolving to array of migrations
 * @throws {AxiosError} If API request fails
 *
 * @example
 * ```typescript
 * const migrations = await fetchMigrations(10);
 * console.log(migrations.length); // <= 10
 * ```
 */
export async function fetchMigrations(
  limit?: number
): Promise<Migration[]> {
  // ...
}
```

## Error Handling

### Backend
```python
from fastapi import HTTPException

# Use specific HTTP exceptions
if not user:
    raise HTTPException(
        status_code=404,
        detail="User not found"
    )

# Catch and wrap external errors
try:
    result = await alembic_service.upgrade()
except AlembicCommandError as e:
    raise HTTPException(
        status_code=500,
        detail=f"Migration failed: {str(e)}"
    )
```

### Frontend
```typescript
// Use try-catch for async operations
try {
  const migrations = await api.getMigrations();
  setMigrations(migrations);
} catch (error) {
  if (axios.isAxiosError(error)) {
    setError(error.response?.data?.detail || 'Failed to fetch migrations');
  } else {
    setError('An unexpected error occurred');
  }
}
```

## Code Review Checklist

**Before Committing**:
- [ ] Code formatted (Black/ESLint)
- [ ] No linting errors (Ruff/ESLint)
- [ ] Type hints added (Python)
- [ ] Types defined (TypeScript)
- [ ] Tests pass (pytest/vitest)
- [ ] No console.log/print statements
- [ ] Comments explain WHY, not WHAT
- [ ] Imports organized correctly
