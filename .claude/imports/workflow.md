# Development Workflow & Guidelines

## Git Workflow

### Branch Strategy
```
main (production-ready)
  ├── feature/database-browser
  ├── feature/query-editor
  ├── fix/migration-rollback
  └── docs/update-readme
```

**Branch naming**:
- `feature/` - new functionality
- `fix/` - bug fixes
- `docs/` - documentation updates
- `refactor/` - code refactoring
- `test/` - test additions

### Commit Conventions (Conventional Commits)

**Format**:
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**:
- `feat` - новая функциональность
- `fix` - исправление бага
- `docs` - изменения документации
- `style` - форматирование кода
- `refactor` - рефакторинг без изменения функциональности
- `perf` - улучшения производительности
- `test` - добавление тестов
- `chore` - изменения в build, зависимостях, tooling

**Scopes**: `backend`, `frontend`, `docs`, `docker`, `ci`

**Examples**:
```bash
feat(backend): add AlembicService for migration management

fix(frontend): resolve migration rollback button state

docs: update installation instructions in README

refactor(backend): extract validation logic to separate module

chore(deps): upgrade FastAPI to 0.119.1
```

**Use /git-commit command** для помощи с форматированием!

### Pull Request Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/database-browser
   ```

2. **Make changes and commit**
   ```bash
   git add .
   /git-commit  # Use Claude Code command
   ```

3. **Push branch**
   ```bash
   git push origin feature/database-browser
   ```

4. **Create PR** (use GitHub CLI or `/create-pr` command planned)
   ```bash
   gh pr create --title "feat(frontend): add database browser UI" \
     --body "Implements visual table browser with CRUD operations"
   ```

5. **Review and merge**
   - CI passes (tests, linting)
   - Code review approved
   - Squash and merge to main

## Development Cycle

### 1. Planning Phase

**For New Features**:
```bash
# 1. Create feature specification
/new-feature database-browser

# 2. Document architectural decisions (if significant)
/add-decision use-react-query-for-caching

# 3. Update backlog if needed
# Edit docs/backlog/features/P1-database-browser.md
```

**Output**:
- `docs/backlog/features/P1-feature-name.md`
- `docs/adr/NNNN-decision-name.md` (if architectural)

### 2. Development Phase

**Daily Workflow**:
```bash
# Start Docker services
docker-compose up

# Make code changes...
# Backend auto-reloads (uvicorn --reload)
# Frontend auto-reloads (Vite HMR)

# Test changes manually in browser
# http://localhost:3000

# Run automated tests (when available)
cd backend && poetry run pytest
cd frontend && npm test
```

**Code Quality Checks**:
```bash
# Backend
cd backend
poetry run black app/           # Format
poetry run ruff check app/      # Lint

# Frontend
cd frontend
npm run lint                    # ESLint
npx tsc --noEmit               # Type check
```

### 3. Documentation Phase

**After Completing Feature**:
```bash
# 1. Create detailed specification
/create-spec database-browser

# 2. Update CHANGELOG
/log-change

# 3. Write dev journal entry
/log-dev

# 4. Update README if needed (manually)
```

**Output**:
- `docs/specs/NNN-feature-name.md`
- Updated `docs/CHANGELOG.md`
- Entry in `docs/dev-journal/YYYY-MM.md`

### 4. Commit & Push

```bash
# Use conventional commit
/git-commit

# Or manually
git commit -m "feat(backend): add database browser API endpoints"

# Push
git push origin feature/database-browser
```

### 5. Review Phase

```bash
# Review documentation state
/review-docs

# Look for:
# - Missing specs for implemented features
# - Outdated ADRs
# - Incomplete CHANGELOG entries
# - Stale backlog items
```

## Bug Fix Workflow

### 1. Report Bug
```bash
/create-bug

# Fill in:
# - Severity: CRITICAL/HIGH/MEDIUM/LOW
# - Description
# - Steps to reproduce
# - Expected vs actual behavior
```

**Output**: `docs/backlog/bugs/SEVERITY-bug-description.md`

### 2. Fix Bug
```bash
# Create fix branch
git checkout -b fix/migration-rollback-error

# Make changes...

# Test fix
poetry run pytest tests/test_alembic_service.py
```

### 3. Document Fix
```bash
# Update CHANGELOG
/log-change
# Type: Fixed

# Log in dev journal
/log-dev

# Commit
/git-commit
# Type: fix
```

### 4. Close Bug Report
- Move bug file to `docs/backlog/bugs/closed/` OR
- Delete file and reference in commit message

## Improvement Workflow

### 1. Propose Improvement
```bash
/create-improvement

# Fill in:
# - Area: ui/backend/devops/docs/performance/security
# - Current state
# - Proposed improvement
# - Why it matters
```

**Output**: `docs/backlog/improvements/area-improvement-name.md`

### 2. Implement
Similar to feature development

### 3. Document
```bash
/log-change  # Type: Changed
/log-dev
/git-commit  # Type: refactor or perf
```

## Release Workflow

### Preparing Release

```bash
# 1. Review all changes
/review-docs

