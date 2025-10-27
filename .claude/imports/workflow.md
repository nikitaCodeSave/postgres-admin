# Рабочий процесс разработки и руководства

## Git Workflow

### Стратегия ветвления
```
main (готово к production)
  ├── feature/database-browser
  ├── feature/query-editor
  ├── fix/migration-rollback
  └── docs/update-readme
```

**Именование веток**:
- `feature/` - новая функциональность
- `fix/` - исправления багов
- `docs/` - обновления документации
- `refactor/` - рефакторинг кода
- `test/` - добавление тестов

### Соглашения о коммитах (Conventional Commits)

**Формат**:
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Типы**:
- `feat` - новая функциональность
- `fix` - исправление бага
- `docs` - изменения документации
- `style` - форматирование кода
- `refactor` - рефакторинг без изменения функциональности
- `perf` - улучшения производительности
- `test` - добавление тестов
- `chore` - изменения в build, зависимостях, tooling

**Области (Scopes)**: `backend`, `frontend`, `docs`, `docker`, `ci`

**Примеры**:
```bash
feat(backend): add AlembicService for migration management

fix(frontend): resolve migration rollback button state

docs: update installation instructions in README

refactor(backend): extract validation logic to separate module

chore(deps): upgrade FastAPI to 0.119.1
```

**Используйте команду /git-commit** для помощи с форматированием!

### Процесс работы с Pull Request

1. **Создать ветку для функциональности**
   ```bash
   git checkout -b feature/database-browser
   ```

2. **Внести изменения и закоммитить**
   ```bash
   git add .
   /git-commit  # Использовать команду Claude Code
   ```

3. **Отправить ветку**
   ```bash
   git push origin feature/database-browser
   ```

4. **Создать PR** (использовать GitHub CLI или планируемую команду `/create-pr`)
   ```bash
   gh pr create --title "feat(frontend): add database browser UI" \
     --body "Implements visual table browser with CRUD operations"
   ```

5. **Ревью и слияние**
   - CI проходит (тесты, линтинг)
   - Код-ревью одобрено
   - Squash и merge в main

## Цикл разработки

### 1. Фаза планирования

**Для новых функций**:
```bash
# 1. Создать спецификацию функции
/new-feature database-browser

# 2. Задокументировать архитектурные решения (если значительные)
/add-decision use-react-query-for-caching

# 3. Обновить бэклог при необходимости
# Редактировать docs/backlog/features/P1-database-browser.md
```

**Результат**:
- `docs/backlog/features/P1-feature-name.md`
- `docs/adr/NNNN-decision-name.md` (если архитектурное решение)

### 2. Фаза разработки

**Ежедневный рабочий процесс**:
```bash
# Запустить Docker сервисы
docker-compose up

# Вносить изменения в код...
# Backend автоматически перезагружается (uvicorn --reload)
# Frontend автоматически перезагружается (Vite HMR)

# Тестировать изменения вручную в браузере
# http://localhost:3000

# Запустить автоматические тесты (когда доступны)
cd backend && poetry run pytest
cd frontend && npm test
```

**Проверки качества кода**:
```bash
# Backend
cd backend
poetry run black app/           # Форматирование
poetry run ruff check app/      # Линтинг

# Frontend
cd frontend
npm run lint                    # ESLint
npx tsc --noEmit               # Проверка типов
```

### 3. Фаза документирования

**После завершения функции**:
```bash
# 1. Создать детальную спецификацию
/create-spec database-browser

# 2. Обновить CHANGELOG
/log-change

# 3. Написать запись в журнале разработки
/log-dev

# 4. Обновить README при необходимости (вручную)
```

**Результат**:
- `docs/specs/NNN-feature-name.md`
- Обновленный `docs/CHANGELOG.md`
- Запись в `docs/dev-journal/YYYY-MM.md`

### 4. Коммит и Push

```bash
# Использовать conventional commit
/git-commit

# Или вручную
git commit -m "feat(backend): add database browser API endpoints"

# Push
git push origin feature/database-browser
```

