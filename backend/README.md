# PostgreSQL Admin Dashboard - Backend

Backend API для Visual Alembic UI и управления PostgreSQL.

## Технологический стек

- **FastAPI** 0.104+ - Async веб-фреймворк
- **SQLAlchemy** 2.0+ - ORM
- **Alembic** 1.12+ - Database migrations
- **asyncpg** - Async PostgreSQL driver
- **Pydantic** 2.4+ - Validation

## Установка

### Через Poetry (рекомендуется)

```bash
cd backend
poetry install
```

### Через pip

```bash
cd backend
pip install -r requirements.txt  # (будет создан позже)
```

## Конфигурация

Создайте `.env` файл на основе `.env.example`:

```bash
cp .env.example .env
```

Настройте переменные окружения:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/yourdb
ALEMBIC_INI_PATH=/path/to/your/alembic.ini
SQLALCHEMY_BASE=your_models.base:Base
```

## Запуск

### Development режим

```bash
poetry run python -m app.main
```

Или:

```bash
poetry run uvicorn app.main:app --reload --port 8000
```

API будет доступен по адресу: http://localhost:8000

### Production режим

```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Alembic Migrations (Killer Feature)

- `GET /api/alembic/migrations` - Получить список всех миграций
- `GET /api/alembic/status` - Получить текущий статус миграций
- `POST /api/alembic/upgrade` - Применить все pending миграции
- `POST /api/alembic/downgrade` - Откатить одну миграцию
- `GET /api/alembic/health` - Health check

### Общие

- `GET /` - Информация об API
- `GET /health` - Health check
- `GET /docs` - Swagger UI документация
- `GET /redoc` - ReDoc документация

## Архитектура

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI приложение
│   ├── config.py            # Конфигурация из .env
│   ├── routers/             # API endpoints
│   │   ├── __init__.py
│   │   └── alembic.py       # Alembic routes (killer feature)
│   └── services/            # Бизнес-логика
│       ├── __init__.py
│       └── alembic_service.py  # Alembic Python API wrapper
├── pyproject.toml           # Poetry dependencies
├── .env.example             # Пример конфигурации
└── README.md
```

## Разработка

### Форматирование кода

```bash
poetry run black app/
poetry run ruff check app/
```

### Тестирование

```bash
poetry run pytest
```

## Docker

```bash
docker build -t postgresql-admin-backend:latest .
docker run -p 8000:8000 --env-file .env postgresql-admin-backend:latest
```

## Лицензия

MIT
