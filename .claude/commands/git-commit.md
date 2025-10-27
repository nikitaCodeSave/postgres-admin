---
description: Создать conventional commit с правильным форматированием
allowed-tools: Bash(git:*)
---

Помогаю создать commit по стандарту Conventional Commits.

## Текущий статус Git

**Ветка**: !`git branch --show-current`

**Staged files**:
!`git diff --cached --name-status`

**Unstaged changes**:
!`git status --short`

## Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: Новая функциональность
- **fix**: Исправление бага
- **docs**: Изменения документации
- **style**: Форматирование кода (не влияет на логику)
- **refactor**: Рефакторинг без изменения функциональности
- **perf**: Улучшение производительности
- **test**: Добавление или изменение тестов
- **chore**: Изменения в build процессе, зависимостях, tooling
- **ci**: Изменения в CI/CD конфигурации

### Scope (опционально)
Область изменений: `backend`, `frontend`, `docs`, `api`, `database`, etc.

### Subject
- Максимум 50 символов
- Начинается с маленькой буквы (русский/английский)
- Без точки в конце
- Использовать повелительное наклонение

### Body (опционально)
- Максимум 72 символа на строку
- Объяснять "что" и "почему", не "как"
- Отделять от subject пустой строкой

### Footer (опционально)
- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123`, `Fixes #456`
- Co-authored-by: `Co-Authored-By: Claude <noreply@anthropic.com>`

## Примеры

### Простой commit
```
feat(backend): add AlembicService for migration management
```

### С body
```
fix(frontend): resolve migration rollback error

Downgrade was failing when parent_revision was None.
Added null check in AlembicService.
```

### С breaking change
```
feat(api): change migration endpoint response format

BREAKING CHANGE: /api/migrations/history now returns object with
pagination instead of plain array. Update all API clients.
```

### С footer
```
feat(backend): add user authentication

Implements JWT-based authentication with refresh tokens.

Closes #42
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Процесс создания commit

1. **Проанализировать изменения**:
   - Посмотреть staged diff
   - Определить type и scope
   - Сформулировать subject

2. **Спросить дополнительно**:
   - Нужен ли body? (для сложных изменений)
   - Есть ли breaking changes?
   - Связано ли с issues?

3. **Создать commit** с правильным форматированием

## Правила

✅ **Хорошие commit messages**:
- `feat(backend): add rate limiting to API endpoints`
- `fix(ui): correct button alignment in dark theme`
- `docs: update installation instructions`
- `refactor(database): optimize migration query performance`

❌ **Плохие commit messages**:
- `Update stuff` - неинформативно
- `Fixed bug` - не указан scope и что именно
- `WIP` - не для main ветки
- `asdfasdf` - бессмысленно

## Важные замечания

- 📝 Commit message пишется один раз, читается много раз
- 🎯 Быть конкретным и информативным
- 📚 Хороший commit history = хорошая документация
- 🔍 Будущий ты скажет спасибо за понятные сообщения
- 🚫 Избегать "magic" commits типа "fix", "update", "changes"

## После создания commit

Спросить:
- Нужно ли push в remote?
- Создать pull request?
- Обновить CHANGELOG? (используй `/log-change`)
- Записать в dev journal? (используй `/log-dev`)
