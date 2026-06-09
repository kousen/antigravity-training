# Agent Guide: Weather App

This document serves as an entrypoint for AI agents and developers to understand the purpose, architecture, tech stack, and execution steps for the **Weather App** project.

---

## 1. Project Purpose

The **Weather App** is a RESTful API designed to fetch and display weather information and forecasts for configured cities. It is utilized as a training environment for developing and assessing Gemini CLI agents. 

The application is built with resilience in mind: if an OpenWeatherMap API key is missing or the external API call fails, the application falls back gracefully to a Simulated Data Generator to mock weather conditions.

---

## 2. Tech Stack

- **Language**: Python 3.x
- **Framework**: Flask (Utilizing the Application Factory Pattern and Blueprints)
- **API Documentation**: Flasgger (Swagger UI)
- **HTTP Client**: Requests (For interfacing with OpenWeatherMap APIs)
- **Caching**: Flask-Caching (`SimpleCache` defaults to 5 minutes)
- **Configuration**: python-dotenv (To manage environment variables)
- **Testing**: pytest (Including integration and unit tests using `unittest.mock`)

---

## 3. Directory Structure

- [app.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app.py): Entrypoint to run the Flask development server.
- [app/](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/): Application source code.
  - [__init__.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/__init__.py): Application Factory initializing Cache, Swagger, blueprints, and global error handlers.
  - [config.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/config.py): Configuration loading and external API endpoint definitions.
  - [exceptions.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/exceptions.py): Custom application exceptions (`WeatherAppError`, `CityNotFoundError`, `ExternalAPIError`).
  - [routes/](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/routes/):
    - [main.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/routes/main.py): Swagger-documented blueprint for API index and metadata.
    - [weather.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/routes/weather.py): Blueprints for weather-related API endpoints.
    - [errors.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/routes/errors.py): Global HTTP and custom exception handlers.
  - [services/](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/services/):
    - [weather_service.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/app/services/weather_service.py): Business logic, geocoding logic, external OneCall API requests, caching wrappers, and fallback simulated data generator.
- [tests/](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/tests/): Test suite containing:
  - [test_weather.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/tests/test_weather.py): Unit tests asserting basic routing and fallback functionality.
  - [test_weather_integration.py](file:///Users/kennethkousen/Documents/OReilly/gemini-training/exercises/python/weather-app/tests/test_weather_integration.py): Integration tests verifying JSON parsing and API error status codes.

---

## 4. Configuration

API parameters are configured via environment variables. Copy the environment template or create a `.env` file in the root directory:

```env
OPENWEATHERMAP_API_KEY=your_api_key_here
```

*Note: If no API key is specified, the application will transparently fall back to simulated data.*

---

## 5. How to Run

### Setup Environment
Create a virtual environment and install the required dependencies:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Run the Application
Start the Flask development server on port `5050` with debugging enabled:
```bash
python app.py
```
The server will start at `http://127.0.0.1:5050/`.

### Run Tests
You can run the entire test suite using `pytest`. Make sure `PYTHONPATH` includes the root directory:
```bash
# Within the activated virtual environment
PYTHONPATH=. pytest

# Or directly referencing the virtual environment bin
PYTHONPATH=. .venv/bin/pytest
```
To run tests with a coverage report:
```bash
PYTHONPATH=. pytest --cov=app tests/
```

---

## 6. API Guidelines

@docs/api-guidelines.md

---

## 7. API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Swagger API documentation & metadata |
| `/cities` | `GET` | List of all configured/supported cities |
| `/weather/<city_id>` | `GET` | Retrieve current weather statistics (real or simulated) |
| `/forecast/<city_id>` | `GET` | Retrieve 5-day weather forecast (real or simulated) |

---

## 8. Caching Strategy

@docs/caching-strategy.md

---

## 9. Coding Standards

@docs/coding-standards.md

---

## 10. Preferred Testing Patterns

@docs/testing.md

---

## 11. Sprint Focus: Implementing Caching

The current sprint focus is **implementing caching** to avoid redundant geocoding requests and external OpenWeatherMap OneCall API requests. 
- Ensure that cached data handles fallback logic gracefully.
- The `weather:<city_id>` and `forecast:<city_id>` cache entries must be configured with a 300-second (5-minute) timeout.

---

## 12. Code Review Checklist

@docs/code-review.md



