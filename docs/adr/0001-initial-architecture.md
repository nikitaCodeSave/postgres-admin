# ADR-0001. Архитектура PostgreSQL Admin Dashboard с Visual Alembic UI

Дата: 2025-10-27

## Статус

accepted

## Контекст

Необходимо создать систему для управления PostgreSQL базами данных с возможностью визуального управления миграциями через Alembic. Текущие решения (pgAdmin, DBeaver) не предоставляют удобного интерфейса для работы с Alembic миграциями - разработчикам приходится работать через CLI.

Требования:
- Веб-интерфейс для управления миграциями Alembic
- Возможность просмотра истории миграций
- Apply/Rollback миграций через UI
- Интеграция с пользовательскими проектами
- Минимальная настройка для начала работы

## Решение

Выбрана микросервисная архитектура на базе Docker Compose:

### Backend: FastAPI + Python
- **FastAPI** - современный async Python фреймворк с автогенерацией OpenAPI
- **AlembicService** - Python wrapper над Alembic CLI
- **SQLAlchemy** - ORM для работы с PostgreSQL
- **Pydantic Settings** - конфигурация через .env

### Frontend: React + TypeScript
- **React 18** - для построения интерактивного UI
- **TypeScript** - статическая типизация
- **TailwindCSS** - utility-first CSS фреймворк
- **Vite** - быстрый bundler для development

### Database: PostgreSQL 17
- Последняя стабильная версия PostgreSQL
- Официальный Docker образ

### Deployment: Docker Compose
- **3 сервиса**: PostgreSQL, Backend (FastAPI), Frontend (React)
- **Sidecar pattern** - пользовательский код монтируется в backend контейнер
- **Zero-config** - работает из коробки через docker-compose up

### Ключевые решения:

1. **AlembicService как Python API wrapper**
   - Вместо прямого вызова CLI используем Python API Alembic
   - Позволяет получать структурированные данные о миграциях
   - Безопасное выполнение команд внутри Python процесса

2. **Sidecar pattern для user projects**
   - User проект монтируется в /user-project внутри backend
   - Backend работает с миграциями пользователя через volume mount
   - Не требует изменения пользовательского кода

3. **REST API для всех операций**
   - GET /api/migrations/history - список всех миграций
   - POST /api/migrations/upgrade - применить миграцию
   - POST /api/migrations/downgrade - откатить миграцию
   - Стандартный HTTP протокол, легко тестировать

## Последствия

### Положительные

1. **Killer Feature**: Первый в мире визуальный интерфейс для Alembic
2. **Zero Configuration**: docker-compose up и всё работает
3. **Изоляция**: Docker обеспечивает изоляцию окружений
4. **Современный стек**: FastAPI + React - актуальные технологии 2025
5. **Type Safety**: TypeScript на фронте, Pydantic на бэке
6. **Расширяемость**: Микросервисная архитектура легко масштабируется
7. **Developer Experience**: Hot reload для фронта и бэка в dev mode

### Отрицательные

1. **Docker зависимость**: Требует Docker для запуска
2. **Overhead контейнеров**: 3 контейнера = больше ресурсов
3. **Сложность отладки**: Распределенная система сложнее дебажить
4. **Network latency**: HTTP запросы между контейнерами добавляют задержку
5. **Volume mount performance**: На Windows/Mac может быть медленным

### Риски

1. **Alembic Python API нестабилен** - документация ограничена, может измениться
   - Митигация: Wrapper изолирует нас от изменений API

2. **User проект может конфликтовать с зависимостями backend**
   - Митигация: Используем виртуальное окружение для user проекта

3. **Security**: Выполнение user кода внутри backend контейнера
   - Митигация: Read-only volumes, ограниченные права контейнера

## Альтернативы

### 1. Monolithic Django приложение
**Отклонено**: Django слишком тяжеловесен для API, хуже async поддержка чем FastAPI

### 2. Electron desktop приложение
**Отклонено**: Сложнее development, deployment, обновление. Веб более универсален

### 3. Прямой CLI wrapper без Docker
**Отклонено**: Конфликты зависимостей с user проектом, сложная настройка окружения

### 4. Next.js full-stack
**Отклонено**: Python нужен для Alembic API, Node.js не подходит

## Связанные решения

- Базовое решение для всей системы
- Будет дополнено ADR по конкретным компонентам

## Примечания

- Commit: 130d0e5 "Initial commit: PostgreSQL Admin Dashboard POC"
- PRD документация в README.md
- POC успешно реализован и работает
