# System Overview - PostgreSQL Admin Dashboard

**Версия**: v0.1.0
**Последнее обновление**: 2025-10-27

## Назначение системы

PostgreSQL Admin Dashboard - веб-приложение для управления PostgreSQL базами данных с визуальным интерфейсом для Alembic миграций.

**Killer Feature**: Visual Alembic UI - первый в мире графический интерфейс для управления Alembic миграциями.

## Целевая аудитория

- Backend разработчики, использующие PostgreSQL + SQLAlchemy + Alembic
- DevOps инженеры, управляющие миграциями БД
- Команды разработки, нуждающиеся в визуальном инструменте для БД

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                     http://localhost:3000                    │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│                        Docker Container                      │
│  • React 18 + TypeScript                                    │
│  • TailwindCSS                                              │
│  • Vite dev server (dev) / NGINX (prod)                    │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI + Python)                 │
│                        Docker Container                      │
│  • FastAPI web framework                                    │
│  • AlembicService - Python wrapper                          │
│  • SQLAlchemy ORM                                           │
│  • Pydantic models & validation                             │
│  • User project mounted as volume                           │
└────────────────────────────┬────────────────────────────────┘
                             │ SQL
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL 17)                   │
│                        Docker Container                      │
│  • PostgreSQL database                                       │
│  • User tables + alembic_version                            │
│  • Persistent volume storage                                │
└─────────────────────────────────────────────────────────────┘
```

## Архитектурные принципы

### 1. Микросервисная архитектура
- Каждый компонент в отдельном Docker контейнере
- Loose coupling через REST API
- Независимое масштабирование

### 2. API-First подход
- Backend предоставляет REST API
- Frontend - чистый клиент
- Возможность создания альтернативных клиентов (CLI, mobile)

### 3. Sidecar Pattern
- User проект монтируется как volume в backend
- Backend работает с миграциями пользователя
- Изоляция окружений

### 4. Zero Configuration
- docker-compose up и всё работает
- Разумные defaults в .env
- Минимальная настройка для старта

### 5. Developer Experience First
- Hot reload для frontend и backend
- Type safety (TypeScript + Pydantic)
- Comprehensive error messages

## Технологический стек

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **TailwindCSS**: Styling
- **React Router**: Navigation
- **Lucide React**: Icons

### Backend
- **FastAPI**: Web framework
- **Python 3.11+**: Language
- **SQLAlchemy 2.0**: ORM
- **Alembic**: Migrations
- **Pydantic**: Data validation
- **asyncpg**: Async PostgreSQL driver
- **python-dotenv**: Environment configuration

### Database
- **PostgreSQL 17**: Primary database
- **Official Docker image**: postgres:17-alpine

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Git**: Version control

## Основные компоненты

### 1. Frontend Layer

**Ответственность**:
- Рендеринг UI
- User interactions
- API calls к backend
- Client-side routing
- State management

**Ключевые файлы**:
- `frontend/src/App.tsx` - main app component
- `frontend/src/components/MigrationsPage.tsx` - Visual Alembic UI
- `frontend/src/main.tsx` - entry point
- `frontend/vite.config.ts` - Vite configuration

### 2. Backend Layer

**Ответственность**:
- REST API endpoints
- Business logic
- Alembic operations
- Database queries
- Error handling

**Ключевые файлы**:
- `backend/app/main.py` - FastAPI application
- `backend/app/services/alembic_service.py` - Alembic wrapper
- `backend/app/models/` - SQLAlchemy models
- `backend/app/config.py` - Settings configuration

### 3. Database Layer

**Ответственность**:
- Data persistence
- Transaction management
- Migrations storage (alembic_version)

**Схема**:
- User tables (defined in SQLAlchemy models)
- `alembic_version` (managed by Alembic)

## Data Flow

### Пример: Apply Migration

```
User clicks "Upgrade"
       ↓
Frontend: POST /api/migrations/upgrade {revision: "abc123"}
       ↓
Backend: AlembicService.upgrade("abc123")
       ↓
Alembic: Executes migration SQL
       ↓
PostgreSQL: Applies schema changes
       ↓
Alembic: Updates alembic_version table
       ↓
Backend: Returns success response
       ↓
Frontend: Fetches updated migrations list
       ↓
User sees updated timeline
```

## Deployment Model

### Development
```bash
docker-compose up
```
- Frontend: Hot reload на порту 3000
- Backend: Hot reload на порту 8000
- PostgreSQL: Порт 5432

### Production (планируется)
- NGINX для frontend static files
- Gunicorn + Uvicorn workers для backend
- PostgreSQL с persistent volumes
- SSL/TLS termination
- Load balancing

## Scalability Considerations

### Current (v0.1.0)
- Single instance каждого сервиса
- No load balancing
- No caching
- Подходит для: dev teams, small-medium projects

### Future (planned)
- Multiple backend replicas
- Redis для caching
- Read replicas для PostgreSQL
- Message queue для long-running operations
- WebSockets для real-time updates

## Security Model

### Current
- No authentication (local development)
- Docker network isolation
- No external access by default

### Planned
- User authentication (JWT)
- Role-based access control (RBAC)
- API rate limiting
- SQL injection protection (SQLAlchemy ORM)
- CORS configuration
- Secrets management

## Monitoring & Observability

### Current
- Console logs
- Docker logs

### Planned
- Structured logging
- Metrics (Prometheus)
- Distributed tracing (OpenTelemetry)
- Health checks
- Performance monitoring

## Dependencies

### External Services
- None (fully self-contained)

### Internal Dependencies
```
Frontend → Backend → Database
                ↓
          User Project
        (volume mount)
```

## API Contract

### REST API
- **Base URL**: `http://localhost:8000/api`
- **Format**: JSON
- **Docs**: OpenAPI/Swagger at `/docs`

### Key Endpoints
- `GET /migrations/history` - список миграций
- `POST /migrations/upgrade` - apply миграция
- `POST /migrations/downgrade` - rollback миграция
- `GET /migrations/current` - текущая revision

## Configuration Management

### Environment Variables
- **Frontend**: `frontend/.env`
  - `VITE_API_URL` - backend URL
- **Backend**: `backend/.env`
  - `DATABASE_URL` - PostgreSQL connection string
  - `ALEMBIC_CONFIG_PATH` - path to alembic.ini
- **Docker Compose**: `.env`
  - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

## Related Documents

- **Architecture Decisions**: `/docs/adr/`
- **API Specs**: `/docs/specs/001-visual-alembic-ui.md`
- **Database Schema**: `/docs/architecture/database-schema.md`
- **Tech Stack Details**: `/docs/architecture/tech-stack.md`
