# Database Schema

**Версия**: v0.1.0
**Последнее обновление**: 2025-10-27

## Overview

PostgreSQL 17 database используется для:
1. User application tables (определяются в SQLAlchemy models)
2. Alembic version tracking (alembic_version table)

## Core Tables

### alembic_version

**Назначение**: Tracking applied migrations

**Создается**: Alembic автоматически при первой миграции

```sql
CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);
```

**Описание полей**:
- `version_num` - Revision hash текущей примененной миграции

**Примеры данных**:
```sql
-- No migrations applied
SELECT * FROM alembic_version;
-- (empty)

-- After first migration
SELECT * FROM alembic_version;
-- version_num
-- -------------
-- abc123def456
```

## Example Project Tables

### users

**Назначение**: Demo table for example project

**SQLAlchemy Model**: `backend/example_project/models/user.py`

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

**Миграция**: `alembic/versions/001_create_users_table.py`

### posts

**Назначение**: Demo table for example project (has foreign key to users)

**SQLAlchemy Model**: `backend/example_project/models/post.py`

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_is_published ON posts(is_published);
```

**Миграция**: `alembic/versions/002_create_posts_table.py`

## Relationships

```
users (1) ──< (N) posts
  id              user_id
```

**Constraints**:
- posts.user_id → users.id (CASCADE DELETE)

## Indexes

### Performance Indexes

```sql
-- User lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Post queries
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_is_published ON posts(is_published);
```

## Database Configuration

### Connection String

```bash
# Development
DATABASE_URL=postgresql://pguser:pgpass@localhost:5432/pgadmin

# Docker Compose
DATABASE_URL=postgresql://pguser:pgpass@db:5432/pgadmin
```

### Connection Pool (SQLAlchemy)

```python
# backend/app/config.py
from sqlalchemy import create_engine

engine = create_engine(
    DATABASE_URL,
    pool_size=5,          # Default connections
    max_overflow=10,      # Additional connections
    pool_timeout=30,      # Timeout for getting connection
    pool_recycle=3600,    # Recycle connections after 1 hour
)
```

## Migrations

### Alembic Configuration

**Config file**: `backend/alembic.ini`

```ini
[alembic]
script_location = alembic
sqlalchemy.url = postgresql://pguser:pgpass@db:5432/pgadmin

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic
```

### Migration File Structure

```
backend/alembic/versions/
├── 001_abc123_create_users_table.py
├── 002_def456_create_posts_table.py
└── ...
```

### Example Migration

```python
"""create users table

Revision ID: abc123
Revises:
Create Date: 2025-10-27 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'abc123'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(50), nullable=False),
        sa.Column('email', sa.String(100), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_users_username', 'users', ['username'])
    op.create_index('idx_users_email', 'users', ['email'])

def downgrade() -> None:
    op.drop_index('idx_users_email', 'users')
    op.drop_index('idx_users_username', 'users')
    op.drop_table('users')
```

## Common Queries

### Check current migration

```sql
SELECT version_num FROM alembic_version;
```

### List all tables

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public';
```

### Get table size

```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check indexes

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public';
```

## Database Backups

### Backup command

```bash
docker-compose exec db pg_dump -U pguser pgadmin > backup.sql
```

### Restore command

```bash
docker-compose exec -T db psql -U pguser pgadmin < backup.sql
```

## Future Schema Extensions

### Planned tables

1. **migrations_log** - история выполнения миграций
   - id, revision, action (upgrade/downgrade), timestamp, user, status

2. **query_history** - история SQL запросов через Query Editor
   - id, query, execution_time, user, timestamp, status

3. **users** (admin dashboard users, не demo table)
   - id, username, email, password_hash, role, created_at

4. **api_keys** - API ключи для programmatic access
   - id, key_hash, name, user_id, created_at, expires_at, last_used

## Performance Considerations

### Current bottlenecks
- No query optimization yet
- No read replicas
- Single database instance

### Planned optimizations
1. **Indexes**: Add covering indexes for frequent queries
2. **Partitioning**: For large tables (logs)
3. **Caching**: Redis for frequently accessed data
4. **Connection pooling**: PgBouncer
5. **Read replicas**: For reporting queries

## Security

### Current
- Password authentication
- Docker network isolation
- No external access by default

### Planned
- SSL/TLS connections
- Row-level security (RLS)
- Encrypted backups
- Audit logging
- Database firewall rules

## Monitoring

### Key metrics to track
- Connection pool usage
- Query execution time
- Table sizes growth
- Index usage statistics
- Cache hit ratio

### Queries for monitoring

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Long-running queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '5 minutes';

-- Table bloat
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Related Documents

- **System Overview**: `/docs/architecture/system-overview.md`
- **Tech Stack**: `/docs/architecture/tech-stack.md`
- **ADR-0001**: Initial Architecture
