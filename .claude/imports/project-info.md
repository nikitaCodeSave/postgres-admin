# Project Information - PostgreSQL Admin Dashboard

## Project Identity

**Name**: PostgreSQL Admin Dashboard
**Version**: v0.1.0 (POC Stage → MVP)
**Status**: Active Development
**License**: MIT

## Mission

Первый в мире Visual UI для Alembic миграций - developer tool для Python-разработчиков работающих с PostgreSQL + SQLAlchemy + Alembic.

## Killer Feature

**Visual Alembic UI** - графический интерфейс для управления database migrations вместо CLI команд. За 14 лет существования Alembic это первый полноценный GUI.

**Проблема**: Разработчики вынуждены использовать CLI для каждой операции с миграциями.

**Решение**: Beautiful web UI с timeline visualization, one-click apply/rollback, real-time status.

## Target Audience

**Primary**: Python Backend Разработчики (Junior-Middle)
- Используют FastAPI / Flask / Django
- SQLAlchemy + Alembic ежедневно
- PostgreSQL в Docker
- Стартапы без dedicated DBA

**Market Size**: ~3M Python developers используют SQLAlchemy + Alembic

## Project Structure

```
Postgresql/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routers/     # API endpoints
│   │   ├── services/    # Business logic (AlembicService ⭐)
│   │   ├── config.py    # Settings (Pydantic)
│   │   └── main.py      # FastAPI app
│   └── pyproject.toml   # Poetry dependencies
│
├── frontend/            # React + TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components (MigrationsPage ⭐)
│   │   ├── services/    # API client
│   │   └── types/       # TypeScript types
│   └── package.json     # npm dependencies
│
├── example_project/     # Demo project для тестирования
│   ├── models/          # SQLAlchemy models
│   └── alembic/         # Example migrations
│
├── docs/                # Comprehensive documentation
│   ├── adr/            # Architecture Decision Records
│   ├── backlog/        # Features, Bugs, Improvements
│   ├── specs/          # Implemented features specs
│   ├── dev-journal/    # Development journal
│   ├── architecture/   # System design docs
│   └── CHANGELOG.md    # Release history
│
├── .claude/            # Claude Code configuration
│   ├── commands/       # 10 slash commands
│   ├── agents/         # postgres-python-expert subagent
│   └── imports/        # Modular CLAUDE.md components
│
└── docker-compose.yml  # Full stack orchestration
```

## Key Directories to Know

- **backend/app/services/alembic_service.py** - Core innovation: Python API wrapper над Alembic CLI
- **frontend/src/components/MigrationsPage.tsx** - Visual Alembic UI implementation (350+ LOC)
- **docs/** - 2000+ lines comprehensive documentation
- **.claude/commands/** - 10 specialized workflow commands

## Development Philosophy

1. **Zero-Config**: `docker-compose up` и всё работает
2. **Visual First**: Все операции через UI, не CLI
3. **Developer Experience**: Dark theme, keyboard shortcuts, intuitive UX
4. **Documentation-Driven**: Все решения документированы (ADR, specs, journal)
5. **Best Practices**: Conventional commits, semantic versioning, Keep a Changelog

## Current Roadmap

### ✅ POC Complete (v0.1.0)
- Visual Alembic UI
- Migration timeline visualization
- Apply/Rollback through UI
- Docker Compose setup

### 🔄 MVP In Progress (v0.2.0)
- Database Browser (CRUD через UI)
- Query Editor с SQL highlighting
- Schema visualization
- Tests (pytest + vitest)

### 🔮 Future (v1.0.0)
- ER diagram из SQLAlchemy models
- ORM Code Generator (DB → SQLAlchemy)
- Multi-database support
- Team collaboration features
