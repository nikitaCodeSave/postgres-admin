# Стиль кода и соглашения

## Python (Backend)

### Форматирование
- **Black** formatter (длина строки 100 символов)
- **Ruff** linter (целевая версия Python 3.12)
- **Type hints** обязательны для всех function signatures
- **Docstrings** для public functions (стиль Google)

```python
from typing import Optional

async def get_migration_history(
    limit: Optional[int] = None,
    offset: int = 0
) -> list[MigrationInfo]:
    """Получить историю миграций из Alembic.

    Args:
        limit: Максимальное количество миграций для возврата
        offset: Количество миграций для пропуска

    Returns:
        Список объектов с информацией о миграциях

    Raises:
        AlembicError: Если команда Alembic завершилась с ошибкой
    """
    pass
```

### Соглашения по именованию
- **snake_case** - функции, переменные, имена файлов
- **PascalCase** - классы
- **SCREAMING_SNAKE_CASE** - константы
- **_leading_underscore** - приватные/внутренние методы

```python
# Правильно
def calculate_total_amount() -> float:
    pass

class AlembicService:
    pass

DATABASE_URL = "postgresql://..."

def _internal_helper() -> None:
    pass
```

### Организация импортов
```python
# 1. Стандартная библиотека
import os
from typing import Optional

# 2. Сторонние библиотеки
from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# 3. Локальные импорты приложения
from app.config import settings
from app.services.alembic_service import AlembicService
from app.models.migration import MigrationInfo
```

### Паттерны FastAPI
```python
# Настройка роутера
router = APIRouter(prefix="/api/alembic", tags=["alembic"])

# Всегда асинхронные эндпоинты
@router.get("/migrations")
async def get_migrations() -> list[MigrationInfo]:
    """Получить все миграции."""
    return await alembic_service.get_history()

# Использовать Pydantic модели для запросов/ответов
@router.post("/upgrade")
async def upgrade_migrations(
    request: UpgradeRequest
) -> UpgradeResponse:
    """Применить ожидающие миграции."""
    pass

# HTTP исключения для ошибок
if not migration_exists:
    raise HTTPException(
        status_code=404,
        detail=f"Migration {revision} not found"
    )
```

### Стиль SQLAlchemy 2.0
```python
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)

    # Связи с аннотациями типов
    posts: Mapped[list["Post"]] = relationship(back_populates="user")
```

### Согласованность Async/Await
```python
# Всегда async для операций ввода-вывода
async def get_user(user_id: int) -> Optional[User]:
    async with get_session() as session:
        result = await session.get(User, user_id)
        return result

# Использовать утилиты asyncio при необходимости
import asyncio
results = await asyncio.gather(
    fetch_users(),
    fetch_posts(),
)
```

## TypeScript (Frontend)

### Форматирование
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

### Соглашения по именованию
- **camelCase** - переменные, функции, методы
- **PascalCase** - компоненты, классы, интерфейсы, типы
- **SCREAMING_SNAKE_CASE** - константы
- **kebab-case** - имена файлов

```typescript
// Файлы
migration-item.tsx
use-migrations.ts
api-client.ts

// Код
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

### Организация импортов
```typescript
// 1. React и внешние библиотеки
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Внутренние сервисы/утилиты
import { apiClient } from '../services/api';
import { formatDate } from '../utils/date';

// 3. Типы
import type { Migration, MigrationStatus } from '../types';

// 4. Стили (если отдельные)
import './MigrationItem.css';
```

### Паттерны React

#### Только функциональные компоненты
```typescript
// ✅ Правильно - Функциональный с TypeScript
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

// ❌ Неправильно - Классовые компоненты (не используются в этом проекте)
class MigrationItem extends React.Component { }
```

#### Типобезопасность
```typescript
// Определить интерфейс пропсов
interface MigrationItemProps {
  migration: Migration;
  onApply: (revision: string) => void;
  onRollback?: (revision: string) => void; // Опциональный
}

// Использовать type для возвращаемых значений
const useMigrations = (): UseMigrationsReturn => {
  // ...
};

