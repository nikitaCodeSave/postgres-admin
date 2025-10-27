# Development Commands Reference

## Docker Commands (Primary Method)

### Full Stack
```bash
# Start all services (recommended)
docker-compose up --build

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose up --build backend
docker-compose up --build frontend
```

### Access Services
```bash
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs (Swagger): http://localhost:8000/docs
# PostgreSQL: localhost:5432
```

## Backend Commands (Local Development)

### Setup
```bash
cd backend

# Install dependencies
poetry install

# Activate virtual environment
poetry shell
```

### Run Server
```bash
# Development server with hot reload
poetry run python -m app.main

# Or with uvicorn directly
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Run all tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app --cov-report=html

# Run specific test file
poetry run pytest tests/test_alembic_service.py

# Run with verbose output
poetry run pytest -v
```

### Code Quality
```bash
# Format code (Black)
poetry run black app/

# Lint code (Ruff)
poetry run ruff check app/

# Auto-fix linting issues
poetry run ruff check --fix app/

# Type checking (when added)
poetry run mypy app/
```

### Database Migrations
```bash
# Go to example project
cd ../example_project

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current revision
alembic current

# Show migration history
alembic history --verbose
```

## Frontend Commands (Local Development)

### Setup
```bash
cd frontend

# Install dependencies
npm install

# Or with specific registry
npm install --registry=https://registry.npmjs.org/
```

### Run Dev Server
```bash
# Development server with HMR
npm run dev

# Opens at http://localhost:3000
```

### Build
```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Code Quality
```bash
# Lint TypeScript/React
npm run lint

# Fix auto-fixable issues
npm run lint --fix

# Type check
npx tsc --noEmit
```

### Testing (Planned)
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Database Commands

### PostgreSQL CLI Access
```bash
# Via Docker
docker-compose exec db psql -U pguser -d pgadmin

# Useful psql commands:
# \dt        - list tables
# \d table   - describe table
# \l         - list databases
# \q         - quit
```

### Database Operations
```bash
# Backup database
docker-compose exec db pg_dump -U pguser pgadmin > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U pguser pgadmin

# Drop and recreate database (DANGER!)
docker-compose down -v
docker-compose up -d db
```

## Git Commands (Conventional Commits)

### Common Operations
```bash
# Stage changes
git add .

# Commit (use /git-commit command for help)
git commit -m "feat(backend): add new endpoint"

# Push
git push origin main

# Create branch
git checkout -b feature/new-feature

# View status
git status

# View diff
git diff
git diff --staged
```

### Conventional Commit Format
```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

## Documentation Commands

### Slash Commands (via Claude Code)
```bash
/new-feature        # Plan new feature in backlog
/add-decision       # Create ADR for architectural decision
/create-spec        # Document implemented feature
/log-change         # Update CHANGELOG.md
/log-dev           # Add dev journal entry
/create-bug        # Report a bug
/create-improvement # Propose improvement
/git-commit        # Create conventional commit
/create-release    # Prepare new release
/review-docs       # Review documentation status
```

## Monitoring & Debugging

### Logs
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Health Checks
```bash
# Backend health
curl http://localhost:8000/api/alembic/health

# Check migrations
curl http://localhost:8000/api/alembic/status
```

### Container Debugging
```bash
# Execute command in container
docker-compose exec backend bash
docker-compose exec frontend sh

# Inspect container
docker-compose ps
docker inspect <container_id>

# Resource usage
docker stats
```

## Useful Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
# Docker Compose shortcuts
alias dcu="docker-compose up"
alias dcub="docker-compose up --build"
alias dcd="docker-compose down"
alias dcl="docker-compose logs -f"
alias dcr="docker-compose restart"

# Poetry shortcuts
alias pi="poetry install"
alias pr="poetry run"
alias pt="poetry run pytest"
alias pb="poetry run black ."

# npm shortcuts
alias ni="npm install"
alias nd="npm run dev"
alias nb="npm run build"
alias nt="npm test"
```

## Quick Start Commands

### First Time Setup
```bash
# 1. Clone and enter project
git clone <repo-url>
cd Postgresql

# 2. Start everything
docker-compose up --build

# 3. Open in browser
# http://localhost:3000
```

### Daily Development
```bash
# Start services
docker-compose up

# Make changes to code...

# Services auto-reload!
# Backend: uvicorn --reload
# Frontend: Vite HMR
```

### Before Committing
```bash
# 1. Run tests
cd backend && poetry run pytest
cd frontend && npm test

# 2. Format & lint
cd backend && poetry run black . && poetry run ruff check .
cd frontend && npm run lint

# 3. Update documentation
/log-change
/log-dev

# 4. Commit
/git-commit
```
