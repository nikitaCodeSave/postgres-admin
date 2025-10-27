# 001. Visual Alembic UI

**Версия**: v0.1.0
**Дата реализации**: 2025-10-27
**Автор**: Nikita & Claude
**Status**: Active

## Краткое описание

Первый в мире графический веб-интерфейс для управления Alembic миграциями PostgreSQL. Позволяет просматривать историю миграций, применять (upgrade) и откатывать (downgrade) миграции через визуальный интерфейс вместо CLI.

## Проблема

Разработчики, использующие Alembic для управления миграциями БД, вынуждены работать только через CLI:
- Нет визуализации истории миграций
- Неудобно отслеживать какие миграции применены
- Сложно быстро откатить изменения
- Нет UI для просмотра статуса миграций

## Решение

Visual Alembic UI предоставляет веб-интерфейс для:
1. **Просмотр истории** - timeline всех миграций с индикаторами статуса
2. **Apply миграций** - кнопка "Upgrade" с confirm dialog
3. **Rollback миграций** - кнопка "Downgrade" с confirm dialog
4. **Auto-refresh** - автоматическое обновление списка каждые 30 сек
5. **Error handling** - красивое отображение ошибок

## Архитектура

### Backend

**Endpoints**:
```
GET    /api/migrations/history        # Получить список всех миграций
POST   /api/migrations/upgrade         # Применить миграцию (до revision)
POST   /api/migrations/downgrade       # Откатить миграцию (до revision)
GET    /api/migrations/current         # Текущая примененная миграция
POST   /api/migrations/heads           # Получить head revisions
```

**Services**:
- `AlembicService` (backend/app/services/alembic_service.py:1) - Python wrapper над Alembic API

**Key Implementation**:
```python
# AlembicService использует Alembic Python API напрямую
from alembic import command
from alembic.config import Config

def get_history(self) -> List[MigrationInfo]:
    """Получает историю миграций через Alembic Script"""
    script = ScriptDirectory.from_config(self.config)
    revisions = list(script.walk_revisions())
    # ...
```

### Frontend

**Components**:
- `MigrationsPage` (frontend/src/components/MigrationsPage.tsx:1) - главный компонент (350+ строк)
- Timeline visualization с status indicators
- Confirm dialogs для upgrade/downgrade
- Error alerts

**State Management**:
```typescript
// Local state с useEffect для polling
const [migrations, setMigrations] = useState<Migration[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Auto-refresh каждые 30 секунд
useEffect(() => {
  const interval = setInterval(fetchMigrations, 30000);
  return () => clearInterval(interval);
}, []);
```

**Styling**:
- TailwindCSS для UI
- Dark theme по умолчанию
- Responsive design

### Database

Работает с существующей Alembic `alembic_version` таблицей:
```sql
CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);
```

## API Reference

### GET /api/migrations/history

**Описание**: Возвращает список всех миграций с их статусами

**Response**:
```typescript
{
  migrations: Array<{
    revision: string;        // e.g., "abc123"
    parent_revision: string | null;
    message: string;         // Description from migration file
    is_applied: boolean;     // Applied or not
    created_at: string;      // ISO timestamp
  }>
}
```

**Example**:
```bash
curl http://localhost:8000/api/migrations/history
```

### POST /api/migrations/upgrade

**Описание**: Применяет миграции до указанной revision (или до head)

**Request Body**:
```typescript
{
  revision?: string;  // Optional, defaults to "head"
}
```

**Response**:
```typescript
{
  status: "success" | "error";
  message: string;
}
```

**Example**:
```bash
curl -X POST http://localhost:8000/api/migrations/upgrade \
  -H "Content-Type: application/json" \
  -d '{"revision": "abc123"}'
```

### POST /api/migrations/downgrade

**Описание**: Откатывает миграции до указанной revision

**Request Body**:
```typescript
{
  revision: string;  // Required
}
```

**Response**:
```typescript
{
  status: "success" | "error";
  message: string;
}
```

## Примеры использования

### Пример 1: Просмотр всех миграций

1. Откройте http://localhost:3000/migrations
2. Увидите timeline со всеми миграциями
3. Зеленые галочки - applied, серые кружки - not applied

### Пример 2: Применить новую миграцию

1. На странице /migrations найдите не примененную миграцию
2. Нажмите кнопку "Upgrade to [revision]"
3. Подтвердите в confirm dialog
4. Миграция применится, страница обновится

### Пример 3: Откатить миграцию

1. Найдите примененную миграцию
2. Нажмите "Downgrade to [parent]"
3. Подтвердите откат
4. Миграция откатится

## Конфигурация

**Backend .env**:
```bash
# Database URL для Alembic
DATABASE_URL=postgresql://user:password@db:5432/dbname

# Путь к alembic.ini (опционально)
ALEMBIC_CONFIG_PATH=/app/alembic.ini
```

**Frontend .env**:
```bash
# Backend API URL
VITE_API_URL=http://localhost:8000
```

## Ограничения

1. **Одна база данных**: Пока работает только с одной БД за раз
2. **No concurrent migrations**: Нельзя применять несколько миграций одновременно
3. **No migration creation**: UI только для apply/rollback, не для создания новых миграций
4. **No SQL preview**: Не показывает какой SQL будет выполнен
5. **No migration dependencies**: Не показывает граф зависимостей между миграциями

## Известные проблемы

Пока нет известных багов в backlog.

## Технические детали

### Timeline Rendering

```typescript
// Сортировка миграций от новых к старым
const sortedMigrations = [...migrations].sort((a, b) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);

// Status indicator
{migration.is_applied ? (
  <CheckCircle className="w-6 h-6 text-green-500" />
) : (
  <Circle className="w-6 h-6 text-gray-500" />
)}
```

### Error Handling

```typescript
try {
  const response = await fetch('/api/migrations/upgrade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ revision }),
  });

  if (!response.ok) throw new Error('Upgrade failed');

  fetchMigrations(); // Refresh list
} catch (err) {
  setError(err.message);
}
```

## Связанные ресурсы

- **ADR**: ADR-0001 (Initial Architecture)
- **Git commit**: 130d0e5
- **Components**: MigrationsPage.tsx:1

## Changelog

- **v0.1.0** (2025-10-27):
  - Initial implementation
  - Timeline visualization
  - Upgrade/Downgrade buttons
  - Auto-refresh
  - Dark theme UI
