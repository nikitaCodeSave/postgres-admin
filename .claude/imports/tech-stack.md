# Технологический стек и версии

## Backend стек

### Основной фреймворк
- **FastAPI** ^0.119.1 - Современный async web-фреймворк
- **Python** ^3.12 - Версия языка
- **Uvicorn** ^0.38.0 - ASGI сервер с hot reload

### База данных и ORM
- **SQLAlchemy** ^2.0.44 - ORM с async поддержкой (стиль 2.0)
- **Alembic** ^1.17.0 - Миграции базы данных
- **asyncpg** ^0.30.0 - Самый быстрый async драйвер PostgreSQL
- **PostgreSQL** 17 - База данных (официальный Docker образ: postgres:17-alpine)

### Валидация данных
- **Pydantic** ^2.12.3 - Валидация данных и настройки
- **pydantic-settings** ^2.11.0 - Управление конфигурацией

### Инструменты разработки
- **Poetry** - Управление зависимостями и packaging
- **pytest** ^8.4.2 - Фреймворк для тестирования
- **pytest-asyncio** ^1.2.0 - Поддержка async тестов
- **Black** ^25.9.0 - Форматтер кода (100 символов)
- **Ruff** ^0.14.2 - Быстрый линтер

## Frontend стек

### Основной фреймворк
- **React** ^18.2.0 - UI библиотека
- **TypeScript** ^5.2.2 - Type-safe JavaScript
- **Vite** ^5.0.0 - Инструмент сборки с HMR

### Стилизация
- **TailwindCSS** ^3.3.5 - Utility-first CSS
- **PostCSS** ^8.4.31 - Обработка CSS
- **Autoprefixer** ^10.4.16 - CSS vendor prefixes

### HTTP и State
- **Axios** ^1.6.0 - HTTP клиент
- **React Context API** - Управление состоянием (пока без Redux)

### UI компоненты
- **Lucide React** ^0.294.0 - Библиотека иконок
- **clsx** ^2.0.0 - Условные CSS классы

### Инструменты разработки
- **ESLint** ^8.53.0 - Линтинг
- **@typescript-eslint** ^6.10.0 - TypeScript ESLint
- **Vitest** (запланировано) - Unit тестирование

## DevOps стек

### Контейнеризация
- **Docker** 24+ - Платформа контейнеризации
- **Docker Compose** - Оркестрация multi-container

### Сервисы
- **PostgreSQL** 17 (postgres:17-alpine)
- **Backend** (FastAPI на порту 8000)
- **Frontend** (Vite dev на порту 3000)

### Порты
- `5432` - PostgreSQL
- `8000` - Backend API
- `3000` - Frontend dev сервер

## Пакетные менеджеры

### Backend
- **Poetry** - Современное управление зависимостями Python
  - `pyproject.toml` - Зависимости и конфигурация
  - Lock file для воспроизводимых сборок

### Frontend
- **npm** - Пакетный менеджер Node.js
  - `package.json` - Зависимости
  - `package-lock.json` - Lock file

## Конфигурация Python (pyproject.toml)

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

## Конфигурация TypeScript (tsconfig.json)

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

## Важные заметки о версиях

### Стиль SQLAlchemy 2.0
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
Все endpoints асинхронные с async/await:
```python
@router.get("/migrations")
async def get_migrations() -> list[MigrationInfo]:
    return await alembic_service.get_history()
```

### Возможности React 18
- Автоматический batching
- Concurrent фичи
- Новые хуки (useId, useTransition)
- Strict mode в разработке

## Стратегия обновления зависимостей

**Проверка обновлений**:
```bash
# Backend
cd backend && poetry show --outdated

# Frontend
cd frontend && npm outdated
```

**Критические пакеты для отслеживания**:
- FastAPI (major релизы могут содержать breaking changes)
- SQLAlchemy (2.x → 3.x в будущем)
- React (18.x → 19.x запланировано)
- TailwindCSS (следить за 4.0)

**Политика обновлений**:
- Patch версии: автообновление
- Minor версии: просмотр changelog, тестирование
- Major версии: планирование миграции, обновление ADR