// Типизировать обработчики событий
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  // ...
};
```

#### Лучшие практики для хуков
```typescript
// Пользовательские хуки начинаются с "use"
export const useMigrations = () => {
  const [data, setData] = useState<Migration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Функция очистки
    const abortController = new AbortController();

    fetchData(abortController.signal);

    return () => abortController.abort();
  }, [/* зависимости */]);

  return { data, loading, error };
};
```

### Соглашения TailwindCSS
```tsx
// Использовать clsx для условных классов
import clsx from 'clsx';

<div className={clsx(
  'migration-item',
  'p-4 rounded-lg',
  isApplied && 'bg-green-100',
  !isApplied && 'bg-gray-100',
  isLoading && 'opacity-50 cursor-wait'
)}>
```

## Организация файлов

### Структура Backend
```
app/
├── __init__.py
├── main.py              # Точка входа FastAPI приложения
├── config.py            # Настройки (Pydantic)
├── models/              # Модели SQLAlchemy
│   ├── __init__.py
│   ├── base.py          # Базовый класс
│   └── user.py          # Отдельные модели
├── routers/             # API эндпоинты
│   ├── __init__.py
│   └── alembic.py       # Группировка по доменам
├── services/            # Бизнес-логика
│   ├── __init__.py
│   └── alembic_service.py
└── utils/               # Утилиты
    ├── __init__.py
    └── helpers.py
```

### Структура Frontend
```
src/
├── main.tsx             # Точка входа
├── App.tsx              # Корневой компонент
├── components/          # React компоненты
│   ├── MigrationsPage.tsx
│   ├── MigrationItem.tsx
│   └── LoadingSpinner.tsx
├── hooks/               # Пользовательские хуки
│   └── useMigrations.ts
├── services/            # API клиенты
│   └── api.ts
├── types/               # TypeScript типы
│   └── migration.ts
└── utils/               # Вспомогательные функции
    └── formatters.ts
```

## Комментарии и документация

### Когда комментировать
```python
# ✅ Правильно - Объясняй ПОЧЕМУ, а не ЧТО
# Кэшировать историю миграций на 5 минут для уменьшения вызовов Alembic
@lru_cache(maxsize=1)
def get_cached_history() -> list[MigrationInfo]:
    pass

# ✅ Правильно - Объясняй сложную логику
# Использовать Set для дедупликации с сохранением порядка O(n) вместо list O(n²)
seen = set()
unique_items = [x for x in items if not (x in seen or seen.add(x))]

# ❌ Неправильно - Констатация очевидного
# Создать переменную count
count = 0
```

### Docstrings (Python)
```python
# Стиль Google для единообразия
def process_migration(
    revision: str,
    direction: str = "up"
) -> MigrationResult:
    """Обработать миграцию базы данных.

    Args:
        revision: Хэш ревизии миграции (например, "abc123")
        direction: Направление миграции ("up" или "down")

    Returns:
        Объект результата со статусом и затронутыми таблицами

    Raises:
        AlembicError: Если выполнение миграции завершилось с ошибкой
        ValueError: Если направление недопустимо

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
 * Получить историю миграций из backend API
 *
 * @param limit - Максимальное количество миграций для возврата
 * @returns Promise, разрешающийся в массив миграций
 * @throws {AxiosError} Если API запрос завершился с ошибкой
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

## Обработка ошибок

### Backend
```python
from fastapi import HTTPException

# Использовать специфичные HTTP исключения
if not user:
    raise HTTPException(
        status_code=404,
        detail="User not found"
    )

# Перехватывать и оборачивать внешние ошибки
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
// Использовать try-catch для асинхронных операций
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

## Чеклист code review

**Перед коммитом**:
- [ ] Код отформатирован (Black/ESLint)
- [ ] Нет ошибок линтера (Ruff/ESLint)
- [ ] Добавлены type hints (Python)
- [ ] Определены типы (TypeScript)
- [ ] Тесты проходят (pytest/vitest)
- [ ] Нет console.log/print выражений
- [ ] Комментарии объясняют ПОЧЕМУ, а не ЧТО
- [ ] Импорты организованы правильно
