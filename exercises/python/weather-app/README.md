# Weather App

A Flask-based weather service and REST API for Antigravity CLI training exercises.

Features support for live weather data via OpenWeatherMap (One Call API 3.0 & Geocoding) with automatic fallback to simulated weather data, interactive Swagger UI documentation, and automated tests.

---

## Setup Instructions

### 1. Prerequisites
- Python 3.10+ (tested with Python 3.11)
- `pip`

### 2. Virtual Environment Setup

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

*(On Windows: `.venv\Scripts\activate`)*

### 3. Install Dependencies

Install required packages from [requirements.txt](file:///Users/kennethkousen/Documents/OReilly/antigravity-training/exercises/python/weather-app/requirements.txt):

```bash
pip install -r requirements.txt
```

Current dependencies include:
- `flask`: Microframework for web endpoints
- `requests`: HTTP requests to OpenWeatherMap API
- `flasgger`: OpenAPI / Swagger UI integration
- `pytest`: Test runner
- `pytest-cov`: Test coverage reporting

---

## Environment Variables (.env)

The project includes a [.env](file:///Users/kennethkousen/Documents/OReilly/antigravity-training/exercises/python/weather-app/.env) file:

```bash
PYTHONPATH=.
```

### Optional: OpenWeatherMap API Key
By default, the application runs without an external API key and seamlessly falls back to realistic simulated weather data.

To use live weather and 5-day forecasts from OpenWeatherMap:
1. Obtain an API key from [OpenWeather](https://openweathermap.org/api).
2. Set the `OPENWEATHERMAP_API_KEY` environment variable in your shell or add it to [.env](file:///Users/kennethkousen/Documents/OReilly/antigravity-training/exercises/python/weather-app/.env):

```bash
export OPENWEATHERMAP_API_KEY="your_api_key_here"
```

---

## Running the Application

Ensure your virtual environment is active, then start the server:

```bash
python app.py
```

The server starts locally in debug mode on **port 5050**:
```
http://127.0.0.1:5050
```

---

## API Documentation & Swagger UI

Interactive Swagger / OpenAPI documentation is generated with Flasgger:
- **Swagger UI**: [http://127.0.0.1:5050/apidocs/](http://127.0.0.1:5050/apidocs/)
- **API Spec (JSON)**: [http://127.0.0.1:5050/apispec_1.json](http://127.0.0.1:5050/apispec_1.json)

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API metadata and endpoint overview |
| `GET` | `/apidocs/` | Interactive Swagger UI documentation |
| `GET` | `/cities` | List available / known cities |
| `GET` | `/weather/<city_id>` | Current weather data (e.g. `/weather/london`) |
| `GET` | `/forecast/<city_id>` | 5-day weather forecast (e.g. `/forecast/london`) |

---

## Running Tests and Coverage

### Run All Tests
```bash
pytest
```

### Run Tests with Verbose Output
```bash
pytest -v
```

### Run Tests with Coverage Report
Generate terminal coverage report:
```bash
pytest --cov=app
```

Generate detailed terminal coverage report with missing lines:
```bash
pytest -v --cov=app --cov-report=term-missing
```

Generate an HTML coverage report:
```bash
pytest --cov=app --cov-report=html
```
*(Open `htmlcov/index.html` in your browser to inspect coverage line-by-line)*

---

## Project Structure

```text
weather-app/
├── app/
│   ├── __init__.py               # Flask app factory (registers blueprints, Flasgger)
│   ├── config.py                 # Configuration settings & env variables
│   ├── exceptions.py             # Custom application exceptions
│   ├── routes/
│   │   ├── errors.py             # Error handlers
│   │   ├── main.py               # Root endpoint (/)
│   │   └── weather.py            # Weather & forecast endpoints
│   └── services/
│       └── weather_service.py    # OpenWeatherMap client & simulation logic
├── tests/
│   ├── test_weather.py           # Unit / route tests
│   └── test_weather_integration.py # Service & API integration tests
├── .env                          # Local environment variables
├── app.py                        # Application entry point (runs on port 5050)
├── pytest.ini                    # Pytest configuration
├── README.md                     # Project documentation
└── requirements.txt              # Project dependencies
```