### 5. Фаза ревью

```bash
# Проверить состояние документации
/review-docs

# Искать:
# - Отсутствующие спецификации для реализованных функций
# - Устаревшие ADR
# - Неполные записи в CHANGELOG
# - Устаревшие элементы бэклога
```

## Процесс исправления багов

### 1. Сообщить о баге
```bash
/create-bug

# Заполнить:
# - Серьезность: CRITICAL/HIGH/MEDIUM/LOW
# - Описание
# - Шаги для воспроизведения
# - Ожидаемое vs фактическое поведение
```

**Результат**: `docs/backlog/bugs/SEVERITY-bug-description.md`

### 2. Исправить баг
```bash
# Создать ветку для исправления
git checkout -b fix/migration-rollback-error

# Внести изменения...

# Протестировать исправление
poetry run pytest tests/test_alembic_service.py
```

### 3. Задокументировать исправление
```bash
# Обновить CHANGELOG
/log-change
# Тип: Fixed

# Записать в журнал разработки
/log-dev

# Закоммитить
/git-commit
# Тип: fix
```

### 4. Закрыть отчет о баге
- Переместить файл бага в `docs/backlog/bugs/closed/` ИЛИ
- Удалить файл и сослаться в сообщении коммита

## Процесс улучшений

### 1. Предложить улучшение
```bash
/create-improvement

# Заполнить:
# - Область: ui/backend/devops/docs/performance/security
# - Текущее состояние
# - Предлагаемое улучшение
# - Почему это важно
```

**Результат**: `docs/backlog/improvements/area-improvement-name.md`

### 2. Реализовать
Аналогично разработке функций

### 3. Задокументировать
```bash
/log-change  # Тип: Changed
/log-dev
/git-commit  # Тип: refactor или perf
```

## Процесс релиза

### Подготовка релиза

```bash
# 1. Проверить все изменения
/review-docs

# 2. Убедиться, что все задокументировано
# Проверить:
# - Все функции имеют спецификации
# - CHANGELOG заполнен
# - Нет незавершенных элементов "в процессе"

# 3. Создать релиз
/create-release v0.2.0

# Это:
# - Переместит [Unreleased] → [0.2.0] в CHANGELOG
# - Создаст git тег
# - Отправит на удаленный репозиторий
```

### Нумерация версий (Semantic Versioning)

**Формат**: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0) - Ломающие изменения
- **MINOR** (0.2.0) - Новые функции, обратно совместимые
- **PATCH** (0.1.1) - Исправления багов, обратно совместимые

**Пре-релиз**: `0.2.0-alpha.1`, `0.2.0-beta.1`, `0.2.0-rc.1`

## Стратегия тестирования

### Текущее состояние (POC)
- ⚠️ Только ручное тестирование
- ⚠️ Автоматических тестов пока нет

### Планируется (MVP)

**Тесты Backend** (pytest):
```bash
cd backend

# Запустить все тесты
poetry run pytest

# Запустить с покрытием
poetry run pytest --cov=app --cov-report=html

# Запустить конкретный тест
poetry run pytest tests/test_alembic_service.py -v
```

**Тесты Frontend** (Vitest):
```bash
cd frontend

# Запустить все тесты
npm test

# Запустить в режиме отслеживания
npm run test:watch

# Покрытие
npm run test:coverage
```

**Интеграционные тесты**:
```bash
# Тест полного стека с Docker
docker-compose up -d
./scripts/run-integration-tests.sh
docker-compose down
```

## Руководство по код-ревью

### Чеклист ревьюера

**Качество кода**:
- [ ] Следует стилю кода проекта
- [ ] Добавлены type hints/types
- [ ] Нет неиспользуемых импортов
- [ ] Нет console.log/print выражений
- [ ] Присутствует обработка ошибок

**Функциональность**:
- [ ] Решает поставленную задачу
- [ ] Обработаны крайние случаи
- [ ] Нет очевидных багов
- [ ] Приемлемая производительность

**Тестирование**:
- [ ] Добавлены тесты для новой функциональности
- [ ] Тесты проходят
- [ ] Выполнено ручное тестирование

