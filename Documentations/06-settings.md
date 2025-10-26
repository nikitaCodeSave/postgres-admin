# Руководство по настройкам (Settings)

## Что такое Settings?

Settings — это файлы конфигурации Claude Code в формате JSON, которые управляют поведением, permissions, переменными окружения, хуками и другими параметрами.

## Иерархия файлов настроек

### 1. Enterprise (наивысший приоритет)
Корпоративные политики, управляемые администраторами:

- macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
- Linux/WSL: `/etc/claude-code/managed-settings.json`
- Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`

### 2. Project settings
**`.claude/settings.json`** — настройки проекта для команды (коммитятся в git)

**`.claude/settings.local.json`** — локальные настройки (не коммитятся, в .gitignore)

### 3. User settings
**`~/.claude/settings.json`** — глобальные пользовательские настройки

### Приоритет
`Enterprise > Project local > Project > User`

## Основные параметры

### permissions
Управление доступом к инструментам.

```json
{
  "permissions": {
    "allow": ["Read", "Write", "Bash(git:*)"],
    "ask": ["Bash(npm:*)", "Bash(rm:*)"],
    "deny": ["Bash(rm -rf:*)", "Read(.env)"]
  }
}
```

**Режимы:**
- `allow` — автоматически разрешить
- `ask` — запросить подтверждение
- `deny` — запретить

**Паттерны:**
- `Tool` — точное совпадение
- `Bash(command:*)` — префикс команды
- `Read(path)` — конкретный путь

⚠️ **Важно:** Bash паттерны можно обойти, это не security feature.

### env
Переменные окружения для каждой сессии.

```json
{
  "env": {
    "NODE_ENV": "development",
    "API_URL": "https://api.example.com",
    "DEBUG": "true"
  }
}
```

### model
Выбор модели по умолчанию.

```json
{
  "model": "claude-sonnet-4-5-20250929"
}
```

**Доступные модели:**
- `claude-sonnet-4-5-20250929` — Sonnet 4.5 (рекомендуется)
- `claude-3-5-sonnet-20241022` — Sonnet 3.5
- `claude-3-opus-20240229` — Opus 3
- `claude-3-haiku-20240307` — Haiku 3

### hooks
Автоматические команды при событиях.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
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

См. [Руководство по хукам](./05-hooks.md) для деталей.

### outputStyle
Стиль форматирования ответов.

```json
{
  "outputStyle": "minimal"
}
```

### sandbox
Настройки изоляции bash команд.

```json
{
  "sandbox": {
    "enabled": true,
    "allowedPaths": ["/home/user/project"]
  }
}
```

### enabledPlugins
Список активных плагинов.

```json
{
  "enabledPlugins": ["my-plugin", "team-utils"]
}
```

## Примеры конфигураций

### Базовая настройка проекта

`.claude/settings.json`
```json
{
  "model": "claude-sonnet-4-5-20250929",
  "outputStyle": "default",
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Grep",
      "Glob",
      "Bash(git:*)",
      "Bash(npm:*)"
    ],
    "ask": [
      "Bash(rm:*)",
      "Bash(docker:*)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.git/)",
      "Read(**/*.key)",
      "Read(**/*secret*)"
    ]
  }
}
```

### Настройки для разработки

`.claude/settings.local.json`
```json
{
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "true",
    "LOG_LEVEL": "verbose"
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint-fix"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$TOOL_INPUT_command\" | grep -q \"git commit\"; then npm test; fi"
          }
        ]
      }
    ]
  }
}
```

### Безопасная конфигурация

`.claude/settings.json`
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Grep",
      "Glob"
    ],
    "ask": [
      "Write",
      "Edit",
      "Bash(git:*)"
    ],
    "deny": [
      "Bash(rm:*)",
      "Bash(sudo:*)",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Read(.env)",
      "Read(**/*.pem)",
      "Read(**/*.key)",
      "Read(.git/)",
      "Read(~/.ssh/)"
    ]
  },
  "sandbox": {
    "enabled": true
  }
}
```

### CI/CD конфигурация

`.claude/settings.json`
```json
{
  "model": "claude-3-haiku-20240307",
  "permissions": {
    "allow": [
      "Read",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(docker:*)"
    ],
    "deny": [
      "Write",
      "Edit"
    ]
  },
  "env": {
    "CI": "true",
    "NODE_ENV": "test"
  }
}
```

### Командная конфигурация

