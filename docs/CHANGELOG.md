# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Database Browser UI - просмотр таблиц и данных
- Query Editor - выполнение SQL запросов
- Visual Schema Designer - создание таблиц через drag-and-drop
- User Authentication - JWT-based auth
- API rate limiting
- Performance monitoring

## [0.1.0] - 2025-10-27

### Added

#### Visual Alembic UI (Killer Feature)
- **Timeline visualization** - графическое отображение истории миграций
- **Apply migrations** - кнопка "Upgrade" с confirm dialog для применения миграций
- **Rollback migrations** - кнопка "Downgrade" для отката миграций
- **Auto-refresh** - автоматическое обновление списка миграций каждые 30 секунд
- **Status indicators** - визуальные индикаторы примененных/не примененных миграций
- **Error handling** - красивое отображение ошибок с детальными сообщениями

#### Backend (FastAPI)
- **AlembicService** - Python wrapper над Alembic API для программного управления миграциями
- **REST API endpoints**:
  - `GET /api/migrations/history` - получить список всех миграций
  - `POST /api/migrations/upgrade` - применить миграцию до указанной revision
  - `POST /api/migrations/downgrade` - откатить миграцию до указанной revision
  - `GET /api/migrations/current` - получить текущую примененную миграцию
  - `POST /api/migrations/heads` - получить head revisions
- **Pydantic Settings** - конфигурация через .env файлы
- **SQLAlchemy 2.0** - современный ORM для работы с PostgreSQL
- **Docker multi-stage build** - оптимизация размера образа

#### Frontend (React + TypeScript)
- **MigrationsPage component** - главная страница с Visual Alembic UI (350+ строк)
- **Dark theme UI** - современный темный интерфейс по умолчанию
- **TailwindCSS styling** - utility-first CSS для быстрой разработки
- **TypeScript** - полная типизация всего frontend кода
- **Vite** - быстрый bundler с Hot Module Replacement

#### Example Project
- **SQLAlchemy models** - примеры моделей User и Post для демонстрации
- **Alembic migrations** - 2 тестовые миграции для проверки UI

#### Docker Infrastructure
- **docker-compose.yml** - оркестрация 3 сервисов (PostgreSQL, Backend, Frontend)
- **Zero-config setup** - работает из коробки через `docker-compose up`
- **Sidecar pattern** - user проекты монтируются как volumes в backend контейнер
- **PostgreSQL 17** - последняя версия PostgreSQL в Alpine Linux образе

#### Documentation
- **README.md** - comprehensive documentation (300+ строк)
  - Quick Start Guide - 3-минутная инструкция по запуску
  - Architecture Overview - описание архитектуры
  - API Reference - документация REST API
  - Development Guide - как разрабатывать проект
- **POC Complete Summary** - итоговый отчет о реализации POC
- **PRD на русском** - полная Product Requirements Document

#### Documentation System
- **ADR (Architecture Decision Records)** - система документирования архитектурных решений
  - `/docs/adr/0000-template.md` - шаблон для новых ADR
  - `/docs/adr/0001-initial-architecture.md` - первое архитектурное решение
- **Backlog structure** - организация беклога задач
  - `/docs/backlog/features/` - спецификации будущих фич с шаблоном
  - `/docs/backlog/bugs/` - описания багов с шаблоном
  - `/docs/backlog/improvements/` - идеи улучшений с шаблоном
- **Specs** - спецификации реализованных фич
  - `/docs/specs/001-visual-alembic-ui.md` - полная спека Visual Alembic UI
- **Dev Journal** - журнал разработки
  - `/docs/dev-journal/2025-10.md` - записи октября 2025
- **Architecture docs** - архитектурная документация
  - `/docs/architecture/system-overview.md` - обзор системы
  - `/docs/architecture/database-schema.md` - схема базы данных
  - `/docs/architecture/tech-stack.md` - детали технологического стека

### Technical Details

**Statistics**:
- 59 файлов создано
- 1100+ строк production кода
- 600+ строк документации
- Backend: ~500 строк Python
- Frontend: ~600 строк TypeScript/React

**Git**:
- Commit: 130d0e5 "Initial commit: PostgreSQL Admin Dashboard POC"
- Branch: main

### Known Limitations

- Single database support (one DB at a time)
- No concurrent migration execution
- No migration creation through UI (only apply/rollback)
- No SQL preview before applying migrations
- No migration dependency graph visualization
- No authentication (local development only)
- No tests (unit or integration)

## Version History

- **v0.1.0** (2025-10-27) - Initial POC release with Visual Alembic UI

---

## Changelog Format

This changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format:

### Categories
- **Added** - новая функциональность
- **Changed** - изменения в существующей функциональности
- **Deprecated** - функциональность, которая скоро будет удалена
- **Removed** - удаленная функциональность
- **Fixed** - исправленные баги
- **Security** - изменения, связанные с безопасностью

### Version Format
- **[Unreleased]** - предстоящие изменения
- **[X.Y.Z] - YYYY-MM-DD** - релизы с датой

### Semantic Versioning
- **MAJOR** (X.0.0) - Breaking changes
- **MINOR** (0.X.0) - New features, backward compatible
- **PATCH** (0.0.X) - Bug fixes, backward compatible
