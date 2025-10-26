# Лучшие практики использования Claude Code

Практические рекомендации и примеры для эффективной работы с Claude Code.

## Организация проекта

### Начало работы с новым проектом

**1. Инициализация**
```bash
# Создать CLAUDE.md с описанием проекта
/init

# Настроить permissions
/permissions

# Выбрать модель
/model
```

**2. Структура .claude/**
```
.claude/
├── agents/              # Субагенты
│   ├── code-reviewer.md
│   └── test-writer.md
├── commands/            # Slash-команды
│   ├── git/
│   │   ├── commit.md
│   │   └── review-pr.md
│   └── deploy.md
├── skills/              # Навыки
│   └── pdf-processor/
│       └── SKILL.md
├── output-styles/       # Стили вывода
│   └── minimal.md
├── hooks/               # Скрипты
│   ├── lint.sh
│   └── test.sh
├── settings.json        # Командные настройки
└── settings.local.json  # Локальные настройки
```

**3. CLAUDE.md**
```markdown
# Project Name

## Tech Stack
[Список технологий]

## Coding Standards
[Стандарты кода]

## Common Tasks
- `/commit` — создать коммит
- `/test` — запустить тесты
- `/deploy` — деплой

## Important Context
[Важная информация о проекте]
```

**4. .gitignore**
```gitignore
.claude/settings.local.json
.claude/logs/
.claude/cache/
```

### Командная работа

**Что коммитить в git:**
```bash
git add .claude/agents/
git add .claude/commands/
git add .claude/skills/
git add .claude/hooks/
git add .claude/settings.json  # Не settings.local.json!
git add CLAUDE.md
git add .mcp.json
```

**Что НЕ коммитить:**
```gitignore
.claude/settings.local.json
.claude/logs/
.claude/cache/
```

## Эффективные промпты

### ✅ Хорошие промпты

**Конкретика:**
```
"Создай React компонент UserProfile с props: name, email, avatar.
Используй TypeScript и styled-components.
Добавь loading и error states."
```

**С контекстом:**
```
"Оптимизируй функцию calculatePrice в src/utils/pricing.ts.
Сейчас она работает O(n²), нужно O(n log n) или лучше.
Функция используется в checkout flow."
```

**Пошаговые инструкции:**
```
"1. Прочитай API endpoint в src/api/users.ts
 2. Создай аналогичный для orders
 3. Добавь валидацию через Zod
 4. Напиши unit тесты"
```

### ❌ Неэффективные промпты

**Слишком общие:**
```
"Исправь код"
"Сделай лучше"
"Добавь функциональность"
```

**Без контекста:**
```
"Оптимизируй это"  # Что именно? Скорость? Память? Читаемость?
```

**Множественные несвязанные задачи:**
```
"Создай компонент, исправь тесты, обнови документацию, оптимизируй БД"
# Разбейте на отдельные задачи
```

## Использование субагентов

### Проактивное использование

**В CLAUDE.md:**
```markdown
## Workflow

После написания кода:
1. Автоматически используй code-reviewer для проверки
2. Затем test-writer для создания тестов
3. Затем documentor для обновления docs
```

Claude будет автоматически запускать агентов.

### Специализация

**Создавайте узкоспециализированных агентов:**

```markdown
---
name: react-expert
description: Эксперт по React. Используй для React компонентов.
---
```

```markdown
---
name: sql-expert
description: Эксперт по PostgreSQL. Используй для работы с БД.
---
```

```markdown
---
name: security-auditor
description: Security аудит. Используй перед мержем в main.
---
```

### Ограничение инструментов

Давайте только необходимое:

```markdown
---
name: code-reviewer
tools: Read, Grep, Glob  # Нет Write/Edit
---
```

## Slash-команды для типичных задач

### Git workflow

`.claude/commands/git/commit.md`
```markdown
---
description: Создать conventional commit
allowed-tools: Bash(git:*)
---

!`git status --short`
!`git diff --cached`

Создай commit message по Conventional Commits.
После подтверждения выполни git commit.
```

`.claude/commands/git/sync.md`
```markdown
---
description: Синхронизировать ветку с main
allowed-tools: Bash(git:*)
---

1. git fetch origin
2. git rebase origin/main
3. Разреши конфликты если есть
4. git push --force-with-lease
```

### Development

`.claude/commands/new-component.md`
```markdown
---
description: Создать новый React компонент
argument-hint: [ComponentName]
---

Создай компонент $1:

**Файлы:**
- src/components/$1/$1.tsx
- src/components/$1/$1.test.tsx
- src/components/$1/$1.stories.tsx
- src/components/$1/index.ts

**Используй:**
- TypeScript
- Functional component + hooks
- Props interface
- styled-components
```

`.claude/commands/new-api.md`
```markdown
---
description: Создать CRUD API endpoint
argument-hint: [resource-name]
---

Создай CRUD endpoint для $1:

**Файлы:**
- src/routes/$1.routes.ts
- src/controllers/$1.controller.ts
- src/services/$1.service.ts
- src/models/$1.model.ts
- src/validators/$1.validator.ts
- tests/$1.test.ts

Используй существующие endpoints как reference.
```

### Testing

`.claude/commands/test.md`
```markdown
---
description: Создать тесты для файла
argument-hint: [file-path]
---

Файл: @$1

Создай comprehensive тесты:
- Unit tests для всех функций
- Edge cases
- Error handling
- 100% coverage цель
```

### Documentation

`.claude/commands/docs.md`
```markdown
---
description: Обновить документацию
---

1. Проверь что изменилось: !`git diff --name-only HEAD~1`
2. Обнови README.md если нужно
3. Обнови API docs если endpoint изменились
4. Обнови CHANGELOG.md
```

## Hooks для автоматизации

### Форматирование кода

`.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$TOOL_INPUT_file_path\" 2>&1",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### Линтинг перед коммитом

`.claude/hooks/pre-commit.sh`
```bash
#!/bin/bash

if echo "$TOOL_INPUT_command" | grep -q "git commit"; then
  echo "Running linter..."
  npm run lint

  if [ $? -ne 0 ]; then
    echo "❌ Lint errors! Fix before committing."
    exit 2
  fi

  echo "✓ Lint passed"
fi

exit 0
```

`.claude/settings.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre-commit.sh"
          }
        ]
      }
    ]
  }
}
```

### Автотесты

`.claude/hooks/auto-test.sh`
```bash
#!/bin/bash

FILE="$1"

# Только для файлов src/
if [[ $FILE == src/* ]]; then
  echo "Running tests for $FILE..."
  npm test -- --findRelatedTests "$FILE" --passWithNoTests

  if [ $? -ne 0 ]; then
    echo "⚠️  Tests failed for $FILE"
    exit 2
  fi
fi

exit 0
```

## Управление контекстом

### Когда использовать /compact

```bash
# Когда контекст заполнен
/compact Сохрани важные решения и context, удали resolved issues
```

### Когда использовать /clear

```bash
# Начать новую задачу с чистого листа
/clear
```

### Организация работы

**Одна задача — одна сессия:**
```
Сессия 1: Реализация feature A
/clear
Сессия 2: Bug fix B
/clear
Сессия 3: Рефакторинг C
```

## Безопасность

### Permissions

**Начните с ограничений:**
```json
{
  "permissions": {
    "allow": ["Read", "Grep", "Glob"],
    "ask": ["Write", "Edit", "Bash(git:*)"],
    "deny": [
      "Bash(rm:*)",
      "Bash(sudo:*)",
      "Read(.env)",
      "Read(**/*.key)"
    ]
  }
}
```

**Постепенно расширяйте:**
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(git:*)",
      "Bash(npm:*)"
    ]
  }
}
```

