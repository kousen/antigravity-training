# Weather App

A simple Flask-based weather API for Gemini CLI training exercises.

## Architecture

```mermaid
flowchart TD
    subgraph Entry ["Entry Point"]
        AppPY["app.py"]
    end

    subgraph Initialization ["App Initialization"]
        Init["app/__init__.py<br/>create_app"]
    end

    subgraph Routing ["Routes (Blueprints)"]
        MainBP["app/routes/main.py<br/>main_bp"]
        WeatherBP["app/routes/weather.py<br/>weather_bp"]
    end

    subgraph ServiceLayer ["Service Layer"]
        WeatherService["app/services/weather_service.py"]
    end

    subgraph External ["External Systems"]
        OWM["OpenWeatherMap API"]
    end

    %% Relationships
    AppPY -->|Calls| Init
    Init -->|Registers| MainBP
    Init -->|Registers| WeatherBP
    
    WeatherBP -->|Calls get_weather_data| WeatherService
    WeatherBP -->|Calls get_forecast_data| WeatherService
    WeatherBP -->|Calls get_all_cities| WeatherService
    
    WeatherService -.->|"HTTP Requests (if API key)"| OWM
    WeatherService -.->|Fallback/Simulated| Simulation["Internal Simulation"]

    %% Node styles
    style AppPY fill:#6C3FE0,stroke:#A78BFA,color:#fff
    style Init fill:#2563EB,stroke:#60A5FA,color:#fff
    style MainBP fill:#0D9488,stroke:#5EEAD4,color:#fff
    style WeatherBP fill:#0D9488,stroke:#5EEAD4,color:#fff
    style WeatherService fill:#D97706,stroke:#FCD34D,color:#fff
    style OWM fill:#DC2626,stroke:#FCA5A5,color:#fff
    style Simulation fill:#DC2626,stroke:#FCA5A5,color:#fff

    %% Subgraph styles
    style Entry fill:#1E1B4B,stroke:#A78BFA,color:#E0E7FF
    style Initialization fill:#172554,stroke:#60A5FA,color:#DBEAFE
    style Routing fill:#134E4A,stroke:#5EEAD4,color:#CCFBF1
    style ServiceLayer fill:#451A03,stroke:#FCD34D,color:#FEF3C7
    style External fill:#450A0A,stroke:#FCA5A5,color:#FEE2E2
```

## Setup

```bash
pip install -r requirements.txt
python app.py
```

## API Endpoints

- `GET /` - API documentation
- `GET /cities` - List available cities
- `GET /weather/<city_id>` - Get current weather
- `GET /forecast/<city_id>` - Get 5-day forecast (TODO)

## Exercise Goals

Use Gemini CLI to:
1. Explore and understand the codebase
2. Add comprehensive error handling
3. Implement the forecast endpoint
4. Add unit and integration tests
5. Create API documentation
6. Add caching for weather data