**Документация**:
- [ ] Обновлен CHANGELOG (`/log-change`)
- [ ] Создан ADR если архитектурное (`/add-decision`)
- [ ] Создана спецификация если функция (`/create-spec`)
- [ ] Комментарии в коде объясняют ПОЧЕМУ

**Git**:
- [ ] Сообщение коммита следует соглашениям
- [ ] Описание PR четкое
- [ ] Имя ветки подходящее

### Чеклист автора (перед созданием PR)

```bash
# 1. Самостоятельно проверить код
git diff main...feature/my-feature

# 2. Запустить тесты
poetry run pytest && npm test

# 3. Проверить качество кода
poetry run black . && poetry run ruff check .
npm run lint

# 4. Обновить документацию
/log-change
/log-dev
/review-docs  # Проверить полноту

# 5. Закоммитить с хорошим сообщением
/git-commit

# 6. Отправить и создать PR
git push origin feature/my-feature
gh pr create --fill
```

## CI/CD (Планируется)

### GitHub Actions Workflow

**При Push в feature ветки**:
- Проверка кода (Black, Ruff, ESLint)
- Проверка типов (mypy, tsc)
- Запуск тестов (pytest, vitest)
- Сборка Docker образов (тест)

**При PR в main**:
- Все вышеперечисленные проверки
- Интеграционные тесты
- Развертывание превью (планируется)

**При Push в main**:
- Все вышеперечисленные проверки
- Сборка production Docker образов
- Тегирование версии
- Развертывание на staging (планируется)

**При Release Tag**:
- Сборка production образов
- Отправка в Docker Hub
- Создание GitHub Release
- Развертывание в production (планируется)

## Быстрая справка по Slash командам

### Планирование
- `/new-feature [name]` - Спланировать новую функцию
- `/add-decision` - Задокументировать архитектурное решение

### Разработка
- `/git-commit` - Создать conventional commit
- `/create-bug` - Сообщить о баге
- `/create-improvement` - Предложить улучшение

### Документация
- `/create-spec [name]` - Задокументировать реализованную функцию
- `/log-change` - Обновить CHANGELOG
- `/log-dev` - Запись в журнале разработки
- `/review-docs` - Проверка здоровья документации

### Релиз
- `/create-release [version]` - Подготовить релиз

## Использование подагентов

### postgres-python-expert

**Когда использовать**:
- Работа с SQLAlchemy моделями
- Создание/изменение Alembic миграций
- Оптимизация запросов к базе данных
- PostgreSQL-специфичные функции
- Настройка asyncpg

**Как вызвать** (через Claude Code):
```
"Использовать субагент postgres-python-expert для создания SQLAlchemy модели для..."
```

**Агент всегда начинает с веб-поиска** для получения последних версий и лучших практик!

## Краткое изложение лучших практик

✅ **ДЕЛАТЬ**:
- Использовать Docker для разработки
- Следовать conventional commits
- Документировать архитектурные решения (ADR)
- Обновлять CHANGELOG для всех изменений
- Писать записи в журнале разработки
- Запускать тесты перед коммитом
- Типизировать все (Python + TypeScript)
- Использовать slash команды для единообразия

❌ **НЕ ДЕЛАТЬ**:
- Коммитить напрямую в main
- Пропускать документацию
- Оставлять console.log/print в коде
- Хардкодить конфигурацию
- Писать общие сообщения коммитов
- Дублировать код
- Игнорировать ошибки линтинга
- Сливать непротестированный код

## Коммуникация

### Задачи (Issues)
- Использовать GitHub Issues для отчетов о багах
- Правильно помечать метками (bug, feature, documentation)
- Ссылаться в коммитах (`Fixes #123`)

### Обсуждения
- Использовать GitHub Discussions для вопросов
- Slack/Discord для быстрых вопросов (если доступно)

### Документация
- Первичный источник: папка `docs/`
- Вторичный: Комментарии в коде
- Третичный: Сообщения git коммитов
