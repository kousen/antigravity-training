# Gemini Context: Weather App

## 🧠 Project Intelligence
This document contains internal developer context, architectural decisions, and testing strategies. It is designed to assist AI agents and developers in modifying the codebase without breaking existing conventions.

## 🏗 Architecture & Design Patterns

### Modular Design
The application uses the **Flask Application Factory** pattern (`create_app` in `app/__init__.py`) to support easy testing and configuration changes. Routes are organized into **Blueprints**:
*   `main_bp` (`app/routes/main.py`): System-level routes (e.g., API docs).
*   `weather_bp` (`app/routes/weather.py`): Domain-specific routes for weather data.

### Data Retrieval Strategy (Hybrid)
The service layer (`app/services/weather_service.py`) implements a robust hybrid strategy handled by `get_weather_data(city_name)`:
1.  **Check Configuration:** Inspects `os.environ.get("OPENWEATHERMAP_API_KEY")`.
2.  **Primary Path (API):** If the key exists, calls `_fetch_real_weather(city_name)`.
    *   Uses **Geocoding API** to convert city names to coords.
    *   Uses **One Call API 3.0** for weather data.
3.  **Fallback Path (Simulation):** If the key is missing OR the API call fails (network/auth error), it calls `_generate_simulated_weather`.
    *   *Note:* This ensures the app is always runnable, even offline.

## 📂 Key File Responsibilities

| File Path | Responsibility |
| :--- | :--- |
| `app.py` | **Entry Point:** Runs the Flask server. Do not add logic here. |
| `app/__init__.py` | **Factory:** Initializes Flask, Swagger, and registers Blueprints. |
| `app/routes/weather.py` | **Controller:** Handles HTTP requests, validation, and responses. Delegates logic to `weather_service`. |
| `app/services/weather_service.py` | **Service/Logic:** Contains ALL business logic, API calls, and data transformation. |
| `tests/test_weather.py` | **Functional Tests:** Tests the API endpoints using `client.get()`. Assumes default (simulated) behavior. |
| `tests/test_weather_integration.py` | **Integration Tests:** Mocks `requests` to test the *Real Data* path without hitting external APIs. |

## 🧪 Testing Strategy

The project uses `pytest` with two distinct approaches:

### 1. Functional Testing (`test_weather.py`)
*   **Goal:** Verify HTTP contract (Status codes, JSON structure).
*   **Mechanism:** Uses Flask's `test_client`.
*   **Data:** Relies on the **simulated** data path (default behavior when no API key is mocked).

### 2. Integration/Mock Testing (`test_weather_integration.py`)
*   **Goal:** Verify the **API integration logic** in `weather_service.py`.
*   **Mechanism:** Uses `unittest.mock.patch` to simulate `requests.get`.
*   **Critical:** Mocks both the *Geocoding API* response AND the *One Call API* response to verify correct data parsing.

## 🤝 Team Standards & Practices

### Coding Standards
*   **Style:** Strict adherence to **PEP 8** for all Python code.
*   **Formatting:** Use `black` for code formatting and `isort` for import sorting.
*   **Type Hinting:** Use Python type hints (e.g., `def func(name: str) -> bool:`) for all function signatures.
*   **Docstrings:** All public functions and classes must have docstrings (Google or NumPy style). Route functions must use **Flasgger** style docstrings for Swagger generation.

### Preferred Testing Frameworks
*   **Runner:** `pytest` is the primary test runner.
*   **Mocking:** `unittest.mock` (standard library) or `pytest-mock` fixture.
*   **Pattern:** Follow the **Arrange-Act-Assert** pattern in all tests.
*   **Coverage:** Aim for >80% code coverage, especially in the service layer.

### Current Sprint Focus: Caching
The immediate goal is to implement **caching** to reduce external API calls and improve performance.
*   **Strategy:** Cache weather data for 10 minutes (TTL).
*   **Key Files:** `app/services/weather_service.py` (implementation).
*   **Considerations:** Cache invalidation strategies and handling API failures gracefully.

### Code Review Checklist
1.  [ ] **PEP 8 Compliance:** Is the code formatted correctly?
2.  [ ] **Type Hints:** Are arguments and return values typed?
3.  [ ] **Tests:** Are there unit tests for new logic? Do they pass?
4.  [ ] **Error Handling:** Are exceptions caught and handled (e.g., API timeouts)?
5.  [ ] **Documentation:** Are Swagger docstrings updated for modified routes?
6.  [ ] **Security:** No hardcoded API keys or secrets.

## 🛠 Development Conventions
*   **Docstrings:** maintain `flasgger` style docstrings in route functions to keep Swagger UI (`/`) in sync.
*   **Imports:** Absolute imports (e.g., `from app.services import...`) are preferred over relative imports.
*   **Environment:** use `os.environ` for config. Do not hardcode keys.
*   **Error Handling:** Service functions return `None` on failure; Routes convert `None` to `404` responses.

## 🚀 Common Tasks
*   **Add a new endpoint:**
    1.  Define logic in `app/services/weather_service.py`.
    2.  Create route in `app/routes/weather.py`.
    3.  Add Swagger docstring.
    4.  Add test case in `tests/test_weather.py`.
*   **Run w/ Real Data:** `export OPENWEATHERMAP_API_KEY=... && python app.py`
