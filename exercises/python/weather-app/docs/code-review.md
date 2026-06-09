# Code Review Checklist

Before opening a PR or merging code, verify the following:
- [ ] **Simulated Fallback**: Verify that the code handles missing/invalid API keys gracefully by falling back to the simulated weather data generator.
- [ ] **API Documentation**: Ensure that Swagger UI (Flasgger) YAML documentation in route docstrings accurately matches the implementation.
- [ ] **Cache Management**: Verify cache keys are cleared or invalidated if data changes.
- [ ] **Secret Management**: Ensure there are no hardcoded API keys or secrets in the codebase; all configuration should load from environment variables or `app.config`.
- [ ] **Tests**: Ensure tests exist for the modified functionality and cover the code adequately.
