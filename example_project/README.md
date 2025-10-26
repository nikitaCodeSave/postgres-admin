# Example Project for PostgreSQL Admin POC

Это пример проекта с SQLAlchemy моделями и Alembic миграциями для тестирования PostgreSQL Admin Dashboard.

## Структура

```
example_project/
├── models/
│   ├── __init__.py
│   ├── base.py          # SQLAlchemy Base
│   ├── user.py          # User model
│   └── post.py          # Post model
├── alembic/
│   ├── versions/
│   │   ├── 001_create_users_table.py
│   │   └── 002_create_posts_table.py
│   ├── env.py           # Alembic environment
│   └── script.py.mako   # Migration template
└── alembic.ini          # Alembic configuration

```

## Модели

### User
- id (Integer, PK)
- username (String, unique)
- email (String, unique)
- full_name (String, nullable)
- created_at (DateTime)
- updated_at (DateTime)

### Post
- id (Integer, PK)
- title (String)
- content (Text)
- author_id (Integer, FK -> users.id)
- created_at (DateTime)
- updated_at (DateTime)

## Миграции

1. **001_create_users_table** - Создание таблицы users
2. **002_create_posts_table** - Создание таблицы posts с FK на users

## Использование

Этот проект автоматически монтируется в Docker контейнер через docker-compose.yml:

```yaml
volumes:
  - ./example_project/models:/app/models:ro
  - ./example_project/alembic:/app/alembic:ro
```

PostgreSQL Admin Dashboard автоматически обнаружит:
- SQLAlchemy модели из `models/`
- Alembic конфигурацию из `alembic.ini`
- Миграции из `alembic/versions/`

## Тестирование локально

Создать новую миграцию:
```bash
cd example_project
alembic revision --autogenerate -m "add new column"
```

Применить миграции через CLI:
```bash
alembic upgrade head
```

Или использовать **Visual Alembic UI** в браузере! 🚀
