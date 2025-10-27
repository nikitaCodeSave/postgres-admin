# Multi-stage build for Python backend
FROM python:3.12-slim AS builder

WORKDIR /build

# Install poetry
RUN pip install poetry==2.2.1

# Copy dependency files
COPY pyproject.toml ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --only main --no-interaction --no-ansi --no-root

# Final stage
FROM python:3.12-slim

WORKDIR /code

# Install dependencies from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY ./app /code/app

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
