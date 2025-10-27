# Информация о проекте - PostgreSQL Admin Dashboard

## Идентификация проекта

**Название**: PostgreSQL Admin Dashboard
**Версия**: v0.1.0 (POC → MVP)
**Статус**: Активная разработка
**Лицензия**: MIT

## Миссия

Первый в мире Visual UI для Alembic миграций - developer tool для Python-разработчиков, работающих с PostgreSQL + SQLAlchemy + Alembic.

## Killer Feature

**Visual Alembic UI** - графический интерфейс для управления database migrations вместо CLI команд. За 14 лет существования Alembic это первый полноценный GUI.

**Проблема**: Разработчики вынуждены использовать CLI для каждой операции с миграциями.

**Решение**: Красивый web UI с timeline visualization, one-click apply/rollback, real-time status.

## Целевая аудитория

**Основная**: Python Backend Разработчики (Junior-Middle)
- Используют FastAPI / Flask / Django
- SQLAlchemy + Alembic ежедневно
- PostgreSQL в Docker
- Стартапы без dedicated DBA

**Размер рынка**: ~3M Python developers используют SQLAlchemy + Alembic

## Структура проекта

```
Postgresql/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routers/     # API endpoints
│   │   ├── services/    # Бизнес-логика (AlembicService ⭐)
│   │   ├── config.py    # Настройки (Pydantic)
│   │   └── main.py      # FastAPI приложение
│   └── pyproject.toml   # Poetry зависимости

├── frontend/            # React + TypeScript frontend
│   ├── src/
│   │   ├── components/  # React компоненты (MigrationsPage ⭐)
│   │   ├── services/    # API клиент
│   │   └── types/       # TypeScript типы
│   └── package.json     # npm зависимости

├── example_project/     # Demo проект для тестирования
│   ├── models/          # SQLAlchemy модели
│   └── alembic/         # Примеры миграций

├── docs/                # Комплексная документация
│   ├── adr/            # Architecture Decision Records
│   ├── backlog/        # Features, Bugs, Improvements
│   ├── specs/          # Спецификации реализованных фич
│   ├── dev-journal/    # Журнал разработки
│   ├── architecture/   # Документация системного дизайна
│   └── CHANGELOG.md    # История релизов

├── .claude/            # Конфигурация Claude Code
│   ├── commands/       # 10 слэш-команд
│   ├── agents/         # postgres-python-expert субагент
│   └── imports/        # Модульные компоненты CLAUDE.md

└── docker-compose.yml  # Оркестрация всего стека
```

## Ключевые директории

- **backend/app/services/alembic_service.py** - Основная инновация: Python API wrapper над Alembic CLI
- **frontend/src/components/MigrationsPage.tsx** - Реализация Visual Alembic UI (350+ строк кода)
- **docs/** - 2000+ строк комплексной документации
- **.claude/commands/** - 10 специализированных команд для workflow

## Философия разработки

1. **Zero-Config**: `docker-compose up` и всё работает
2. **Visual First**: Все операции через UI, не CLI
3. **Developer Experience**: Тёмная тема, keyboard shortcuts, интуитивный UX
4. **Documentation-Driven**: Все решения документированы (ADR, specs, journal)
5. **Best Practices**: Conventional commits, semantic versioning, Keep a Changelog

## Текущий Roadmap

### ✅ POC завершён (v0.1.0)
- Visual Alembic UI
- Визуализация timeline миграций
- Apply/Rollback через UI
- Docker Compose setup

### 🔄 MVP в процессе (v0.2.0)
- Database Browser (CRUD через UI)
- Query Editor с SQL highlighting
- Визуализация схемы
- Тесты (pytest + vitest)

### 🔮 Будущее (v1.0.0)
- ER диаграмма из SQLAlchemy models
- ORM Code Generator (DB → SQLAlchemy)
- Multi-database поддержка
- Team collaboration функции