# 2. Ensure everything documented
# Check:
# - All features have specs
# - CHANGELOG complete
# - No pending "in progress" items

# 3. Create release
/create-release v0.2.0

# This will:
# - Move [Unreleased] → [0.2.0] in CHANGELOG
# - Create git tag
# - Push to remote
```

### Version Numbering (Semantic Versioning)

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (0.2.0) - New features, backward compatible
- **PATCH** (0.1.1) - Bug fixes, backward compatible

**Pre-release**: `0.2.0-alpha.1`, `0.2.0-beta.1`, `0.2.0-rc.1`

## Testing Strategy

### Current (POC)
- ⚠️ Manual testing only
- ⚠️ No automated tests yet

### Planned (MVP)

**Backend Tests** (pytest):
```bash
cd backend

# Run all tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app --cov-report=html

# Run specific test
poetry run pytest tests/test_alembic_service.py -v
```

**Frontend Tests** (Vitest):
```bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Integration Tests**:
```bash
# Full stack test with Docker
docker-compose up -d
./scripts/run-integration-tests.sh
docker-compose down
```

## Code Review Guidelines

### Reviewer Checklist

**Code Quality**:
- [ ] Follows project code style
- [ ] Type hints/types added
- [ ] No unused imports
- [ ] No console.log/print statements
- [ ] Error handling present

**Functionality**:
- [ ] Solves the stated problem
- [ ] Edge cases handled
- [ ] No obvious bugs
- [ ] Performance acceptable

**Testing**:
- [ ] Tests added for new functionality
- [ ] Tests pass
- [ ] Manual testing done

**Documentation**:
- [ ] CHANGELOG updated (`/log-change`)
- [ ] ADR created if architectural (`/add-decision`)
- [ ] Spec created if feature (`/create-spec`)
- [ ] Code comments explain WHY

**Git**:
- [ ] Commit message follows conventions
- [ ] PR description clear
- [ ] Branch name appropriate

### Author Checklist (Before Creating PR)

```bash
# 1. Self-review code
git diff main...feature/my-feature

# 2. Run tests
poetry run pytest && npm test

# 3. Check code quality
poetry run black . && poetry run ruff check .
npm run lint

# 4. Update documentation
/log-change
/log-dev
/review-docs  # Check completeness

# 5. Commit with good message
/git-commit

# 6. Push and create PR
git push origin feature/my-feature
gh pr create --fill
```

## CI/CD (Planned)

### GitHub Actions Workflow

**On Push to feature branches**:
- Lint code (Black, Ruff, ESLint)
- Type check (mypy, tsc)
- Run tests (pytest, vitest)
- Build Docker images (test)

**On PR to main**:
- All above checks
- Integration tests
- Deploy preview (planned)

**On Push to main**:
- All above checks
- Build production Docker images
- Tag with version
- Deploy to staging (planned)

**On Release Tag**:
- Build production images
- Push to Docker Hub
- Create GitHub Release
- Deploy to production (planned)

## Slash Commands Quick Reference

### Planning
- `/new-feature [name]` - Plan new feature
- `/add-decision` - Document architectural decision

### Development
- `/git-commit` - Create conventional commit
- `/create-bug` - Report bug
- `/create-improvement` - Propose improvement

### Documentation
- `/create-spec [name]` - Document implemented feature
- `/log-change` - Update CHANGELOG
- `/log-dev` - Dev journal entry
- `/review-docs` - Documentation health check

### Release
- `/create-release [version]` - Prepare release

## Subagents Usage

### postgres-python-expert

**When to use**:
- Working with SQLAlchemy models
- Creating/modifying Alembic migrations
- Database query optimization
- PostgreSQL-specific features
- asyncpg configuration

**How to invoke** (through Claude Code):
```
"Use postgres-python-expert subagent to create SQLAlchemy model for..."
```

**Agent always starts with web search** for latest versions and best practices!

## Best Practices Summary

✅ **DO**:
- Use Docker for development
- Follow conventional commits
- Document architectural decisions (ADR)
- Update CHANGELOG for all changes
- Write dev journal entries
- Run tests before committing
- Type everything (Python + TypeScript)
- Use slash commands for consistency

❌ **DON'T**:
- Commit directly to main
- Skip documentation
- Leave console.log/print in code
- Hardcode configuration
- Write generic commit messages
- Duplicate code
- Ignore linting errors
- Merge untested code

## Communication

### Issues
- Use GitHub Issues for bug reports
- Label appropriately (bug, feature, documentation)
- Reference in commits (`Fixes #123`)

### Discussions
- Use GitHub Discussions for questions
- Slack/Discord для quick questions (if available)

### Documentation
- Primary source: `docs/` folder
- Secondary: Code comments
- Tertiary: Git commit messages
