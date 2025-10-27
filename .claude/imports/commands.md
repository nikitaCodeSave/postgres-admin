# Справочник команд разработки

## Команды Docker (Основной метод)

### Полный стек
```bash
# Запустить все сервисы (рекомендуется)
docker-compose up --build

# Запустить в фоновом режиме
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Остановить и удалить тома
docker-compose down -v

# Просмотреть логи
docker-compose logs -f [service-name]

# Пересобрать конкретный сервис
docker-compose up --build backend
docker-compose up --build frontend
```

### Доступ к сервисам
```bash
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Документация API (Swagger): http://localhost:8000/docs
# PostgreSQL: localhost:5432
```

## Команды Backend (Локальная разработка)

### Настройка
```bash
cd backend

# Установить зависимости
poetry install

# Активировать виртуальное окружение
poetry shell
```

### Запуск сервера
```bash
# Сервер разработки с горячей перезагрузкой
poetry run python -m app.main

# Или напрямую через uvicorn
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Тестирование
```bash
# Запустить все тесты
poetry run pytest

# Запустить с покрытием
poetry run pytest --cov=app --cov-report=html

# Запустить конкретный тестовый файл
poetry run pytest tests/test_alembic_service.py

# Запустить с подробным выводом
poetry run pytest -v
```

### Качество кода
```bash
# Форматирование кода (Black)
poetry run black app/

# Проверка кода (Ruff)
poetry run ruff check app/

# Автоматическое исправление ошибок линтера
poetry run ruff check --fix app/

# Проверка типов (когда добавлено)
poetry run mypy app/
```

### Миграции базы данных
```bash
# Перейти в пример проекта
cd ../example_project

# Создать новую миграцию
alembic revision --autogenerate -m "description"

# Применить миграции
alembic upgrade head

# Откатить одну миграцию
alembic downgrade -1

# Показать текущую ревизию
alembic current

# Показать историю миграций
alembic history --verbose
```

## Команды Frontend (Локальная разработка)

### Настройка
```bash
cd frontend

# Установить зависимости
npm install

# Или с указанием реестра
npm install --registry=https://registry.npmjs.org/
```

### Запуск сервера разработки
```bash
# Сервер разработки с HMR
npm run dev

# Открывается на http://localhost:3000
```

### Сборка
```bash
# Продакшн сборка
npm run build

# Предпросмотр продакшн сборки локально
npm run preview
```

### Качество кода
```bash
# Проверка TypeScript/React
npm run lint

# Исправить автоматически исправляемые ошибки
npm run lint --fix

# Проверка типов
npx tsc --noEmit
```

### Тестирование (Планируется)
```bash
# Запустить юнит-тесты
npm test

# Запустить тесты в режиме наблюдения
npm run test:watch

# Запустить с покрытием
npm run test:coverage
```

## Команды базы данных

### Доступ к PostgreSQL CLI
```bash
# Через Docker
docker-compose exec db psql -U pguser -d pgadmin

# Полезные команды psql:
# \dt        - список таблиц
# \d table   - описание таблицы
# \l         - список баз данных
# \q         - выход
```

### Операции с базой данных
```bash
# Резервное копирование базы данных
docker-compose exec db pg_dump -U pguser pgadmin > backup.sql

# Восстановление базы данных
cat backup.sql | docker-compose exec -T db psql -U pguser pgadmin

# Удалить и пересоздать базу данных (ОПАСНО!)
docker-compose down -v
docker-compose up -d db
```

## Команды Git (Conventional Commits)

### Основные операции
```bash
# Добавить изменения в индекс
git add .

# Коммит (используйте команду /git-commit для помощи)
git commit -m "feat(backend): add new endpoint"

# Отправить изменения
git push origin main

# Создать ветку
git checkout -b feature/new-feature

# Просмотреть статус
git status

# Просмотреть различия
git diff
git diff --staged
```

### Формат Conventional Commit
```
type(scope): subject

body

footer
```

**Типы**: feat, fix, docs, style, refactor, perf, test, chore

## Команды документации

### Slash-команды (через Claude Code)
```bash
/new-feature        # Спланировать новую функцию в backlog
/add-decision       # Создать ADR для архитектурного решения
/create-spec        # Задокументировать реализованную функцию
/log-change         # Обновить CHANGELOG.md
/log-dev           # Добавить запись в журнал разработки
/create-bug        # Сообщить об ошибке
/create-improvement # Предложить улучшение
/git-commit        # Создать conventional commit
/create-release    # Подготовить новый релиз
/review-docs       # Проверить состояние документации
```

## Мониторинг и отладка

### Логи
```bash
# Следить за всеми логами
docker-compose logs -f

# Следить за конкретным сервисом
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Последние 100 строк
docker-compose logs --tail=100 backend
```

### Проверка работоспособности
```bash
# Здоровье Backend
curl http://localhost:8000/api/alembic/health

# Проверить миграции
curl http://localhost:8000/api/alembic/status
```

### Отладка контейнеров
```bash
# Выполнить команду в контейнере
docker-compose exec backend bash
docker-compose exec frontend sh

# Инспектировать контейнер
docker-compose ps
docker inspect <container_id>

# Использование ресурсов
docker stats
```

## Полезные алиасы (Добавить в ~/.bashrc или ~/.zshrc)

```bash
# Сокращения Docker Compose
alias dcu="docker-compose up"
alias dcub="docker-compose up --build"
alias dcd="docker-compose down"
alias dcl="docker-compose logs -f"
alias dcr="docker-compose restart"

# Сокращения Poetry
alias pi="poetry install"
alias pr="poetry run"
alias pt="poetry run pytest"
alias pb="poetry run black ."

# Сокращения npm
alias ni="npm install"
alias nd="npm run dev"
alias nb="npm run build"
alias nt="npm test"
```

## Команды быстрого старта

### Первоначальная настройка
```bash
# 1. Клонировать и войти в проект
git clone <repo-url>
cd Postgresql

# 2. Запустить всё
docker-compose up --build

# 3. Открыть в браузере
# http://localhost:3000
```

### Ежедневная разработка
```bash
# Запустить сервисы
docker-compose up

# Вносить изменения в код...

# Сервисы автоматически перезагружаются!
# Backend: uvicorn --reload
# Frontend: Vite HMR
```

### Перед коммитом
```bash
# 1. Запустить тесты
cd backend && poetry run pytest
cd frontend && npm test

# 2. Форматирование и проверка
cd backend && poetry run black . && poetry run ruff check .
cd frontend && npm run lint

# 3. Обновить документацию
/log-change
/log-dev

# 4. Коммит
/git-commit
```
