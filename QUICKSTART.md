# 🚀 Quick Start Guide

Запуск PostgreSQL Admin Dashboard POC за 3 минуты.

## Вариант 1: Docker Compose (Рекомендуется)

```bash
# 1. Перейти в директорию проекта
cd /home/nikita/PROJECTS/Postgresql

# 2. Запустить весь стек
docker-compose up --build

# 3. Дождаться сообщения:
# ✅ Backend: "Application startup complete"
# ✅ Frontend: Server running at http://localhost:3000
# ✅ PostgreSQL: database system is ready to accept connections

# 4. Открыть браузер
# http://localhost:3000 - Visual Alembic UI
# http://localhost:8000/docs - API документация
```

**Готово!** Вы увидите Visual Alembic UI с 2 example миграциями.

## Вариант 2: Локальная разработка

### Шаг 1: Запустить PostgreSQL

```bash
docker run -d \
  --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=testdb \
  -p 5432:5432 \
  postgres:17-alpine
```

### Шаг 2: Backend

```bash
cd backend

# Установить зависимости
poetry install

# Создать .env
cp .env.example .env

# Настроить .env:
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/testdb
# ALEMBIC_INI_PATH=/home/nikita/PROJECTS/Postgresql/example_project/alembic.ini

# Запустить
poetry run python -m app.main
```

Backend будет на http://localhost:8000

### Шаг 3: Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev server
npm run dev
```

Frontend будет на http://localhost:3000

### Шаг 4: Применить example миграции

```bash
cd example_project

# Применить миграции через CLI (или через UI!)
alembic upgrade head
```

Обновите страницу в браузере - миграции будут показаны как "applied".

## Тестирование функционала

### 1. Просмотр миграций

Откройте http://localhost:3000 - вы должны увидеть:
- 📊 Migration Status card с текущим revision
- 📜 Timeline с 2 миграциями:
  - `001` - create users table
  - `002` - create posts table

### 2. Применение pending миграций

```bash
# Создать новую миграцию
cd example_project
alembic revision -m "add user status field"

# В браузере нажать "Refresh" - появится pending миграция
# Нажать "Apply Migrations" - миграция применится
```

### 3. Откат миграции

```bash
# В браузере нажать "Rollback One"
# Последняя миграция будет откачена
```

### 4. API тестирование

Откройте http://localhost:8000/docs для Swagger UI:

```bash
# Или через curl:

# Получить список миграций
curl http://localhost:8000/api/alembic/migrations

# Получить статус
curl http://localhost:8000/api/alembic/status

# Применить миграции
curl -X POST http://localhost:8000/api/alembic/upgrade

# Откатить
curl -X POST http://localhost:8000/api/alembic/downgrade
```

## Troubleshooting

### Порт уже занят

```bash
# Изменить порты в docker-compose.yml:
# frontend: "3001:3000"
# backend: "8001:8000"
# postgres: "5433:5432"
```

### Backend не может найти alembic.ini

Проверьте переменную окружения:
```bash
ALEMBIC_INI_PATH=/app/alembic/alembic.ini
```

В docker-compose.yml должен быть volume mount:
```yaml
volumes:
  - ./example_project/alembic:/app/alembic:ro
```

### Frontend не может подключиться к backend

1. Проверьте, что backend запущен: http://localhost:8000/health
2. Проверьте CORS настройки в backend/.env:
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### PostgreSQL не запускается

```bash
# Остановить все контейнеры
docker-compose down

# Удалить volume
docker volume rm postgresql_postgres_data

# Запустить снова
docker-compose up --build
```

## Следующие шаги

1. ✅ Протестировать Visual Alembic UI
2. ✅ Посмотреть код в `backend/app/services/alembic_service.py`
3. ✅ Посмотреть код в `frontend/src/components/MigrationsPage.tsx`
4. ✅ Прочитать [PRD-ru.md](./PRD-ru.md) для понимания полного видения продукта
5. ✅ Начать разработку MVP фич (Data Browser, SQLAlchemy introspection)

## Полезные команды

```bash
# Логи всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Перезапустить сервис
docker-compose restart backend

# Остановить все
docker-compose down

# Удалить всё включая volumes
docker-compose down -v

# Rebuild и запуск
docker-compose up --build

# Запуск в фоне
docker-compose up -d
```

---

**Готово!** Теперь у вас работает первый в мире Visual UI для Alembic миграций 🚀
