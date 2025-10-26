# Руководство по MCP серверам (Model Context Protocol)

## Что такое MCP?

**Model Context Protocol (MCP)** — это открытый стандарт для интеграции AI с внешними инструментами и источниками данных. MCP позволяет Claude Code подключаться к сотням сервисов без написания custom интеграций.

**Возможности:**
- 🗄️ Доступ к базам данных
- 🌐 Интеграция с веб-сервисами
- 📁 Работа с файловыми системами
- 🔍 Поиск в документации
- 🛠️ Использование специализированных инструментов

## Типы транспортов

### 1. HTTP (рекомендуется)
Для удаленных cloud-based сервисов.

```bash
claude mcp add --transport http my-server https://api.example.com/mcp
```

### 2. Stdio
Для локальных процессов с прямым доступом к системе.

```bash
claude mcp add --transport stdio my-server -- node server.js
```

### 3. SSE (Server-Sent Events)
Устаревший, используйте HTTP.

```bash
claude mcp add --transport sse my-server https://api.example.com/sse
```

## Конфигурация

### Файл .mcp.json

**Проектный** (для команды, коммитится):
```
.mcp.json
```

**Пользовательский** (личный):
```
~/.mcp/mcp.json
```

### Формат конфигурации

`.mcp.json`
```json
{
  "servers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "filesystem": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed"],
      "env": {}
    },
    "github": {
      "transport": "http",
      "url": "https://mcp-github.example.com",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Переменные окружения

Поддерживается подстановка:
```json
{
  "env": {
    "API_KEY": "${API_KEY}",
    "DB_URL": "${DATABASE_URL:-postgres://localhost/db}"
  }
}
```

**Синтаксис:**
- `${VAR}` — обязательная переменная
- `${VAR:-default}` — с дефолтным значением

## Управление MCP серверами

### Добавление сервера

```bash
# HTTP server
claude mcp add --transport http github https://api.github.com/mcp

# Stdio server
claude mcp add --transport stdio postgres -- npx @modelcontextprotocol/server-postgres