### Защита секретов

**В .claude/settings.json:**
```json
{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(**/*.pem)",
      "Read(**/*.key)",
      "Read(.git/)",
      "Read(~/.ssh/)",
      "Read(**/*secret*)",
      "Read(**/*password*)",
      "Read(**/*credential*)"
    ]
  }
}
```

**Переменные окружения:**
```json
{
  "env": {
    "API_KEY": "${API_KEY}",  // Из реального env, НЕ хардкод!
    "NODE_ENV": "development"
  }
}
```

## Оптимизация производительности

### Выбор модели

**По типу задачи:**

| Задача | Модель | Почему |
|--------|--------|--------|
| Простые правки | Haiku | Быстро и дешево |
| Большинство задач | Sonnet | Баланс |
| Сложная архитектура | Opus | Максимальное качество |
| Code review | Sonnet/Opus | Нужно внимание к деталям |
| Генерация тестов | Sonnet | Достаточно качества |

**В командах:**
```yaml
model: claude-3-haiku-20240307  # Для простых команд
```

**Для субагентов:**
```yaml
model: inherit  # Использовать модель основного диалога
```

### Параллельные запросы

**Используйте независимые задачи параллельно:**
```
"Создай три компонента: Header, Footer, Sidebar.
Они независимы друг от друга."
```

Claude может работать над ними параллельно.

## Workflow примеры

### Feature Development

```markdown
1. Создать ветку: `git checkout -b feature/user-auth`

2. "Создай authentication flow:
   - Login component
   - JWT token handling
   - Protected routes
   - Logout functionality"

3. После создания кода → code-reviewer автоматически проверит

4. После ревью → test-writer создаст тесты

5. `/commit` — создать коммит

6. `/create-pr` — создать pull request

7. "Используй code-reviewer для final check"

8. Мерж в main
```

### Bug Fix Workflow

```markdown
1. "Найди причину бага: пользователи не могут залогиниться"

2. Claude анализирует код

3. "Исправь найденную проблему"

4. "Создай regression test для этого бага"

5. `/commit` — коммит с fix

6. `/test` — запустить все тесты

7. `/create-pr` — создать PR
```