`.claude/settings.json`
```json
{
  "model": "claude-sonnet-4-5-20250929",
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Grep",
      "Glob",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(pnpm:*)",
      "SlashCommand:/commit",
      "SlashCommand:/test",
      "SlashCommand:/review"
    ],
    "ask": [
      "Bash(docker:*)",
      "SlashCommand:/deploy"
    ],
    "deny": [
      "Read(.env.local)",
      "Read(**/*.key)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$TOOL_INPUT_file_path\"",
            "timeout": 10
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/log-command.sh"
          }
        ]
      }
    ]
  },
  "enabledPlugins": ["team-standards", "api-docs"]
}
```

## Управление настройками

### Через команду /config

```bash
/config
```

Интерактивное меню для изменения настроек.

### Через команду /permissions

```bash
/permissions
```

Управление permissions через UI.

### Вручную

Редактируйте JSON файлы напрямую:

```bash
# Пользовательские настройки
vim ~/.claude/settings.json

# Проектные настройки
vim .claude/settings.json

# Локальные настройки
vim .claude/settings.local.json
```

## Защита секретов

### Исключение чувствительных файлов

```json
{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(**/*.pem)",
      "Read(**/*.key)",
      "Read(**/credentials.*)",
      "Read(.git/)",
      "Read(~/.ssh/)",
      "Read(~/.aws/)",
      "Read(**/*secret*)",
      "Read(**/*password*)"
    ]
  }
}
```

### Переменные окружения

❌ **НЕ ДЕЛАЙТЕ ТАК:**
```json
{
  "env": {
    "API_KEY": "sk-1234567890abcdef"  // Секрет в файле!
  }
}
```

✅ **ПРАВИЛЬНО:**
```json
{
  "env": {
    "API_KEY": "${API_KEY}"  // Читается из реального env
  }
}
```

Или используйте `.claude/settings.local.json` (не коммитится).

## Лучшие практики

### 1. Разделение настроек

- **settings.json** — общие для команды (коммитятся)
- **settings.local.json** — личные (не коммитятся)

### 2. Начните с ограничений

```json
{
  "permissions": {
    "allow": [],  // Пусто по умолчанию
    "ask": ["*"]  // Спрашивать для всего
  }
}
```

Постепенно добавляйте в `allow` по мере необходимости.

### 3. Документируйте permissions

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",  // Needed for commits
      "Bash(npm:*)"   // Package management
    ]
  }
}
```

### 4. Используйте hooks для стандартизации

Автоматизируйте форматирование, линтинг, тесты через hooks.

### 5. Версионируйте настройки

```bash
git add .claude/settings.json
git commit -m "Add Claude Code settings"
```

### 6. Тестируйте изменения

Проверяйте новые настройки в `.claude/settings.local.json` перед добавлением в `settings.json`.

## .gitignore

Добавьте в `.gitignore`:

```gitignore
# Claude Code
.claude/settings.local.json
.claude/logs/
.claude/cache/
```

Не игнорируйте:
```
.claude/settings.json       # Командные настройки
.claude/agents/             # Субагенты
.claude/commands/           # Команды
.claude/skills/             # Навыки
.claude/hooks/              # Скрипты хуков
```

## Troubleshooting

### Настройки не применяются

**Проблема:** Изменения в settings.json не работают.

**Решения:**
1. Проверьте JSON синтаксис (используйте JSON validator)
2. Перезапустите сессию Claude
3. Проверьте приоритет файлов (local > project > user)

### Permission denied

**Проблема:** Claude не может выполнить инструмент.

**Решения:**
1. Проверьте `permissions.deny` — не заблокирован ли инструмент
2. Добавьте инструмент в `permissions.allow`
3. Проверьте enterprise policies (если есть)

### Hooks не выполняются

**Проблема:** Настроенные хуки не работают.

**Решения:**
1. Проверьте JSON синтаксис секции `hooks`
2. Проверьте matcher паттерн
3. Убедитесь что скрипт существует и исполняемый
4. Проверьте логи: `.claude/logs/`

## Полезные ссылки

- 📚 [Официальная документация Settings](https://docs.claude.com/en/docs/claude-code/settings)
- 🔒 [Permissions](https://docs.claude.com/en/docs/claude-code/permissions)
- 🪝 [Hooks](https://docs.claude.com/en/docs/claude-code/hooks)
- 🔧 [Configuration](https://docs.claude.com/en/docs/claude-code/configuration)

---

**Следующий шаг:** Настройте [память проекта](./07-memory.md) с CLAUDE.md файлом.
