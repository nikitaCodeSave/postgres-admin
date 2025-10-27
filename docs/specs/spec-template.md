# [NNN]. [Название фичи]

**Версия**: v0.1.0
**Дата реализации**: YYYY-MM-DD
**Автор**: [Имя]
**Status**: Active | Deprecated | Replaced

## Краткое описание

<!-- 1-2 предложения - что делает эта фича -->

## Проблема

<!-- Какую проблему решает? -->

## Решение

<!-- Как работает фича? User flow -->

## Архитектура

### Backend

**Endpoints**:
```
GET    /api/path/to/resource
POST   /api/path/to/resource
PUT    /api/path/to/resource/:id
DELETE /api/path/to/resource/:id
```

**Models/Services**:
- `ServiceName` (backend/app/services/service.py:123)
- `ModelName` (backend/app/models/model.py:45)

### Frontend

**Components**:
- `ComponentName` (frontend/src/components/Component.tsx:10)
- `HookName` (frontend/src/hooks/useHook.ts:5)

**Routes**:
- `/path` - описание страницы

### Database

**Таблицы/Модели**:
```sql
CREATE TABLE table_name (
    id SERIAL PRIMARY KEY,
    ...
);
```

## API Reference

### GET /api/example

**Описание**: ...

**Parameters**:
```typescript
{
  param1: string,
  param2?: number
}
```

**Response**:
```typescript
{
  data: Array<...>,
  total: number
}
```

**Example**:
```bash
curl http://localhost:8000/api/example?param1=value
```

## Примеры использования

### Пример 1: ...

```typescript
// код примера
```

### Пример 2: ...

```bash
# bash команда
```

## Конфигурация

<!-- Какие env variables, настройки нужны -->

```bash
ENV_VAR_NAME=value
```

## Ограничения

<!-- Что НЕ работает, known limitations -->

## Известные проблемы

<!-- Ссылки на bugs в backlog -->

## Связанные ресурсы

- ADR: [ADR-NNNN]
- Git commits: [hash]
- Related specs: [NNN-other-spec]

## Changelog

- **v0.1.0** (YYYY-MM-DD): Initial implementation
