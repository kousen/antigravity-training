# Preferred Testing Patterns

- **Framework**: `pytest` is used for both unit and integration tests.
- **Dependency Isolation**: External HTTP calls (`requests.get`) must be mocked using `unittest.mock.patch` or `MagicMock` to ensure tests run offline and quickly.
- **Flask Test Client**: Use the `client` fixture to issue requests against endpoints and inspect JSON responses.
- **Test Coverage**: Maintain at least **80% code coverage** for the `app` codebase. Check coverage using:
  ```bash
  PYTHONPATH=. pytest --cov=app tests/
  ```
