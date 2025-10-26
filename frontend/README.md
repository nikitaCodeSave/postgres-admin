# PostgreSQL Admin Dashboard - Frontend

React + TypeScript фронтенд с **Visual Alembic UI** - первый в мире GUI для Alembic миграций.

## Технологический стек

- **React 18** - UI библиотека
- **TypeScript** - Type safety
- **Vite** - Build tool (быстрый dev server)
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Установка

```bash
cd frontend
npm install
```

или с pnpm:

```bash
pnpm install
```

## Запуск

### Development режим

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

API proxy настроен автоматически (все `/api/*` запросы идут на `http://localhost:8000`).

### Production build

```bash
npm run build
npm run preview
```

## Структура проекта

```
frontend/
├── src/
│   ├── components/
│   │   └── MigrationsPage.tsx    # Killer Feature: Visual Alembic UI
│   ├── services/
│   │   └── api.ts                # Backend API client
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # TailwindCSS + custom styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Фичи POC

### ✅ Visual Alembic UI (Killer Feature)

- 📊 **Migration Timeline** - визуальная история всех миграций
- 🎯 **Current Revision** - индикатор текущей версии БД
- ⏳ **Pending Migrations** - показывает неприменённые миграции
- 🚀 **Apply Button** - применить pending миграции одной кнопкой
- ↩️ **Rollback Button** - откатить последнюю миграцию
- 🔄 **Auto-Refresh** - обновление статуса
- 📱 **Responsive Design** - работает на всех устройствах

### 🎨 UI/UX

- **Dark Theme** - тёмная тема по умолчанию (удобно для разработчиков)
- **Modern Design** - TailwindCSS компоненты
- **Status Badges** - наглядная индикация статусов
- **Icons** - Lucide React для красивых иконок
- **Loading States** - индикаторы загрузки
- **Error Handling** - понятные сообщения об ошибках

## API Integration

Фронтенд взаимодействует с backend через REST API:

```typescript
// Получить список миграций
GET /api/alembic/migrations

// Получить статус
GET /api/alembic/status

// Применить pending миграции
POST /api/alembic/upgrade

// Откатить одну миграцию
POST /api/alembic/downgrade
```

## Development

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

Build файлы будут в директории `dist/`.

## Docker

```bash
docker build -t postgresql-admin-frontend:latest .
docker run -p 3000:3000 postgresql-admin-frontend:latest
```

## Лицензия

MIT
