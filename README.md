# 🐘 PostgreSQL Admin Dashboard - POC

> **Первый в мире Visual UI для Alembic миграций!**

Modern Developer Tool для Python-разработчиков с PostgreSQL + SQLAlchemy + Alembic. Zero-config запуск через Docker.

![POC Status](https://img.shields.io/badge/status-POC-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![React](https://img.shields.io/badge/react-18-blue)

---

## 🎯 Что это?

**Killer Feature:** Visual Alembic UI - первый GUI для управления Alembic миграциями за 14 лет существования инструмента!

Вместо CLI команд:
```bash
alembic upgrade head
alembic downgrade -1
alembic current
```

Используй красивый UI с одной кнопкой 🚀

## ✨ Фичи POC

- ✅ **Visual Alembic UI** - просмотр истории миграций, apply/rollback через UI
- ✅ **Migration Timeline** - визуальная шкала времени с индикаторами статуса
- ✅ **Zero-Config Docker** - запуск через `docker-compose up`
- ✅ **Modern Dark Theme** - удобный UI для разработчиков
- ✅ **Real-time Status** - current revision, pending migrations
- ✅ **FastAPI Backend** - быстрый async API
- ✅ **React + TypeScript** - типобезопасный фронтенд

## 🚀 Быстрый старт

### Требования

- Docker Desktop или Docker + Docker Compose
- Порты 3000, 5432, 8000 должны быть свободны

### Запуск POC

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd Postgresql

# 2. Запустить через Docker Compose
docker-compose up --build

# 3. Открыть в браузере
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**Готово!** Откройте http://localhost:3000 и увидите Visual Alembic UI в действии.

## 📁 Структура проекта

```
Postgresql/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── routers/
│   │   │   └── alembic.py     # 🔥 Killer feature: Alembic API
│   │   ├── services/
│   │   │   └── alembic_service.py  # Alembic Python wrapper
│   │   ├── config.py          # Configuration
│   │   └── main.py            # FastAPI app
│   ├── pyproject.toml         # Python dependencies
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── MigrationsPage.tsx  # 🔥 Visual Alembic UI
│   │   ├── services/
│   │   │   └── api.ts         # Backend API client
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── README.md
│
├── example_project/            # Example project for testing
│   ├── models/                # SQLAlchemy models (User, Post)
│   ├── alembic/               # Alembic migrations
│   │   └── versions/
│   │       ├── 001_create_users_table.py
│   │       └── 002_create_posts_table.py
│   └── alembic.ini
│
├── docker-compose.yml          # Full stack setup
├── IDEA-CARD.md               # Product idea formulation
├── PRD-ru.md                  # Full Product Requirements Doc
└── README.md                  # This file
```

## 🎬 Как использовать

### 1. Просмотр миграций

Откройте http://localhost:3000 - вы увидите:
- ✅ Список всех миграций
- ✅ Текущий revision (зелёный индикатор)
- ✅ Pending миграции (жёлтый индикатор)
- ✅ Общий статус БД

### 2. Применение миграций

Нажмите кнопку **"Apply Migrations"** - все pending миграции будут применены.

Вместо:
```bash
alembic upgrade head
```

### 3. Откат миграции

Нажмите кнопку **"Rollback One"** - последняя миграция будет откачена.

Вместо:
```bash
alembic downgrade -1
```

## 🏗️ Архитектура

```
┌─────────────────────────────────────────┐
│  React Frontend (localhost:3000)        │
│  - MigrationsPage.tsx (Visual UI)       │
│  - TailwindCSS Dark Theme               │
│  - Axios API Client                     │
└────────────┬────────────────────────────┘
             │ HTTP REST API
┌────────────▼────────────────────────────┐
│  FastAPI Backend (localhost:8000)       │
│  - AlembicService (Killer Feature)      │
│  - Alembic Python API Integration       │
│  - CRUD Operations                      │
└────────────┬────────────────────────────┘
             │ asyncpg
┌────────────▼────────────────────────────┐
│  PostgreSQL (localhost:5432)            │
│  - Database: testdb                     │
│  - User: postgres                       │
└──────────────────────────────────────────┘
```

## 🛠️ Технологический стек

### Backend
- **FastAPI** 0.104+ - Async веб-фреймворк
- **SQLAlchemy** 2.0+ - ORM
- **Alembic** 1.12+ - Database migrations (интеграция через Python API!)
- **asyncpg** - Async PostgreSQL driver
- **Pydantic** 2.4+ - Validation

### Frontend
- **React** 18 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** 3.4+ - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### DevOps
- **Docker** + **Docker Compose** - Containerization
- **PostgreSQL** 17 - Database
- **Nginx** - Frontend serving (production)

## 📊 API Endpoints

### Alembic Migrations

```bash
# Получить список миграций
GET /api/alembic/migrations

# Получить статус
GET /api/alembic/status

# Применить pending миграции
POST /api/alembic/upgrade

# Откатить одну миграцию
POST /api/alembic/downgrade

# Health check
GET /api/alembic/health
```

Swagger UI: http://localhost:8000/docs

## 🧪 Development

### Backend (local)

```bash
cd backend
poetry install
poetry run python -m app.main
```

### Frontend (local)

```bash
cd frontend
npm install
npm run dev
```

### Создание новых миграций

```bash
cd example_project
alembic revision --autogenerate -m "add new column"
```

Затем обновите страницу в браузере - новая миграция появится в UI!

## 📋 Roadmap

### ✅ Week 1-2: POC (Complete!)
- [x] FastAPI backend с Alembic endpoint
- [x] React UI с Visual Alembic UI
- [x] Docker Compose setup
- [x] Example project для тестирования

### 🔜 Month 1-3: MVP
- [ ] Data Browser (CRUD через UI)
- [ ] SQLAlchemy models introspection
- [ ] Foreign key relationships navigation
- [ ] Filter/sort в таблицах
- [ ] Production-ready Docker images
- [ ] Tests (pytest + React Testing Library)

### 🔮 Month 3-6: Growth Features
- [ ] ER диаграмма из SQLAlchemy models
- [ ] Query Editor с подсветкой SQL
- [ ] ORM Code Generator (DB → SQLAlchemy)
- [ ] Team collaboration features
- [ ] Multi-database support

## 🎯 Целевая аудитория

**Primary:** Python Backend Разработчики

- Используют FastAPI / Flask / Django
- SQLAlchemy + Alembic ежедневно
- PostgreSQL в Docker
- Junior-Middle уровень
- Стартапы без DBA

**Размер рынка:** ~3 млн Python developers с SQLAlchemy + Alembic

## 🔥 Почему это круто?

1. **Уникальная ниша** - Visual Alembic UI не существует (14 лет без GUI!)
2. **Реальная боль** - каждый Python разработчик страдает от CLI
3. **Zero-config** - `docker-compose up` и готово
4. **Developer-focused** - удобный UI, темная тема, keyboard shortcuts

## 📚 Документация

### Основная документация
- [PRD (Product Requirements Document)](./PRD-ru.md) - полная спецификация продукта
- [IDEA-CARD](./IDEA-CARD.md) - формулировка идеи
- [Backend README](./backend/README.md) - документация backend API
- [Frontend README](./frontend/README.md) - документация frontend UI

### Структурированная документация (`docs/`)
- **ADR** (`docs/adr/`) - Architecture Decision Records (архитектурные решения)
- **Specs** (`docs/specs/`) - Спецификации реализованных фич
- **Backlog** (`docs/backlog/`) - Planning: features, bugs, improvements
- **Dev Journal** (`docs/dev-journal/`) - Журнал разработки
- **Architecture** (`docs/architecture/`) - System design, DB schema, tech stack
- **CHANGELOG** (`docs/CHANGELOG.md`) - История изменений по релизам

### Claude Code Configuration
- **CLAUDE.md** - Конфигурация для Claude Code AI (автоматически загружается)
- **CLAUDE.local.md.example** - Template для personal настроек
- **Slash Commands** (`.claude/commands/`) - 10 команд для workflow automation
- **Subagents** (`.claude/agents/`) - Specialized AI agents (postgres-python-expert)

**Работаешь с Claude Code?** Все настройки и команды уже преднастроены! Просто начни работу.

## 🤝 Contributing

Проект в стадии POC. Feedback welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 Лицензия

MIT License - смотри [LICENSE](./LICENSE)

## 🌟 Поддержать проект

Если вам нравится идея:
- ⭐ Star на GitHub
- 📢 Share с друзьями Python-разработчиками
- 💬 Feedback и feature requests в Issues

---

**Сделано с ❤️ для Python-разработчиков, уставших от `alembic upgrade head` в консоли.**

**Первый GUI для Alembic за 14 лет!** 🚀
