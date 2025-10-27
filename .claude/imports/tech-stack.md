# Technology Stack & Versions

## Backend Stack

### Core Framework
- **FastAPI** ^0.119.1 - Modern async web framework
- **Python** ^3.12 - Language version
- **Uvicorn** ^0.38.0 - ASGI server with hot reload

### Database & ORM
- **SQLAlchemy** ^2.0.44 - ORM с async support (2.0 style)
- **Alembic** ^1.17.0 - Database migrations
- **asyncpg** ^0.30.0 - Fastest async PostgreSQL driver
- **PostgreSQL** 17 - Database (official Docker image: postgres:17-alpine)

### Data Validation
- **Pydantic** ^2.12.3 - Data validation и settings
- **pydantic-settings** ^2.11.0 - Configuration management

### Development Tools
- **Poetry** - Dependency management и packaging
- **pytest** ^8.4.2 - Testing framework
- **pytest-asyncio** ^1.2.0 - Async tests support
- **Black** ^25.9.0 - Code formatter (100 chars)
- **Ruff** ^0.14.2 - Fast linter

## Frontend Stack

### Core Framework
- **React** ^18.2.0 - UI library
- **TypeScript** ^5.2.2 - Type-safe JavaScript
- **Vite** ^5.0.0 - Build tool с HMR

### Styling
- **TailwindCSS** ^3.3.5 - Utility-first CSS
- **PostCSS** ^8.4.31 - CSS processing
- **Autoprefixer** ^10.4.16 - CSS vendor prefixes

### HTTP & State
- **Axios** ^1.6.0 - HTTP client
- **React Context API** - State management (no Redux yet)

### UI Components
- **Lucide React** ^0.294.0 - Icon library
- **clsx** ^2.0.0 - Conditional classnames

### Development Tools
- **ESLint** ^8.53.0 - Linting
- **@typescript-eslint** ^6.10.0 - TypeScript ESLint
- **Vitest** (planned) - Unit testing

## DevOps Stack

### Containerization
- **Docker** 24+ - Container platform
- **Docker Compose** - Multi-container orchestration

### Services
- **PostgreSQL** 17 (postgres:17-alpine)
- **Backend** (FastAPI on port 8000)
- **Frontend** (Vite dev on port 3000)

### Ports
- `5432` - PostgreSQL
- `8000` - Backend API
- `3000` - Frontend dev server

## Package Managers

### Backend
- **Poetry** - Modern Python dependency management
  - `pyproject.toml` - Dependencies и config
  - Lock file для reproducible builds

### Frontend
- **npm** - Node.js package manager
  - `package.json` - Dependencies
  - `package-lock.json` - Lock file

## Python Configuration (pyproject.toml)

```toml
[tool.poetry.dependencies]
python = "^3.12"
fastapi = "^0.119.1"
uvicorn = {extras = ["standard"], version = "^0.38.0"}
sqlalchemy = "^2.0.44"
alembic = "^1.17.0"
asyncpg = "^0.30.0"
pydantic = "^2.12.3"
pydantic-settings = "^2.11.0"
python-dotenv = "^1.1.1"

[tool.black]
line-length = 100
target-version = ['py312']

[tool.ruff]
line-length = 100
target-version = "py312"
```

## TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx"
  }
}
```

## Important Version Notes

### SQLAlchemy 2.0 Style
Используем новый declarative syntax с typed mapping:
```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
```

### FastAPI Async
Все endpoints async с async/await:
```python
@router.get("/migrations")
async def get_migrations() -> list[MigrationInfo]:
    return await alembic_service.get_history()
```

### React 18 Features
- Automatic batching
- Concurrent features
- New hooks (useId, useTransition)
- Strict mode in development

## Dependency Upgrade Strategy

**Check for updates**:
```bash
# Backend
cd backend && poetry show --outdated

# Frontend
cd frontend && npm outdated
```

**Critical packages to watch**:
- FastAPI (major releases могут иметь breaking changes)
- SQLAlchemy (2.x → 3.x в будущем)
- React (18.x → 19.x planned)
- TailwindCSS (следить за 4.0)

**Update policy**:
- Patch versions: auto-update
- Minor versions: review changelog, test
- Major versions: plan migration, update ADR
