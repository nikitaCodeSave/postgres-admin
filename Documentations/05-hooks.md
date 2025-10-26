# Руководство по хукам (Hooks)

## Что такое хуки?

Hooks — это автоматические команды, которые выполняются в ответ на определенные события в Claude Code. Они позволяют автоматизировать проверки, форматирование, тесты и другие задачи.

**Возможности:**
- ⚡ Автоматизация рутинных задач
- ✅ Проверка кода перед коммитом
- 🔄 Форматирование после редактирования
- 🧪 Запуск тестов
- 🔒 Security проверки
- 📊 Логирование и мониторинг

## Конфигурация

Хуки настраиваются в файлах settings:

### Файлы конфигурации

```
~/.claude/settings.json        # Пользовательские хуки
.claude/settings.json           # Проектные хуки (shared)
.claude/settings.local.json     # Локальные хуки (не коммитятся)
```

### Расположение скриптов

```
.claude/hooks/
├── check-style.sh
├── run-tests.sh
└── validate-commit.py
```

## Формат конфигурации

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "script-to-execute",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

## Типы событий (Events)

### PreToolUse
Выполняется ДО использования инструмента.

**Использование:**
- Валидация параметров
- Проверка permissions
- Подготовка окружения

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Creating file...'"
          }
        ]
      }
    ]
  }
}
```

### PostToolUse
Выполняется ПОСЛЕ успешного использования инструмента.

**Использование:**
- Форматирование кода
- Запуск линтеров
- Обновление документации

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$TOOL_INPUT_file_path\""
          }
        ]
      }
    ]
  }
}
```

### UserPromptSubmit
Выполняется когда пользователь отправляет промпт.

**Использование:**
- Добавление контекста
- Логирование запросов
- Валидация

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Processing: $USER_PROMPT' >> .claude/logs/prompts.log"
          }
        ]
      }
    ]
  }
}
```

### Stop
Выполняется когда основной агент завершает ответ.

**Использование:**
- Финальные проверки
- Сохранение состояния
- Очистка

### SubagentStop
Выполняется когда субагент (Task tool) завершает работу.

### PreCompact
Перед сжатием контекста.

### SessionStart
При старте сессии Claude Code.

**Использование:**
- Инициализация окружения
- Установка переменных
- Проверка зависимостей

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session started' && git fetch origin"
          }
        ]
      }
    ]
  }
}
```

### SessionEnd
При завершении сессии.

**Использование:**
- Cleanup
- Сохранение логов
- Финальные проверки

### Notification
Когда Claude ожидает подтверждения или ввода.

## Matchers (Фильтры инструментов)

Матчеры определяют для каких инструментов запускать хук.

### Точное совпадение
```json
"matcher": "Write"  // Только Write tool
```

### Regex паттерн
```json
"matcher": "Edit|Write"  // Edit ИЛИ Write
"matcher": "Notebook.*"  // Все Notebook инструменты
```

### Wildcard (все инструменты)
```json
"matcher": "*"   // Все инструменты
"matcher": ""    // Тоже все инструменты
```

### MCP инструменты
```json
"matcher": "mcp__server__tool"  // Конкретный MCP tool
```

## Переменные окружения

### Общие переменные

- `$CLAUDE_PROJECT_DIR` — абсолютный путь к проекту
- `$CLAUDE_CODE_REMOTE` — "true" если web окружение

### Переменные событий

#### PreToolUse / PostToolUse
- `$TOOL_NAME` — имя инструмента
- `$TOOL_INPUT_*` — параметры инструмента (например, `$TOOL_INPUT_file_path`)

#### UserPromptSubmit
- `$USER_PROMPT` — текст промпта пользователя

## Exit коды и управление

### Exit коды

- **0** — Успех
  - stdout показывается пользователю (кроме UserPromptSubmit/SessionStart)
  - В UserPromptSubmit/SessionStart stdout добавляется в контекст

- **2** — Блокирующая ошибка
  - stderr автоматически отправляется Claude
  - Claude может исправить проблему

