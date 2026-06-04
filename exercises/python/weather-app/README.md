# Weather API Modernization Exercise

This is a small Flask weather API used as a realistic Antigravity CLI exercise.
It is intentionally more interesting than a blank starter project: routes,
service logic, external API integration, Swagger documentation, and tests are
already present, but there are still useful places to audit, refactor, document,
and improve.

Use this project as a "messy existing service" lab. The goal is not to generate
an app from scratch; the goal is to practice using Antigravity CLI to understand
an existing codebase, reconcile behavior with documentation, improve tests, and
make targeted changes.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Install developer tooling when working on tests, coverage, or browser checks:

```bash
pip install -r requirements-dev.txt
```

Run the unit and integration tests:

```bash
pytest tests/test_weather.py tests/test_weather_integration.py
```

Run the browser-based Playwright tests:

```bash
pytest tests/e2e --browser chromium
```

The e2e tests start the Flask app on `http://127.0.0.1:5050` automatically.

## API Endpoints

- `GET /` - API documentation
- `GET /cities` - List available cities
- `GET /weather/<city_id>` - Get current weather
- `GET /forecast/<city_id>` - Get 5-day forecast

Without an `OPENWEATHERMAP_API_KEY`, the app serves deterministic simulated
weather for known cities only:

- `london`
- `new_york`
- `paris`
- `sydney`
- `tokyo`

Unknown cities return `404` unless the real OpenWeatherMap geocoding API can
resolve them.

## Exercise Goals

Use Antigravity CLI to:
1. Explore and understand the codebase
2. Compare API behavior, tests, Swagger docs, and README claims
3. Refactor the service layer without changing public API behavior
4. Improve error handling around external API calls
5. Extend test coverage for edge cases and deterministic simulated data
6. Update API documentation and architecture notes
7. Add caching for repeated weather and forecast lookups
8. Extend the browser/e2e tests and keep their server fixture reliable

## Suggested Antigravity Prompts

```text
Audit this Flask API. Compare the README, route docs, tests, and implementation.
List inconsistencies before changing anything.
```

```text
Refactor @app/services/weather_service.py for readability and testability.
Keep the current endpoint behavior and update tests if needed.
```

```text
Add a small in-memory cache for weather and forecast results.
Include tests that prove cache hits do not call the external API twice.
```

```text
Review @tests/e2e and improve the browser coverage.
Keep the Flask server fixture reliable and avoid tests that depend on JSON formatting.
```