### Refactoring Workflow

```markdown
1. "Проанализируй src/utils/helpers.ts и предложи улучшения"

2. Claude дает рекомендации

3. "Применить рекомендации 1, 3, 5"

4. После каждого изменения → тесты должны проходить

5. `/commit` после каждого successful рефакторинга

6. "Создай migration guide если breaking changes"
```

## Интеграция с CI/CD

### GitHub Actions

`.github/workflows/claude-review.yml`
```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Claude Code Review
        run: |
          claude --headless "Review PR changes: $(git diff main...HEAD)"
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Pre-commit Hook (local)

`.git/hooks/pre-commit`
```bash
#!/bin/bash

# Запустить Claude для проверки staged файлов
claude --headless "Review staged changes and check for:
- Security issues
- Code quality problems
- Missing tests
Блокируй коммит если critical issues."

if [ $? -ne 0 ]; then
  echo "Claude found critical issues. Commit blocked."
  exit 1
fi

exit 0
```

## Советы по продуктивности

### 1. Используйте CLAUDE.md максимально

Добавляйте в CLAUDE.md:
- Частые задачи
- Coding standards
- Архитектурные решения
- Важный контекст

### 2. Создавайте алиасы для команд

`~/.bashrc`:
```bash
alias cr="claude"
alias c-commit="claude /commit"
alias c-test="claude /test"
alias c-review="claude 'Review last changes'"
```

### 3. Шаблоны для типичных задач

Создайте команды для повторяющихся задач:
- `/new-component`
- `/new-api`
- `/new-test`
- `/deploy`

### 4. Используйте субагентов проактивно

В CLAUDE.md:
```markdown
После каждого кода запускай code-reviewer.
После каждого review запускай test-writer.
```

### 5. Логируйте важные решения

```bash
/memory

# Добавить в CLAUDE.md:
## Architecture Decisions

### 2024-10-23: Выбрали React Query
Причина: better caching, меньше boilerplate
```

## Распространенные ошибки

### ❌ Ошибка 1: Слишком общие промпты

**Плохо:**
```
"Исправь баг"
```

**Хорошо:**
```
"Пользователи не могут залогиниться. Ошибка: 401 Unauthorized.
Проверь:
1. Token expiration logic
2. Refresh token flow
3. CORS settings"
```

### ❌ Ошибка 2: Не использование контекста

**Плохо:**
```
"Создай компонент"
```

**Хорошо:**
```
"Создай компонент UserProfile:
- Используй существующий стиль из @src/components/common/Card.tsx
- Следуй паттерну @src/components/ProductCard.tsx
- TypeScript + styled-components"
```

### ❌ Ошибка 3: Игнорирование CLAUDE.md

**Плохо:**
Каждый раз объяснять coding standards.

**Хорошо:**
Один раз описать в CLAUDE.md, Claude будет помнить.

### ❌ Ошибка 4: Хардкод секретов в настройках

**Плохо:**
```json
{
  "env": {
    "API_KEY": "sk-1234567890"
  }
}
```

**Хорошо:**
```json
{
  "env": {
    "API_KEY": "${API_KEY}"
  }
}
```

### ❌ Ошибка 5: Слишком широкие permissions

**Плохо:**
```json
{
  "permissions": {
    "allow": ["*"]
  }
}
```

**Хорошо:**
```json
{
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Bash(git:*)"],
    "ask": ["Bash(rm:*)", "Bash(docker:*)"]
  }
}
```

## Заключение

**Ключевые принципы:**

1. ✅ **Организуйте** — структурируйте .claude/ папку
2. ✅ **Документируйте** — используйте CLAUDE.md
3. ✅ **Автоматизируйте** — hooks для рутинных задач
4. ✅ **Специализируйте** — создавайте узких агентов
5. ✅ **Защищайте** — настраивайте permissions
6. ✅ **Делитесь** — коммитьте настройки для команды
7. ✅ **Итерируйте** — постоянно улучшайте workflow

---

## Полезные ссылки

### Документация
- [Официальный сайт](https://docs.claude.com/en/docs/claude-code)
- [Быстрый старт](https://docs.claude.com/en/docs/claude-code/quickstart)
- [Best Practices](https://docs.claude.com/en/docs/claude-code/best-practices)

### Компоненты
- [Субагенты](./01-agents.md)
- [Slash-команды](./02-commands.md)
- [Skills](./03-skills.md)
- [Output Styles](./04-output-styles.md)
- [Hooks](./05-hooks.md)
- [Settings](./06-settings.md)
- [Memory](./07-memory.md)
- [MCP](./08-mcp.md)

### Сообщество
- [GitHub Discussions](https://github.com/anthropics/claude-code/discussions)
- [Issue Tracker](https://github.com/anthropics/claude-code/issues)

---

**Начните с малого, итерируйте, автоматизируйте. Удачи!** 🚀