- **Другие** — Неблокирующая ошибка
  - stderr показывается пользователю
  - Выполнение продолжается

### JSON вывод (продвинутый)

```json
{
  "continue": true,
  "stopReason": "string",
  "suppressOutput": true,
  "systemMessage": "string",
  "hookSpecificOutput": {}
}
```

#### PreToolUse
```json
{
  "permissionDecision": "allow"  // "allow" | "deny" | "ask"
}
```

#### PostToolUse / Stop / SubagentStop
```json
{
  "decision": "block"  // "block" | undefined
}
```

## Примеры хуков

### 1. Форматирование после редактирования

`.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$TOOL_INPUT_file_path\" 2>&1"
          }
        ]
      }
    ]
  }
}
```

### 2. Линтер перед коммитом

`.claude/hooks/lint.sh`
```bash
#!/bin/bash
set -e

echo "Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
  echo "Lint errors found! Fix them before committing."
  exit 2  # Блокирующая ошибка
fi

echo "✓ Lint passed"
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
            "command": "if echo \"$TOOL_INPUT_command\" | grep -q \"git commit\"; then \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/lint.sh; fi"
          }
        ]
      }
    ]
  }
}
```

### 3. Запуск тестов после изменений

`.claude/hooks/run-tests.sh`
```bash
#!/bin/bash

FILE="$1"

# Запускать тесты только для файлов src/
if [[ $FILE == src/* ]]; then
  echo "Running tests for $FILE..."
  npm test -- --findRelatedTests "$FILE"
fi
```

`.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/run-tests.sh \"$TOOL_INPUT_file_path\"",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### 4. Security проверка

`.claude/hooks/security-check.sh`
```bash
#!/bin/bash

FILE="$1"

# Проверка на секреты в коде
if grep -E "(password|secret|api_key|token)\\s*=\\s*['\"][^'\"]+['\"]" "$FILE"; then
  echo "⚠️  WARNING: Potential secret found in $FILE"
  echo "Please review and use environment variables instead."
  exit 2  # Блокирующая ошибка
fi

exit 0
```

`.claude/settings.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/security-check.sh \"$TOOL_INPUT_file_path\""
          }
        ]
      }
    ]
  }
}
```

### 5. Автоматическое добавление copyright

`.claude/hooks/add-copyright.sh`
```bash
#!/bin/bash

FILE="$1"

# Только для новых .js/.ts файлов
if [[ $FILE =~ \\.(js|ts)$ ]] && [ ! -s "$FILE" ]; then
  cat > "$FILE" << 'EOF'
/**
 * Copyright (c) 2024 Your Company
 * Licensed under MIT
 */

EOF
fi
```

`.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/add-copyright.sh \"$TOOL_INPUT_file_path\""
          }
        ]
      }
    ]
  }
}
```

### 6. Логирование команд

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
            "command": "echo \"[$(date)] $TOOL_INPUT_command\" >> .claude/logs/commands.log"
          }
        ]
      }
    ]
  }
}
```

### 7. Проверка зависимостей при старте

`.claude/hooks/check-dependencies.sh`
```bash
#!/bin/bash

echo "Checking dependencies..."

# Проверка Node.js
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Please install it."
  exit 1
fi

# Проверка npm packages
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install..."
  npm install
fi

echo "✓ Dependencies OK"
exit 0
```

`.claude/settings.json`
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-dependencies.sh"
          }
        ]
      }
    ]
  }
}
```

### 8. Git pre-push проверка

`.claude/hooks/pre-push.sh`
```bash
#!/bin/bash

if echo "$TOOL_INPUT_command" | grep -q "git push"; then
  BRANCH=$(git branch --show-current)

  if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    echo "⚠️  Pushing to $BRANCH"
    echo "Running full test suite..."

    npm test
    if [ $? -ne 0 ]; then
      echo "❌ Tests failed! Push aborted."
      exit 2
    fi

    echo "✓ All tests passed. Proceeding with push..."
  fi
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
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre-push.sh",
            "timeout": 300
          }
        ]
      }
    ]
  }
}
```

## Безопасность хуков

### ⚠️ Важные правила безопасности

#### 1. Валидация входных данных
```bash
#!/bin/bash

