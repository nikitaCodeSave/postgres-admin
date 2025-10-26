# Руководство по памяти проекта (CLAUDE.md)

## Что такое CLAUDE.md?

CLAUDE.md — это файл памяти проекта, содержащий постоянные инструкции и предпочтения, которые Claude помнит между всеми сессиями. Это как долговременная память для вашего проекта.

**Используйте для:**
- 📋 Coding standards и соглашения
- 🏗️ Архитектурные решения
- 📝 Часто используемые инструкции
- 🎯 Предпочтения по работе
- 🔗 Важные ссылки и контекст

## Расположение файлов

### Иерархия памяти

1. **Enterprise** (наивысший приоритет) — корпоративные политики
2. **Project** — память проекта
   - `CLAUDE.md` (в корне)
   - `.claude/CLAUDE.md`
3. **User** — `~/.claude/CLAUDE.md` — личная память
4. **Project local** (deprecated) — `.claude-memory/CLAUDE.md`

### Рекомендуемое расположение

```
./CLAUDE.md                # ✅ Рекомендуется (видно в корне)
./.claude/CLAUDE.md        # ✅ Альтернатива (организованно)
```

## Формат файла

CLAUDE.md — это обычный Markdown файл без специального синтаксиса.

### Базовая структура

```markdown
# Project Name

## О проекте
Краткое описание проекта и его назначения.

## Coding Standards
Соглашения по коду.

## Architecture
Архитектурные решения и паттерны.

## Frequently Used Commands
Часто используемые команды.

## Important Notes
Важная информация для контекста.
```

## Примеры CLAUDE.md

### Пример 1: Web Application

`CLAUDE.md`
```markdown
# E-commerce Platform

## Стек технологий
- **Frontend:** React 18, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, PostgreSQL
- **Testing:** Jest, Playwright
- **Deployment:** Docker, AWS

## Coding Standards

### TypeScript
- Используй строгий режим (`strict: true`)
- Предпочитай interfaces над types
- Всегда типизируй возвращаемые значения функций
- Избегай `any`, используй `unknown` если нужно

### React
- Функциональные компоненты + hooks
- Props деструктуризация
- Named exports для компонентов
- Один компонент на файл

### Naming Conventions
- Компоненты: PascalCase (`UserProfile.tsx`)
- Файлы: kebab-case (`user-profile.utils.ts`)
- Константы: UPPER_SNAKE_CASE
- Функции/переменные: camelCase

## Architecture

### Структура директорий
```
src/
├── components/    # React компоненты
├── hooks/        # Custom hooks
├── services/     # API клиенты
├── utils/        # Утилиты
├── types/        # TypeScript types
└── pages/        # Страницы приложения
```

### State Management
- React Context для глобального state
- useState/useReducer для локального state
- React Query для server state

### API Integration
- Используй `services/api.ts` для всех запросов
- Обработка ошибок через try/catch
- Типизация responses через Zod schemas

## Commit Convention

Используй Conventional Commits:
```
feat: добавить новую функциональность
fix: исправить баг
docs: изменения в документации
style: форматирование
refactor: рефакторинг
test: добавить/обновить тесты
chore: инфраструктура, зависимости
```

## Testing

- **Unit tests:** Jest для logic
- **Component tests:** React Testing Library
- **E2E tests:** Playwright для критичных flows
- Минимум 80% coverage для новых фич

## Common Tasks

### Создание нового компонента
```bash
/new-component ComponentName
```

### Создание API endpoint
```bash
/new-endpoint resource-name
```

### Деплой
```bash
npm run build
npm run deploy:staging  # для staging
npm run deploy:prod     # для production (требует подтверждения)
```

## Important Context

### Authentication
Используем JWT tokens с refresh mechanism:
- Access token: 15 минут
- Refresh token: 7 дней
- Храним в httpOnly cookies

### Database
- Миграции в `migrations/` директории
- Всегда создавай down migration
- Тестируй на dev БД перед применением

### Error Handling
Все ошибки должны логироваться с контекстом:
```typescript
logger.error('Operation failed', {
  operation: 'fetchUser',
  userId,
  error: error.message
});
```

## Performance
- Lazy load компоненты через React.lazy()
- Optimize images через next/image
- Кеширование API responses (5 минут для списков)

## Security
- Никогда не коммить .env файлы
- Валидация всех user inputs
- Sanitize HTML перед рендером
- Rate limiting на API endpoints
```

