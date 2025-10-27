# Backlog - PostgreSQL Admin Dashboard

Этот backlog содержит планы по развитию проекта.

## Структура

### /features
Спецификации будущих фич - новая функциональность, которую планируется добавить.

**Формат файлов**: `[priority]-[short-name].md`
- `priority`: P0 (критично), P1 (высокий), P2 (средний), P3 (низкий)
- `short-name`: краткое название фичи

**Пример**: `P1-database-browser.md`

### /bugs
Описания найденных багов - проблемы, которые нужно исправить.

**Формат файлов**: `[severity]-[short-description].md`
- `severity`: CRITICAL, HIGH, MEDIUM, LOW
- `short-description`: краткое описание бага

**Пример**: `HIGH-migration-rollback-error.md`

### /improvements
Идеи по улучшению существующей функциональности - не новые фичи, а улучшение того что есть.

**Формат файлов**: `[area]-[improvement-name].md`
- `area`: ui, backend, devops, docs, performance
- `improvement-name`: название улучшения

**Пример**: `ui-dark-theme-polish.md`

## Workflow

1. **Новая идея/баг** → создаем файл в соответствующей папке
2. **Работа начата** → добавляем метку `Status: In Progress` в файл
3. **Реализовано** → перемещаем в `/docs/specs` с полной спецификацией
4. **Отменено** → добавляем метку `Status: Cancelled` и причину

## Шаблоны

Используйте шаблоны из `/docs/backlog/templates/`:
- `feature-template.md` - для новых фич
- `bug-template.md` - для багов
- `improvement-template.md` - для улучшений
