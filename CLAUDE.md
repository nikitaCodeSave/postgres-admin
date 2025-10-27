# PostgreSQL Admin Dashboard - Claude Code Configuration

> This file provides context about the project for Claude Code AI assistant.
> It's automatically loaded at the start of each coding session.

**Version**: v0.1.0 (POC → MVP)
**Last Updated**: 2025-10-27

---

## 📋 Quick Reference

### Essential Commands
```bash
# Start full stack
docker-compose up --build

# Backend local dev
cd backend && poetry run python -m app.main

# Frontend local dev
cd frontend && npm run dev

# Run tests
poetry run pytest          # Backend
npm test                   # Frontend (planned)

# Code quality
poetry run black . && poetry run ruff check .    # Backend
npm run lint                                       # Frontend
```

### Key Files
- **Backend Core**: `backend/app/services/alembic_service.py` (AlembicService ⭐)
- **Frontend Core**: `frontend/src/components/MigrationsPage.tsx` (Visual UI ⭐)
- **Documentation**: `docs/` (ADR, specs, backlog, dev-journal, architecture)
- **Commands**: `.claude/commands/` (10 slash commands)
- **Subagent**: `.claude/agents/postgres-python-expert.md`

### Slash Commands Quick List
- `/new-feature` - Plan feature → `/add-decision` - Document decision
- `/create-spec` - Document feature → `/log-change` - Update CHANGELOG
- `/log-dev` - Dev journal → `/review-docs` - Documentation review
- `/create-bug` - Report bug → `/create-improvement` - Propose improvement
- `/git-commit` - Conventional commit → `/create-release` - Prepare release

---

## 📦 Complete Project Context (via Imports)

### Project Information
@.claude/imports/project-info.md

### Technology Stack & Versions
@.claude/imports/tech-stack.md

### Development Commands
@.claude/imports/commands.md

### Code Style & Conventions
@.claude/imports/code-style.md

### Architecture & Design Patterns
@.claude/imports/architecture.md

### Development Workflow
@.claude/imports/workflow.md

---

## 🎯 Project-Specific Guidelines

### Core Innovation: AlembicService Pattern

This project's **killer feature** is the Visual Alembic UI - first GUI for Alembic in 14 years!

**Key Implementation** (`backend/app/services/alembic_service.py`):
```python
from alembic import command
from alembic.script import ScriptDirectory

class AlembicService:
    """Python API wrapper over Alembic CLI.

    This is the core innovation - exposes Alembic functionality
    programmatically for web integration.
    """
    def get_history(self) -> list[MigrationInfo]:
        # Use Alembic Python API, not CLI
        revisions = list(self.script.walk_revisions())
        # Return structured data for frontend
```

**Why this matters**:
- No subprocess calls to CLI
- Type-safe return values
- Proper error handling
- Testable without CLI

**When working with AlembicService**:
- Always use async wrappers for long operations
- Handle all Alembic exceptions properly
- Test with real Alembic config
- Document any new Alembic API patterns discovered

### Zero-Config Philosophy

**Principle**: Everything should "just work" with `docker-compose up`

**Implementation**:
- Sensible defaults in `app/config.py` (Pydantic Settings)
- Docker Compose handles all service orchestration
- No manual setup steps required
- `.env.example` provided for customization

**When adding new features**:
- Provide working defaults
- Make configuration optional
- Document env variables in `.env.example`
- Test with zero configuration

### Documentation-Driven Development

**Every feature follows this cycle**:
1. Planning: `/new-feature` → backlog spec
2. Architecture: `/add-decision` if significant
3. Implementation: Write code
4. Documentation: `/create-spec` + `/log-change` + `/log-dev`
5. Review: `/review-docs` periodically

**Never skip documentation steps!**

### Visual UI First

**Principle**: All database operations should be available through UI, not just CLI

**Current**:
- ✅ View migration history (UI)
- ✅ Apply migrations (UI)
- ✅ Rollback migrations (UI)

**Planned**:
- [ ] Database browser (UI)
- [ ] Query editor (UI)
- [ ] Schema visualization (UI)

**When adding features**: Always think "how would this look in UI?"

---

## 🛠️ Current Development Context

### Project Stage
- **POC Complete** (v0.1.0) - Visual Alembic UI working
- **MVP In Progress** (v0.2.0) - Adding Database Browser

### Active Work Areas
Check `docs/backlog/features/` for planned features
Check `docs/backlog/bugs/` for known issues
Check `docs/dev-journal/2025-10.md` for recent activity

### Technical Debt
- No tests yet (pytest/vitest planned for MVP)
- No authentication (local dev only)
- No rate limiting
- No error boundaries in React
- No logging infrastructure

### Known Limitations (POC)
- Single database support
- No concurrent migration execution
- No migration creation through UI (only apply/rollback)
- No SQL preview
- No migration dependency graph

---

## 🤖 Subagent Usage

### postgres-python-expert

**Invoke when**:
- Working with SQLAlchemy models
- Creating/modifying Alembic migrations
- Database schema design
- Query optimization
- PostgreSQL-specific features

**Usage**:
```
"Use postgres-python-expert subagent to help create SQLAlchemy model for..."
```

**Important**: Agent always searches web for latest versions and best practices first!

---

## 📚 Documentation System

### Structure
```
docs/
├── adr/                    # Architecture Decision Records
│   └── 0001-initial-architecture.md
├── specs/                  # Implemented features
│   └── 001-visual-alembic-ui.md
├── backlog/               # Planning
│   ├── features/          # Future features
│   ├── bugs/              # Known issues
│   └── improvements/      # Enhancement ideas
├── dev-journal/           # Development diary
│   └── 2025-10.md
├── architecture/          # System design
│   ├── system-overview.md
│   ├── database-schema.md
│   └── tech-stack.md
└── CHANGELOG.md           # Release history
```

