---
description: Провести обзор текущего состояния документации проекта
allowed-tools: Bash(ls:*), Bash(date:*), Bash(wc:*), Read, Glob, Grep
---

Помогаю провести comprehensive обзор состояния документации проекта.

## Текущая дата

!`date +%Y-%m-%d`

## Задача

Предоставить полный обзор документации проекта, проанализировав:

### 1. Architecture Decision Records (ADR)

**Все ADR**:
!`ls -1 docs/adr/*.md | grep -E '[0-9]{4}'`

Для каждого ADR прочитать и показать:
- Номер и название
- Статус (proposed/accepted/deprecated)
- Выделить те, что требуют review (status: proposed)

### 2. Backlog Status

**Features**:
!`ls -1 docs/backlog/features/*.md 2>/dev/null | grep -v template | wc -l` фич

**Bugs**:
!`ls -1 docs/backlog/bugs/*.md 2>/dev/null | grep -v template | wc -l` багов

**Improvements**:
!`ls -1 docs/backlog/improvements/*.md 2>/dev/null | grep -v template | wc -l` улучшений

Проверить и отрапортовать:
- Сколько features planned? Есть ли in progress?
- Сколько bugs open?
- Сколько improvements proposed?

### 3. Implemented Specs

**Все спеки**:
!`ls -1 docs/specs/*.md 2>/dev/null | grep -E '[0-9]{3}' || echo "Нет спек"`

Для каждой спеки показать:
- Номер и название
- Статус (Active/Deprecated)

### 4. Recent Development Activity

**Текущий месяц**: !`date +%Y-%m`.md

Прочитать последние записи из dev journal текущего месяца.
Суммаризировать:
- Над чем работали
- Какие находки
- Какие проблемы решены

### 5. CHANGELOG Status

@docs/CHANGELOG.md

Отрапортовать:
- Текущая версия
- Количество items в [Unreleased]
- Дата последнего релиза

### 6. Documentation Health Check

Выявить пробелы и проблемы:
- Отсутствующие секции в README
- Устаревшая архитектурная документация
- Specs без соответствующих ADR
- Features в backlog без specs после реализации
- ADR со статусом "proposed" слишком долго
- Dev journal entries старше 2 месяцев без архивации

## Формат вывода

Предоставить структурированный отчет:

```markdown
# 📊 Documentation Review - YYYY-MM-DD

## 📋 ADRs (X total)
- **ADR-0001**: Initial Architecture [✅ accepted]
- **ADR-0002**: Use React Query [⏳ proposed] ← требует review
- ...

## 🎯 Backlog Summary
- **Features**: X planned, Y in progress, Z blocked
- **Bugs**: X open (breakdown: CRITICAL: X, HIGH: Y, MEDIUM: Z, LOW: W)
- **Improvements**: X proposed

### Top Priority Items
1. [P0] Feature XYZ
2. [CRITICAL] Bug ABC
3. ...

## ✅ Implemented Specs (X total)
- **Spec-001**: Visual Alembic UI [🟢 Active]
- **Spec-002**: Database Browser [🟢 Active]
- ...

## 📝 Recent Development Activity

### Highlights from YYYY-MM
- Реализована фича XYZ
- Исправлен баг ABC
- Эксперимент с технологией DEF
- Key learnings: ...

### Productivity Metrics
- Commits: X
- Features completed: Y
- Bugs fixed: Z

## 📦 CHANGELOG
- **Current version**: v0.1.0
- **Unreleased items**: X (Added: Y, Changed: Z, Fixed: W)
- **Last release**: YYYY-MM-DD

## ⚠️ Action Items

### 🔴 High Priority
1. Завершить ADR-000X (в статусе proposed больше недели)
2. Создать spec для реализованной фичи XYZ
3. Обновить architecture docs (последнее обновление месяц назад)

### 🟡 Medium Priority
1. Переместить завершенные features из backlog в specs
2. Закрыть устаревшие bugs
3. Обновить примеры в документации

### 🟢 Low Priority
1. Добавить больше примеров в ADR
2. Создать диаграммы для architecture docs
3. Архивировать старые dev journal entries

## 📈 Documentation Quality Score

- ADR coverage: X/Y decisions documented (Z%)
- Spec coverage: X/Y features documented (Z%)
- Backlog health: X items stale > 30 days
- CHANGELOG up-to-date: ✅/❌

**Overall**: 🟢 Excellent | 🟡 Good | 🔴 Needs Attention

## 💡 Recommendations
1. ...
2. ...
3. ...
```

## Важные принципы

- 📊 Быть thorough но concise
- 🎯 Выделять actionable items
- ⚠️ Отмечать несоответствия между разными docs
- 💡 Предлагать улучшения если есть пробелы
- 📈 Давать метрики где возможно
- 🔍 Проверять актуальность информации
