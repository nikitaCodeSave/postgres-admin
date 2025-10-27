# Архитектура и паттерны проектирования

## Системная архитектура

### Обзор высокого уровня
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

## Паттерны архитектуры Backend

### 1. Слоистая архитектура

**Слой Router** → **Слой Service** → **Слой Model** → **База данных**

```python
# Router (app/routers/alembic.py)
# Обрабатывает HTTP-запросы, валидацию, ответы
@router.get("/migrations")
async def get_migrations() -> list[MigrationInfo]:
    return await alembic_service.get_history()

# Service (app/services/alembic_service.py)
# Бизнес-логика, интеграция с Alembic
class AlembicService:
    def get_history(self) -> list[MigrationInfo]:
        # Сложная логика здесь
        pass

# Models (app/models/)
# ORM-модели SQLAlchemy
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

### 3. Pydantic для валидации данных

```python
# Модели запросов
class UpgradeRequest(BaseModel):
    revision: Optional[str] = "head"
    sql_mode: bool = False

# Модели ответов
class MigrationInfo(BaseModel):
    revision: str
    message: str
    is_applied: bool

    model_config = ConfigDict(from_attributes=True)
```

### 4. Async/Await повсюду

```python
# Все операции ввода-вывода асинхронные
async def get_user(session: AsyncSession, user_id: int) -> Optional[User]:
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# Используйте asyncio.gather для параллельных операций
users, posts = await asyncio.gather(
    get_users(),
    get_posts(),
)
```

## Паттерны архитектуры Frontend

### 1. Компонентная архитектура

```
MigrationsPage (Container)
├── MigrationTimeline (Presentational)
│   └── MigrationItem (Presentational)
├── MigrationActions (Container)
│   ├── ApplyButton
│   └── RollbackButton
└── StatusBar (Presentational)
```

**Container Components**: Управляют состоянием, загрузкой данных
**Presentational Components**: Чистый UI, получают props

### 2. Пользовательские хуки для переиспользования логики

```typescript
// hooks/useMigrations.ts
export const useMigrations = () => {
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMigrations = async () => {
    // Логика здесь
  };

  const applyMigration = async (revision: string) => {
    // Логика здесь
  };

  return { migrations, loading, error, applyMigration };
};

// Использование в компоненте
const { migrations, applyMigration } = useMigrations();
```

### 3. Сервисный слой для API-вызовов

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

### 4. Типобезопасный API-клиент

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  detail: string;
}

// Использование
const response: ApiResponse<Migration[]> = await api.get('/migrations');
```

## Специфичные для проекта паттерны

### 1. Паттерн AlembicService (КЛЮЧЕВАЯ ИННОВАЦИЯ ⭐)

**Проблема**: Alembic работает только через CLI, сложно интегрировать в веб-приложение

**Решение**: Python API обертка, которая предоставляет функциональность Alembic программно

```python
from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory

class AlembicService:
    def __init__(self, config_path: str = "alembic.ini"):
        self.config = Config(config_path)
        self.script = ScriptDirectory.from_config(self.config)

    def get_history(self) -> list[MigrationInfo]:
        """Получение всех миграций через Python API Alembic."""
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
        """Применение миграций используя command API Alembic."""
        command.upgrade(self.config, revision)

    def downgrade(self, revision: str) -> None:
        """Откат миграций используя command API Alembic."""
        command.downgrade(self.config, revision)
```

**Почему это важно**:
- Прямой доступ к Python API (без вызова subprocess)
- Типобезопасные возвращаемые значения
- Корректная обработка ошибок
- Тестируемость без CLI Alembic

### 2. Паттерн Sidecar для пользовательских проектов

**Проблема**: Пользователи хотят использовать UI с их существующими проектами

**Решение**: Монтирование пользовательского проекта как Docker volume

```yaml
# docker-compose.yml
services:
  backend:
    volumes:
      - ./example_project:/user-project:ro  # Монтирование только для чтения
    environment:
      - ALEMBIC_CONFIG=/user-project/alembic.ini
```

**Преимущества**:
- Не требуются изменения кода в пользовательском проекте
- Изолированные окружения
- Работает с любым проектом SQLAlchemy + Alembic

### 3. Философия нулевой конфигурации

**Принцип**: Приложение должно работать без конфигурационных файлов

**Реализация**:
```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Значения по умолчанию, которые "просто работают"
    database_url: str = "postgresql://pguser:pgpass@db:5432/pgadmin"
    alembic_config_path: str = "/app/alembic.ini"
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
```

**Результат**: `docker-compose up` и всё работает

### 4. API-первый дизайн

**Принцип**: Backend = чистый API, frontend = чистый клиент

```python
# Backend предоставляет OpenAPI
app = FastAPI(
    title="PostgreSQL Admin Dashboard API",
    description="REST API для управления миграциями Alembic",
    version="0.1.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc", # ReDoc
)
```

**Преимущества**:
- Документация API генерируется автоматически
- Легко тестировать (curl, Postman)
- Frontend можно заменить
- Возможно мобильное приложение

## Стратегия обработки ошибок

### Ошибки Backend
```python
# Пользовательские типы исключений
class AlembicError(Exception):
    """Базовое исключение для операций Alembic."""
    pass

class MigrationNotFoundError(AlembicError):
    """Вызывается когда ревизия миграции не существует."""
    pass

# Преобразование в HTTP ошибки на уровне router
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

### Ошибки Frontend
```typescript
// Централизованная обработка ошибок
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || 'API request failed';
  }
  return 'An unexpected error occurred';
};

// Использование
try {
  await api.upgradeMigrations();
} catch (error) {
  setError(handleApiError(error));
}
```

## Паттерны производительности

### 1. Пул соединений
```python
# SQLAlchemy async engine с пулом соединений
engine = create_async_engine(
    settings.database_url,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)
```

### 2. Стратегия кэширования
```python
from functools import lru_cache

# Кэширование конфигурации Alembic (дорого создавать)
@lru_cache(maxsize=1)
def get_alembic_config() -> Config:
    return Config("alembic.ini")
```

### 3. Пагинация (Запланировано)
```python
@router.get("/migrations")
async def get_migrations(
    skip: int = 0,
    limit: int = 100,
) -> list[MigrationInfo]:
    return service.get_history(skip=skip, limit=limit)
```

## Соображения безопасности

### Текущий уровень POC
- ⚠️ Нет аутентификации (только локальная разработка)
- ⚠️ Нет ограничения скорости запросов
- ⚠️ CORS открыт для localhost

### Требования для продакшена
```python
# Добавить аутентификацию
from fastapi import Security
from fastapi.security import HTTPBearer

security = HTTPBearer()

@router.post("/upgrade")
async def upgrade(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    # Проверка JWT токена
    pass

# Добавить ограничение скорости запросов
from slowapi import Limiter

limiter = Limiter(key_func=lambda request: request.client.host)

@app.get("/migrations")
@limiter.limit("10/minute")
async def get_migrations():
    pass
```

## Стратегия тестирования

### Тесты Backend (Запланировано)
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

### Тесты Frontend (Запланировано)
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

## Паттерн документирования

**Каждая функция следует**: Backlog → Implementation → Spec → CHANGELOG → Journal

```
1. /new-feature database-browser
2. Реализовать функцию
3. /create-spec database-browser
4. /log-change
5. /log-dev
```

Детальная документация архитектуры: `@docs/architecture/system-overview.md`