### When to Document What

**ADR** (`/add-decision`):
- Framework choices (FastAPI vs Django)
- Architectural patterns (layered architecture)
- Technology decisions (PostgreSQL vs MongoDB)
- Design patterns (AlembicService pattern)

**Spec** (`/create-spec`):
- AFTER feature implementation
- Detailed API documentation
- Usage examples
- Known limitations

**CHANGELOG** (`/log-change`):
- After ANY user-facing change
- New features (Added)
- Bug fixes (Fixed)
- Breaking changes (with warning)

**Dev Journal** (`/log-dev`):
- End of work session
- Interesting problems solved
- Experiments and findings
- Learning notes

---

## ⚡ Performance Guidelines

### Backend
- Use async/await for all I/O operations
- Connection pooling: 5 pool_size, 10 max_overflow
- Cache expensive operations (Alembic config creation)
- Lazy load relationships in SQLAlchemy
- Pagination for large datasets (planned)

### Frontend
- React 18 automatic batching
- Lazy loading components (React.lazy + Suspense)
- Debounce user input (search, filters)
- Virtual scrolling for long lists (planned)
- Image optimization (planned)

---

## 🔒 Security Notes

### Current (POC - Local Only)
- ⚠️ No authentication
- ⚠️ No authorization
- ⚠️ CORS open for localhost
- ⚠️ No rate limiting
- ⚠️ No input sanitization beyond Pydantic

### Production Requirements (MVP+)
- [ ] JWT authentication
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting (slowapi)
- [ ] CORS whitelist only
- [ ] SQL injection prevention (SQLAlchemy ORM)
- [ ] XSS prevention (React escaping)
- [ ] HTTPS only
- [ ] Secrets management

**Never commit**:
- Passwords or API keys
- `.env` files with real credentials
- Database dumps with sensitive data

---

## 🎨 UI/UX Guidelines

### Design System
- **Dark theme by default** (developer tool)
- **TailwindCSS utility classes** (no custom CSS unless necessary)
- **Lucide React icons** (consistent icon set)
- **Responsive design** (mobile-friendly, but desktop-focused)

### Color Palette
```css
Primary: Blue (#3b82f6)
Success: Green (#10b981)
Warning: Yellow (#f59e0b)
Error: Red (#ef4444)
Background: Gray-900 (#111827)
Text: Gray-100 (#f3f4f6)
```

### Component Patterns
- Functional components only (no class components)
- Custom hooks for logic reuse
- Props interfaces for type safety
- Conditional classnames with clsx

---

## 🧪 Testing Philosophy (Planned)

### Backend Tests
```python
# Unit tests for services
tests/unit/test_alembic_service.py

# Integration tests for API
tests/integration/test_alembic_endpoints.py

# Run: poetry run pytest
```

### Frontend Tests
```typescript
// Component tests
components/__tests__/MigrationItem.test.tsx

// Hook tests
hooks/__tests__/useMigrations.test.ts

// Run: npm test
```

### Integration Tests
```bash
# Full stack with Docker
./scripts/run-integration-tests.sh
```

**Test Coverage Goals**:
- Services: 80%+
- API endpoints: 90%+
- Components: 70%+
- Critical paths: 100% (AlembicService, migrations API)

---

## 🚀 Deployment (Planned)

### Staging
- Docker Compose on cloud VM
- PostgreSQL managed service
- CI/CD via GitHub Actions
- Auto-deploy on push to main

### Production
- Kubernetes cluster (GKE/EKS/AKS)
- Managed PostgreSQL (RDS/Cloud SQL)
- CDN for frontend (Cloudflare)
- SSL/TLS termination
- Monitoring (Prometheus + Grafana)
- Logging (ELK Stack)

---

## 💡 Tips for Working on This Project

### Before Starting Work
1. `docker-compose up` - Start services
2. `/review-docs` - Check documentation status
3. Read relevant ADR/spec if working on existing feature
4. Check `docs/backlog/` for context

### While Working
- Services auto-reload (uvicorn --reload, Vite HMR)
- Use `/git-commit` for proper commit messages
- Document as you go (`/log-dev`)
- Test manually: http://localhost:3000

### Before Committing
1. Run tests: `poetry run pytest && npm test`
2. Format code: `poetry run black . && npm run lint`
3. Update docs: `/log-change`, `/log-dev`
4. Review: `/review-docs`
5. Commit: `/git-commit`

### When Stuck
- Check `docs/architecture/` for system overview
- Check `docs/specs/` for feature details
- Use postgres-python-expert subagent for DB questions
- Check dev journal for similar past issues
- Google with project context (FastAPI + SQLAlchemy + Alembic)

---

## 📞 Resources

### Internal Documentation
- Full architecture: `@docs/architecture/system-overview.md`
- Tech stack details: `@docs/architecture/tech-stack.md`
- Database schema: `@docs/architecture/database-schema.md`
- Commands reference: `.claude/commands/README.md`

### External Links
- FastAPI Docs: https://fastapi.tiangolo.com
- SQLAlchemy Docs: https://docs.sqlalchemy.org
- Alembic Docs: https://alembic.sqlalchemy.org
- React Docs: https://react.dev
- TailwindCSS Docs: https://tailwindcss.com

### Project Links
- README: `README.md`
- PRD (Russian): `PRD-ru.md`
- CHANGELOG: `docs/CHANGELOG.md`

---

**Remember**: This is a developer tool for developers. Focus on **developer experience**, **zero-config**, and **visual-first** design!

**Killer Feature**: Visual Alembic UI - First GUI for Alembic in 14 years! 🚀