# С переменными окружения
DATABASE_URL=postgres://localhost/mydb claude mcp add --transport stdio postgres -- npx @modelcontextprotocol/server-postgres
```

### Просмотр серверов

```bash
/mcp
```

Откроет интерактивное меню для управления MCP.

### Уровни конфигурации

**Local** (по умолчанию) — только для вас в этом проекте:
```bash
claude mcp add --scope local ...
```

**Project** — для команды через `.mcp.json`:
```bash
claude mcp add --scope project ...
```

**User** — для всех ваших проектов:
```bash
claude mcp add --scope user ...
```

### Удаление сервера

```bash
claude mcp remove server-name
```

### OAuth 2.0 аутентификация

```bash
/mcp
# Выберите сервер → Authenticate
```

## Популярные MCP серверы

### 1. PostgreSQL

Доступ к PostgreSQL базам данных.

**Установка:**
```bash
claude mcp add --transport stdio postgres -- npx -y @modelcontextprotocol/server-postgres
```

**Использование:**
```
"Покажи все таблицы в БД"
"Выполни SELECT * FROM users LIMIT 10"
"Создай индекс на email колонке"
```

### 2. Filesystem

Безопасный доступ к файловой системе.

**Установка:**
```bash
claude mcp add --transport stdio filesystem -- npx -y @modelcontextprotocol/server-filesystem /allowed/path
```

**Использование:**
```
"Найди все .ts файлы в проекте"
"Прочитай конфигурацию в /etc/app/config.json"
```

### 3. GitHub

Работа с GitHub API.

**Установка:**
```bash
claude mcp add --transport http github https://mcp.github.com --header "Authorization: Bearer $GITHUB_TOKEN"
```

**Использование:**
```
"Создай issue в репозитории"
"Покажи открытые PR"
"Получи diff для PR #123"
```

### 4. Brave Search

Поиск в интернете через Brave.

**Установка:**
```bash
claude mcp add --transport http brave https://mcp.brave.com --header "X-API-Key: $BRAVE_API_KEY"
```

**Использование:**
```
"Найди последнюю документацию по React hooks"
```

### 5. Google Drive

Доступ к Google Drive файлам.

**Установка:**
```bash
claude mcp add --transport http gdrive https://mcp.google.com/drive
# Затем аутентификация через OAuth
/mcp → gdrive → Authenticate
```

**Использование:**
```
"Найди все spreadsheets с 'Q4' в названии"
"Прочитай документ 'Project Plan'"
```

### 6. Slack

Интеграция со Slack.

**Установка:**
```bash
claude mcp add --transport http slack https://mcp.slack.com --header "Authorization: Bearer $SLACK_TOKEN"
```

**Использование:**
```
"Отправь сообщение в канал #engineering"
"Покажи последние сообщения"
```

### 7. Everything Search

Быстрый поиск файлов в Windows (через Everything).

**Установка:**
```bash
claude mcp add --transport stdio everything -- npx -y @modelcontextprotocol/server-everything
```

### 8. Puppeteer

Автоматизация браузера.

**Установка:**
```bash
claude mcp add --transport stdio puppeteer -- npx -y @modelcontextprotocol/server-puppeteer
```

**Использование:**
```
"Сделай скриншот сайта example.com"
"Заполни форму регистрации"
```

## Использование MCP в коде

### Инструменты MCP

MCP серверы предоставляют tools в формате:
```
mcp__server-name__tool-name
```

Пример:
```
mcp__postgres__query
mcp__github__create-issue
mcp__filesystem__read-file
```

### Ресурсы MCP

Ссылки на ресурсы:
```
@server:protocol://resource/path
```

Примеры:
```
@postgres:table://users
@github:pr://owner/repo/123
@gdrive:file://document-id
```

### MCP Prompts как команды

MCP prompts автоматически становятся slash-командами:
```bash
/mcp__servername__promptname
```

Пример:
```bash
/mcp__github__create-pr
/mcp__postgres__analyze-table
```

## Примеры использования

### Пример 1: Работа с БД

`.mcp.json`
```json
{
  "servers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

**Использование:**
```
"Покажи schema таблицы users"
"Найди все записи где created_at > '2024-01-01'"
"Создай миграцию для добавления email_verified поля"
"Оптимизируй запрос: SELECT * FROM orders WHERE user_id IN (...)"
```

### Пример 2: Интеграция с GitHub

`.mcp.json`
```json
{
  "servers": {
    "github": {
      "transport": "http",
      "url": "https://api.mcp.github.com",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Использование:**
```
"Создай issue: Bug in login flow"
"Покажи все open PRs в этом репозитории"
"Прокомментируй PR #456 с code review"
"Получи diff для последнего коммита"
```

### Пример 3: Multi-server конфигурация

`.mcp.json`
```json
{
  "servers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "github": {
      "transport": "http",
      "url": "https://api.mcp.github.com",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "slack": {
      "transport": "http",
      "url": "https://mcp.slack.com",
      "headers": {
        "Authorization": "Bearer ${SLACK_TOKEN}"
      }
    },
    "docs": {
      "transport": "http",
      "url": "https://mcp-docs.example.com",
      "headers": {
        "X-API-Key": "${DOCS_API_KEY}"
      }
    }
  }
}
```

**Workflow:**
```
1. "Найди в документации как работает authentication"
2. "Проверь в БД текущую схему users таблицы"
3. "Создай issue в GitHub для добавления OAuth"
4. "Отправь уведомление в Slack #engineering"
```

## Ограничение вывода

По умолчанию MCP tools могут возвращать большие объемы данных.

**Ограничение через переменную окружения:**
```bash
export MAX_MCP_OUTPUT_TOKENS=5000
```

Или в settings:
```json
{
  "env": {
    "MAX_MCP_OUTPUT_TOKENS": "10000"
  }
}
```

## Enterprise конфигурация

Администраторы могут управлять доступными MCP серверами:

**Managed settings:**
```json
{
  "mcp": {
    "allowedServers": ["postgres", "github"],
    "deniedServers": ["*"]
  }
}
```

## Безопасность

### ⚠️ Важные правила

1. **Не коммитьте токены**
   ```json
   // ❌ ОПАСНО
   "headers": {
     "Authorization": "Bearer sk-1234..."
   }

   // ✅ БЕЗОПАСНО
   "headers": {
     "Authorization": "Bearer ${API_TOKEN}"
   }
   ```

2. **Ограничивайте доступ**
   Для filesystem серверов указывайте конкретные пути:
   ```bash
   npx @modelcontextprotocol/server-filesystem /project/allowed/path
   ```

3. **Валидируйте вывод**
   MCP tools могут возвращать чувствительные данные.

4. **Используйте read-only режимы**
   Где возможно, ограничивайте права до read-only.

## Troubleshooting

### Сервер не подключается

**Проблема:** MCP сервер не доступен.

**Решения:**
1. Проверьте URL/command
2. Проверьте переменные окружения
3. Проверьте сетевой доступ
4. Посмотрите логи: `/mcp` → View logs

### Аутентификация не работает

**Проблема:** OAuth или API token не принимается.

**Решения:**
1. Перезапустите аутентификацию: `/mcp` → Authenticate
2. Проверьте токен в переменных окружения
3. Проверьте права токена (scopes)

### Инструмент не найден

**Проблема:** `mcp__server__tool` не распознается.

**Решения:**
1. Проверьте что сервер подключен: `/mcp`
2. Проверьте имя сервера в `.mcp.json`
3. Перезапустите сессию Claude

## Создание собственного MCP сервера

Документация по созданию custom MCP серверов:
- [MCP SDK](https://github.com/modelcontextprotocol/servers)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Полезные ссылки

- 📚 [Официальная документация MCP](https://docs.claude.com/en/docs/claude-code/mcp)
- 🔧 [MCP Specification](https://spec.modelcontextprotocol.io)
- 💻 [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- 🛠️ [Building MCP Servers](https://modelcontextprotocol.io/docs/building-servers)

---

**Следующий шаг:** Изучите [лучшие практики](./09-best-practices.md) для эффективного использования Claude Code.
