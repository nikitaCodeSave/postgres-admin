# Technology Stack

**Версия**: v0.1.0
**Последнее обновление**: 2025-10-27

## Overview

Полный перечень технологий, библиотек и инструментов используемых в проекте.

## Frontend Stack

### Core Framework
- **React 18.3.1** - UI library
  - Причина выбора: Industry standard, huge ecosystem, excellent dev tools
  - Альтернативы: Vue, Svelte, Angular
  - [Documentation](https://react.dev)

- **TypeScript 5.6+** - Programming language
  - Причина выбора: Type safety, better IDE support, catches errors at compile time
  - Альтернативы: JavaScript, Flow
  - [Documentation](https://www.typescriptlang.org)

### Build Tool
- **Vite 6.0+** - Build tool & dev server
  - Причина выбора: Fast HMR, modern ESM-based, great DX
  - Альтернативы: Webpack, Parcel, esbuild
  - Features: Hot Module Replacement, Fast builds, Plugin ecosystem
  - [Documentation](https://vitejs.dev)

### Styling
- **TailwindCSS 3.4+** - Utility-first CSS framework
  - Причина выбора: Rapid development, consistent design, small bundle size
  - Альтернативы: Bootstrap, Material-UI, styled-components
  - [Documentation](https://tailwindcss.com)

- **PostCSS** - CSS preprocessor
  - Used by TailwindCSS

### Routing
- **React Router 7.0+** - Client-side routing
  - Причина выбора: De-facto standard for React routing
  - Альтернативы: TanStack Router, Wouter
  - [Documentation](https://reactrouter.com)

### UI Components & Icons
- **Lucide React** - Icon library
  - Причина выбора: Beautiful, consistent icons, tree-shakeable
  - Альтернативы: React Icons, Font Awesome, Heroicons
  - [Documentation](https://lucide.dev)

### Development Tools
- **ESLint** - Linting
- **Prettier** (planned) - Code formatting
- **Vitest** (planned) - Unit testing

## Backend Stack

### Core Framework
- **FastAPI 0.115+** - Web framework
  - Причина выбора: Modern async Python, auto OpenAPI docs, Pydantic integration
  - Альтернативы: Django, Flask, Starlette
  - Features: Async/await, Type hints, Automatic API docs
  - [Documentation](https://fastapi.tiangolo.com)

- **Python 3.11+** - Programming language
  - Причина выбора: Mature ecosystem, great for data/DB work, readable syntax
  - Features: Type hints, async/await, rich standard library
  - [Documentation](https://docs.python.org/3/)

### Database & ORM
- **SQLAlchemy 2.0+** - ORM
  - Причина выбора: Industry standard, powerful, mature
  - Альтернативы: Django ORM, Peewee, Tortoise ORM
  - Features: 2.0 style with async support
  - [Documentation](https://docs.sqlalchemy.org)

- **Alembic 1.13+** - Database migrations
  - Причина выбора: De-facto standard for SQLAlchemy migrations
  - Альтернативы: Yoyo, SQLAlchemy-Migrate
  - [Documentation](https://alembic.sqlalchemy.org)

- **asyncpg** - Async PostgreSQL driver
  - Причина выбора: Fastest Python PostgreSQL driver
  - Альтернативы: psycopg3, psycopg2
  - [Documentation](https://magicstack.github.io/asyncpg/)

### Validation & Settings
- **Pydantic 2.0+** - Data validation
  - Причина выбора: Fast, integrated with FastAPI, excellent type support
  - Альтернативы: marshmallow, attrs
  - [Documentation](https://docs.pydantic.dev)

- **Pydantic Settings** - Configuration management
  - .env file loading
  - Type-safe settings

### Server
- **Uvicorn** - ASGI server
  - Причина выбора: Fast, async, standard ASGI server
  - Альтернативы: Hypercorn, Daphne
  - [Documentation](https://www.uvicorn.org)

### Development Tools
- **python-dotenv** - Environment variables
- **ruff** (planned) - Linting & formatting
- **pytest** (planned) - Testing
- **mypy** (planned) - Static type checking

## Database

### Primary Database
- **PostgreSQL 17** - Relational database
  - Причина выбора: Most advanced open-source RDBMS, excellent for complex queries
  - Альтернативы: MySQL, MariaDB, SQLite
  - Features: ACID, JSON support, full-text search, extensions
  - [Documentation](https://www.postgresql.org/docs/)

### Docker Image
- **postgres:17-alpine** - Official PostgreSQL image
  - Alpine Linux based (smaller size)

## Infrastructure

### Containerization
- **Docker 24+** - Container platform
  - Причина выбора: Industry standard, great for development & deployment
  - [Documentation](https://docs.docker.com)

- **Docker Compose** - Multi-container orchestration
  - Причина выбора: Simple setup for multiple services
  - Альтернативы: Kubernetes (overkill for POC), Docker Swarm
  - [Documentation](https://docs.docker.com/compose/)

### Version Control
- **Git** - Source control
- **GitHub** (planned) - Remote repository hosting

## Development Environment

### Required Tools
- Docker Desktop (Windows/Mac) или Docker Engine (Linux)
- Node.js 18+ (для frontend development)
- Python 3.11+ (для backend development)
- Git

### Recommended IDE
- **VS Code** with extensions:
  - Python
  - Pylance
  - ESLint
  - Prettier
  - Docker
  - PostgreSQL

### Optional Tools
- **pgAdmin 4** - PostgreSQL GUI (альтернатива нашему dashboard)
- **Postman** / **Insomnia** - API testing
- **curl** - CLI HTTP client

## Package Management

### Frontend
- **npm** - Node package manager
  - Альтернативы: yarn, pnpm, bun
  - `package.json` для dependencies

### Backend
- **pip** - Python package manager
- **pyproject.toml** - Modern Python project metadata (PEP 518)
- **Poetry** (planned) - Dependency management

## Dependencies Versions

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.0.2",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.3",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

### Backend (pyproject.toml)

```toml
[project]
name = "postgresql-admin-dashboard"
version = "0.1.0"
requires-python = ">=3.11"

dependencies = [
    "fastapi>=0.115.6",
    "uvicorn[standard]>=0.34.0",
    "sqlalchemy>=2.0.36",
    "alembic>=1.14.0",
    "asyncpg>=0.30.0",
    "pydantic>=2.10.5",
    "pydantic-settings>=2.7.1",
    "python-dotenv>=1.0.1",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "ruff>=0.8.0",
    "mypy>=1.8.0",
]
```

## CI/CD (Planned)

### GitHub Actions
- Linting (ESLint, Ruff)
- Type checking (TypeScript, mypy)
- Tests (Vitest, pytest)
- Build (Docker images)
- Deploy (planned)

### Docker Registry
- Docker Hub (public images)
- GitHub Container Registry (private images)

## Monitoring & Logging (Planned)

### Logging
- **structlog** - Structured logging
- **python-json-logger** - JSON log formatting

### Metrics
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization

### Tracing
- **OpenTelemetry** - Distributed tracing
- **Jaeger** - Trace visualization

### Error Tracking
- **Sentry** - Error monitoring

## Security

### Current
- Docker network isolation
- No exposed ports (except localhost)

### Planned
- **bcrypt** - Password hashing
- **PyJWT** - JWT tokens
- **python-multipart** - File uploads handling
- **rate-limiting** - API rate limits

## Performance

### Planned
- **Redis** - Caching layer
- **aioredis** - Async Redis client
- **ujson** - Faster JSON parsing

## Documentation

### Code Documentation
- **Docstrings** (Google style)
- **Type hints** (Python typing, TypeScript)

### API Documentation
- **OpenAPI/Swagger** - Auto-generated from FastAPI
- **ReDoc** - Alternative API docs UI

### Project Documentation
- **Markdown** - All documentation files
- **Mermaid** (planned) - Diagrams

## Version Management

### Semantic Versioning
- Format: `MAJOR.MINOR.PATCH`
- Current: `v0.1.0` (POC stage)

### Git Tags
```bash
git tag -a v0.1.0 -m "Initial POC release"
git push origin v0.1.0
```

## Technology Adoption Criteria

При выборе новых технологий учитываем:
1. **Maturity** - стабильность, production-ready
2. **Community** - активное community, хорошая документация
3. **Performance** - соответствует требованиям
4. **Developer Experience** - удобство разработки
5. **Ecosystem** - наличие плагинов, интеграций
6. **License** - совместимость с открытым кодом

## Related Documents

- **System Overview**: `/docs/architecture/system-overview.md`
- **Database Schema**: `/docs/architecture/database-schema.md`
- **ADR-0001**: Initial Architecture decisions