### Пример 2: Backend API

`CLAUDE.md`
```markdown
# Payment Processing API

## Tech Stack
- Node.js 20 + TypeScript
- Express.js
- PostgreSQL 16
- Redis для кеширования
- Docker + Kubernetes

## Code Style

### TypeScript
- Strict mode включен
- No any, no non-null assertions
- Explicit return types
- Prefer const over let

### Error Handling
Всегда используй custom error classes:
```typescript
class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
  }
}
```

### Async/Await
- Всегда try/catch для async операций
- Never throw в async функциях без catch
- Prefer async/await over promises

## Database

### Migrations
- Timestamp prefix: `YYYYMMDD_HHMMSS_description.sql`
- Всегда транзакции
- Всегда rollback script
- Тестируй на копии prod данных

### Queries
- Используй prepared statements
- Index все foreign keys
- EXPLAIN ANALYZE для slow queries
- Connection pooling (max 20 connections)

## Testing

### Unit Tests
- AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- One assertion per test (when possible)

### Integration Tests
- Real database (test DB)
- Seed data перед тестами
- Cleanup после тестов

### Coverage
- Minimum 85% для новых файлов
- 100% для payment logic

## API Standards

### REST Conventions
```
GET    /api/v1/payments       # List
POST   /api/v1/payments       # Create
GET    /api/v1/payments/:id   # Get
PATCH  /api/v1/payments/:id   # Update
DELETE /api/v1/payments/:id   # Delete
```

### Response Format
```json
{
  "data": {},
  "meta": {
    "timestamp": "ISO-8601",
    "requestId": "uuid"
  }
}
```

### Error Format
```json
{
  "error": {
    "code": "PAYMENT_FAILED",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Security

### Critical Rules
- NEVER log sensitive data (card numbers, CVV, passwords)
- All PII must be encrypted at rest
- Use parameterized queries (SQL injection prevention)
- Rate limiting: 100 req/min per IP
- JWT tokens expire in 1 hour

### Secrets Management
- Use AWS Secrets Manager
- Rotate API keys monthly
- Never commit .env files

## Logging

Use structured logging:
```typescript
logger.info('Payment processed', {
  paymentId,
  amount,
  currency,
  duration: Date.now() - startTime
});
```

Levels:
- error: Errors requiring immediate attention
- warn: Warnings that should be reviewed
- info: Important business events
- debug: Detailed debugging info

## Deployment

### Environments
- dev: Auto-deploy on merge to develop
- staging: Manual deploy, auto-tests
- production: Manual deploy + approval

### Checklist
- [ ] Tests pass
- [ ] Coverage > 85%
- [ ] Migration tested
- [ ] Docs updated
- [ ] Security scan passed
```

### Пример 3: Data Science Project

`CLAUDE.md`
```markdown
# ML Model Training Pipeline

## Environment
- Python 3.11
- PyTorch 2.0
- pandas, numpy, scikit-learn
- MLflow для tracking
- DVC для data versioning

## Code Standards

### Python
- PEP 8 style guide
- Type hints для всех функций
- Docstrings в Google style
- Max line length: 100

### Notebooks
- Clear markdown explanations
- Reproducible (set random seeds)
- Export важные функции в .py modules
- Save outputs для документации

## Data

### Directory Structure
```
data/
├── raw/          # Original, immutable data
├── processed/    # Cleaned data
└── features/     # Feature engineering results
```

### Data Processing
- Всегда валидируй schema
- Log data statistics (mean, std, nulls)
- Version control через DVC
- Document transformations

## Modeling

### Experiments
- Track all experiments в MLflow
- Save hyperparameters
- Log metrics: accuracy, precision, recall, F1
- Save model artifacts

### Model Naming
`{algorithm}_{version}_{date}_{metric}.pkl`
Example: `random_forest_v2_20241023_acc0.95.pkl`

### Evaluation
- Train/val/test split: 70/15/15
- Cross-validation для final model
- Test на unseen data
- Document performance по subgroups

## Common Tasks

### Train new model
```bash
python train.py --config configs/model.yaml
```

### Run experiment
```bash
mlflow run . -P alpha=0.5
```

### Deploy model
```bash
python deploy.py --model-path models/best_model.pkl
```

## Notes
- Random seed: 42 (для reproducibility)
- GPU: CUDA 11.8
- Batch size: 32 (adjust based on GPU memory)
```

## Импорт файлов

CLAUDE.md поддерживает импорт других файлов через `@path/to/file`:

```markdown
# My Project

## Architecture
@docs/architecture.md

## API Documentation
@docs/api.md

## Database Schema
@docs/database-schema.md
```

**Ограничения:**
- Максимум 5 уровней вложенности
- Избегайте циклических ссылок

## Быстрое добавление в память

### Через префикс #

```
# Claude, всегда используй TypeScript strict mode
```

Автоматически добавится в CLAUDE.md.

### Через команду /memory

```bash
/memory
```

Откроет CLAUDE.md для редактирования.

### Через команду /init

```bash
/init
```

Создаст CLAUDE.md с базовой структурой на основе анализа проекта.

## Лучшие практики

### 1. Будьте конкретны

❌ Плохо:
```markdown
## Code Style
Пиши хороший код.
```

✅ Хорошо:
```markdown
## Code Style
- Функции максимум 50 строк
- Используй early returns
- Предпочитай composition над inheritance
- Всегда типизируй параметры и return values
```

### 2. Организуйте по разделам

```markdown
# Project

## 🏗️ Architecture
## 💻 Coding Standards
## 🧪 Testing
## 🚀 Deployment
## 🔒 Security
## 📝 Documentation
```

### 3. Включайте примеры

```markdown
## Commit Messages

Используй Conventional Commits:

✅ Правильно:
`feat(auth): add OAuth2 login`

❌ Неправильно:
`updated login`
```

### 4. Периодически обновляйте

CLAUDE.md должен эволюционировать с проектом:
- Добавляйте новые conventions
- Удаляйте устаревшее
- Обновляйте примеры

### 5. Храните актуальные ссылки

```markdown
## Resources
- [API Docs](https://api-docs.example.com)
- [Design System](https://design.example.com)
- [Runbook](https://wiki.example.com/runbook)
```

### 6. Документируйте решения

```markdown
## Architecture Decisions

### Почему React Query вместо Redux?
- Меньше boilerplate
- Built-in caching
- Automatic refetching
- Better for server state

Решение принято: 2024-10-15
```

## Что НЕ включать

❌ Избегайте:
- Секреты и credentials
- Большие куски кода (используйте ссылки)
- Очень детальную документацию (выносите в docs/)
- Временные заметки (используйте comments)

## Troubleshooting

### CLAUDE.md не читается

**Проблема:** Claude не использует информацию из CLAUDE.md.

**Решения:**
1. Проверьте расположение файла (корень проекта)
2. Убедитесь что файл называется `CLAUDE.md` (не `claude.md`)
3. Перезапустите сессию

### Импорты не работают

**Проблема:** `@docs/file.md` не загружается.

**Решения:**
1. Проверьте путь (относительно CLAUDE.md)
2. Убедитесь что файл существует
3. Проверьте уровень вложенности (макс 5)

### Конфликт памяти

**Проблема:** Противоречивые инструкции из разных источников.

**Приоритет:**
1. Enterprise CLAUDE.md
2. Project CLAUDE.md
3. User CLAUDE.md

Более приоритетные переопределяют менее приоритетные.

## Полезные ссылки

- 📚 [Официальная документация Memory](https://docs.claude.com/en/docs/claude-code/memory)
- 🔧 [Configuration](https://docs.claude.com/en/docs/claude-code/configuration)
- 📝 [Best Practices](https://docs.claude.com/en/docs/claude-code/best-practices)

---

**Следующий шаг:** Интегрируйте [MCP серверы](./08-mcp.md) для расширения возможностей.