FILE="$1"

# ❌ ОПАСНО: прямое использование
cat "$FILE"

# ✅ БЕЗОПАСНО: валидация
if [[ "$FILE" =~ \\.\\./ ]]; then
  echo "Invalid path"
  exit 1
fi

cat "$FILE"
```

#### 2. Квотирование переменных
```bash
# ❌ ОПАСНО
command $VAR

# ✅ БЕЗОПАСНО
command "$VAR"
```

#### 3. Проверка path traversal
```bash
FILE="$1"

# Проверка на ../
if [[ "$FILE" =~ \\.\\. ]]; then
  echo "Path traversal detected!"
  exit 1
fi
```

#### 4. Абсолютные пути для скриптов
```json
{
  "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/script.sh"
}
```

#### 5. Не доступ к секретам
Избегайте чтения:
- `.env` файлов
- `.git/` директории
- SSH ключей
- Credentials файлов

## Лучшие практики

### 1. Используйте timeout
```json
{
  "timeout": 60  // 60 секунд
}
```

### 2. Логируйте ошибки
```bash
#!/bin/bash

LOG="$CLAUDE_PROJECT_DIR/.claude/logs/hooks.log"

{
  echo "[$(date)] Hook executed"
  # ... hook logic ...
} >> "$LOG" 2>&1
```

### 3. Идемпотентность
Хуки должны быть безопасны при повторном выполнении:
```bash
# ✅ Идемпотентно
prettier --write "$FILE"

# ❌ Не идемпотентно
echo "line" >> "$FILE"
```

### 4. Быстрое выполнение
Хуки должны выполняться быстро:
- Используйте `timeout`
- Избегайте тяжелых операций
- Кешируйте результаты

### 5. Понятные сообщения
```bash
echo "✓ Lint passed"
echo "❌ Tests failed"
echo "⚠️  Warning: potential issue"
```

### 6. Graceful degradation
```bash
if ! command -v prettier &> /dev/null; then
  echo "⚠️  Prettier not found, skipping formatting"
  exit 0  # Не блокируем
fi

prettier --write "$FILE"
```

## Debugging хуков

### Включение логирования

```bash
#!/bin/bash
set -x  # Вывод всех команд

# ... hook logic ...
```

### Проверка переменных

```bash
echo "TOOL_NAME: $TOOL_NAME"
echo "TOOL_INPUT_file_path: $TOOL_INPUT_file_path"
echo "CLAUDE_PROJECT_DIR: $CLAUDE_PROJECT_DIR"
```

### Тестирование хуков

```bash
# Эмуляция окружения
export TOOL_NAME="Write"
export TOOL_INPUT_file_path="src/test.js"
export CLAUDE_PROJECT_DIR="/path/to/project"

# Запуск хука
.claude/hooks/my-hook.sh
```

## Troubleshooting

### Хук не выполняется

**Проблема:** Хук настроен но не запускается.

**Решения:**
1. Проверьте matcher паттерн
2. Проверьте JSON синтаксис в settings
3. Убедитесь что событие действительно происходит

### Хук падает с ошибкой

**Проблема:** Скрипт возвращает ошибку.

**Решения:**
1. Проверьте права на выполнение: `chmod +x .claude/hooks/script.sh`
2. Проверьте shebang: `#!/bin/bash`
3. Проверьте наличие зависимостей

### Timeout

**Проблема:** Хук прерывается по таймауту.

**Решения:**
1. Увеличьте `timeout` в настройках
2. Оптимизируйте скрипт
3. Запускайте длительные задачи в фоне

## Полезные ссылки

- 📚 [Официальная документация Hooks](https://docs.claude.com/en/docs/claude-code/hooks)
- 🔧 [Reference по Hooks](https://docs.claude.com/en/docs/claude-code/reference/hooks)
- ⚙️ [Settings](https://docs.claude.com/en/docs/claude-code/settings)

---

**Следующий шаг:** Изучите [настройки проекта](./06-settings.md) для полной конфигурации.
