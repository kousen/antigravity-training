# Python Flask Project

## Project Overview
This is a Flask web application providing REST API services.

## Tech Stack
- **Runtime**: Python 3.11+
- **Framework**: Flask 2.x
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Testing**: pytest with pytest-cov
- **Linting**: ruff, mypy

## Project Structure
```
src/
├── app.py              # Flask application factory
├── config.py           # Configuration classes
├── models/             # SQLAlchemy models
├── routes/             # API route blueprints
├── services/           # Business logic
└── utils/              # Utility functions
tests/
├── conftest.py         # pytest fixtures
├── unit/               # Unit tests
└── integration/        # Integration tests
```

## Coding Standards

### General
- Follow PEP 8 style guide
- Use type hints for all function signatures
- Maximum line length: 88 characters (black default)
- Use f-strings for string formatting

### Documentation
- All public functions must have docstrings (Google style)
- Include type information in docstrings
- Document exceptions that may be raised

### Error Handling
- Use custom exception classes in `exceptions.py`
- Always log errors with proper context
- Return consistent error response format:
  ```python
  {"error": "message", "code": "ERROR_CODE", "details": {...}}
  ```

### Testing
- Aim for 80%+ code coverage
- Use fixtures for common setup
- Mock external services in unit tests
- Use factory_boy for test data

## API Conventions

### Endpoints
- Use plural nouns for resources: `/api/users`, `/api/tasks`
- Use HTTP methods correctly: GET, POST, PUT, PATCH, DELETE
- Version the API: `/api/v1/...`

### Responses
- Always return JSON
- Use appropriate HTTP status codes
- Include pagination for list endpoints

## Current Sprint
- Implementing user authentication with JWT
- Adding rate limiting middleware
- Setting up Redis caching

## Common Commands
```bash
# Run development server
flask run --debug

# Run tests
pytest -v --cov=src

# Run linting
ruff check src/ tests/
mypy src/

# Database migrations
flask db migrate -m "description"
flask db upgrade
```
