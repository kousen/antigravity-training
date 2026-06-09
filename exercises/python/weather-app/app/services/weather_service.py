import os
import requests
from datetime import datetime, timedelta
import random
from flask import has_app_context, current_app
import logging
from app.exceptions import CityNotFoundError, ExternalAPIError

# Configure fallback logger
logger = logging.getLogger(__name__)

def _get_config_value(key, default=None):
    if has_app_context():
        return current_app.config.get(key, default)
    return os.environ.get(key, default)

def _log_warning(msg):
    if has_app_context():
        current_app.logger.warning(msg)
    else:
        logger.warning(msg)

def _log_error(msg):
    if has_app_context():
        current_app.logger.error(msg)
    else:
        logger.error(msg)

# For demonstration, keeping a list of "known" cities for the /cities endpoint
KNOWN_CITIES = {
    "new york": "New York",
    "london": "London",
    "tokyo": "Tokyo",
    "sydney": "Sydney",
    "paris": "Paris",
}

CONDITIONS = ["sunny", "cloudy", "rainy", "partly_cloudy", "stormy", "snowy"]

def _get_lat_lon_from_city_name(city_name):
    """
    Looks up latitude and longitude for a given city name using OpenWeatherMap Geocoding API.
    Returns (lat, lon, resolved_city_name) or None if not found.
    """
    api_key = _get_config_value("OPENWEATHERMAP_API_KEY")
    if not api_key:
        _log_warning("API Key not configured for Geocoding.")
        return None

    params = {
        "q": city_name,
        "limit": 1,  # Get only the most relevant result
        "appid": api_key,
    }

    try:
        geocoding_url = _get_config_value("GEOCODING_BASE_URL", "http://api.openweathermap.org/geo/1.0/direct")
        response = requests.get(geocoding_url, params=params, timeout=5)
        
        if response.status_code == 404:
            raise CityNotFoundError(f"City '{city_name}' not found")
        elif response.status_code == 401:
            raise ExternalAPIError("Invalid API key or unauthorized", status_code=401)
        elif 500 <= response.status_code < 600:
            raise ExternalAPIError(f"External API server error: {response.status_code}", status_code=response.status_code)
            
        response.raise_for_status()
        data = response.json()

        if data:
            result = data[0]
            return result["lat"], result["lon"], result["name"]
        else:
            return None
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
        _log_error(f"Connection/timeout error fetching geocoding data for {city_name}: {e}")
        return None
    except requests.RequestException as e:
        if e.response is not None:
            status_code = e.response.status_code
            if status_code == 404:
                raise CityNotFoundError(f"City '{city_name}' not found") from e
            elif status_code == 401:
                raise ExternalAPIError("Invalid API key or unauthorized", status_code=401) from e
            elif 500 <= status_code < 600:
                raise ExternalAPIError(f"External API server error: {status_code}", status_code=status_code) from e
        _log_error(f"Error fetching geocoding data for {city_name}: {e}")
        return None

def _generate_simulated_weather(city_name, lat=None, lon=None):
    """Generate simulated weather data for a city (fallback)."""
    # Use default lat/lon if not provided, or a generic value
    lat = lat if lat is not None else 0.0
    lon = lon if lon is not None else 0.0
    
    return {
        "city": city_name.title(), # Capitalize for display
        "location": {"lat": lat, "lon": lon},
        "temperature": {
            "current": round(random.uniform(0, 35), 1),
            "feels_like": round(random.uniform(0, 35), 1),
            "min": round(random.uniform(-5, 15), 1),
            "max": round(random.uniform(20, 40), 1),
        },
        "condition": random.choice(CONDITIONS),
        "humidity": random.randint(30, 90),
        "wind_speed": round(random.uniform(0, 50), 1),
        "timestamp": datetime.now().isoformat(),
        "source": "simulated"
    }

def _fetch_real_weather(city_name):
    """Fetch real weather data from OpenWeatherMap One Call API 3.0."""
    coords = _get_lat_lon_from_city_name(city_name)
    if not coords:
        return None # City not found or geocoding failed
    
    lat, lon, resolved_city_name = coords
    
    api_key = _get_config_value("OPENWEATHERMAP_API_KEY")
    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric",
        "exclude": "minutely,hourly,alerts"
    }
    
    try:
        one_call_url = _get_config_value("ONE_CALL_BASE_URL", "https://api.openweathermap.org/data/3.0/onecall")
        response = requests.get(one_call_url, params=params, timeout=5)
        
        if response.status_code == 404:
            raise CityNotFoundError(f"City '{city_name}' not found")
        elif response.status_code == 401:
            raise ExternalAPIError("Invalid API key or unauthorized", status_code=401)
        elif 500 <= response.status_code < 600:
            raise ExternalAPIError(f"External API server error: {response.status_code}", status_code=response.status_code)
            
        response.raise_for_status()
        data = response.json()
        
        current = data.get("current", {})
        daily = data.get("daily", [{}])[0]
        weather_desc = current.get("weather", [{}])[0]
        
        return {
            "city": resolved_city_name,
            "location": {"lat": lat, "lon": lon},
            "temperature": {
                "current": current.get("temp"),
                "feels_like": current.get("feels_like"),
                "min": daily.get("temp", {}).get("min"),
                "max": daily.get("temp", {}).get("max"),
            },
            "condition": weather_desc.get("main", "Unknown").lower(),
            "humidity": current.get("humidity"),
            "wind_speed": current.get("wind_speed"),
            "timestamp": datetime.fromtimestamp(current.get("dt")).isoformat() if current.get("dt") else None,
            "source": "openweathermap"
        }
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
        _log_error(f"Connection/timeout error fetching weather for {city_name}: {e}")
        return None
    except requests.RequestException as e:
        if e.response is not None:
            status_code = e.response.status_code
            if status_code == 404:
                raise CityNotFoundError(f"City '{city_name}' not found") from e
            elif status_code == 401:
                raise ExternalAPIError("Invalid API key or unauthorized", status_code=401) from e
            elif 500 <= status_code < 600:
                raise ExternalAPIError(f"External API server error: {status_code}", status_code=status_code) from e
        _log_error(f"Error fetching weather for {city_name}: {e}")
        return None

def get_weather_data(city_name):
    """Get weather data for a city, preferring API if available."""
    api_key = _get_config_value("OPENWEATHERMAP_API_KEY")
    if api_key:
        weather = _fetch_real_weather(city_name)
        if weather:
            return weather
            
    # Fallback to simulated data if API fails or no API key
    return _generate_simulated_weather(city_name)

def _generate_simulated_forecast(city_name, lat=None, lon=None):
    """Generate 5-day simulated forecast."""
    lat = lat if lat is not None else 0.0
    lon = lon if lon is not None else 0.0
    
    forecast = []
    current_date = datetime.now()
    
    for i in range(5):
        date = current_date + timedelta(days=i)
        forecast.append({
            "date": date.strftime("%Y-%m-%d"),
            "temp_min": round(random.uniform(-5, 15), 1),
            "temp_max": round(random.uniform(20, 40), 1),
            "condition": random.choice(CONDITIONS)
        })
        
    return {
        "city": city_name.title(),
        "forecast": forecast,
        "source": "simulated"
    }

def _fetch_real_forecast(city_name):
    """Fetch 5-day forecast from OpenWeatherMap."""
    coords = _get_lat_lon_from_city_name(city_name)
    if not coords:
        return None # City not found or geocoding failed
        
    lat, lon, resolved_city_name = coords
    
    api_key = _get_config_value("OPENWEATHERMAP_API_KEY")
    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric",
        "exclude": "current,minutely,hourly,alerts"
    }
    
    try:
        one_call_url = _get_config_value("ONE_CALL_BASE_URL", "https://api.openweathermap.org/data/3.0/onecall")
        response = requests.get(one_call_url, params=params, timeout=5)
        
        if response.status_code == 404:
            raise CityNotFoundError(f"City '{city_name}' not found")
        elif response.status_code == 401:
            raise ExternalAPIError("Invalid API key or unauthorized", status_code=401)
        elif 500 <= response.status_code < 600:
            raise ExternalAPIError(f"External API server error: {response.status_code}", status_code=response.status_code)
            
        response.raise_for_status()
        data = response.json()
        
        daily_data = data.get("daily", [])[:5] # Get first 5 days
        forecast = []
        
        for day in daily_data:
            dt_obj = datetime.fromtimestamp(day.get("dt"))
            weather_desc = day.get("weather", [{}])[0]
            forecast.append({
                "date": dt_obj.strftime("%Y-%m-%d"),
                "temp_min": day.get("temp", {}).get("min"),
                "temp_max": day.get("temp", {}).get("max"),
                "condition": weather_desc.get("main", "Unknown").lower()
            })
            
        return {
            "city": resolved_city_name,
            "forecast": forecast,
            "source": "openweathermap"
        }
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
        _log_error(f"Error fetching forecast for {city_name}: {e}")
        return None
    except requests.RequestException as e:
        if e.response is not None:
            status_code = e.response.status_code
            if status_code == 404:
                raise CityNotFoundError(f"City '{city_name}' not found") from e
            elif status_code == 401:
                raise ExternalAPIError("Invalid API key or unauthorized", status_code=401) from e
            elif 500 <= status_code < 600:
                raise ExternalAPIError(f"External API server error: {status_code}", status_code=status_code) from e
        _log_error(f"Error fetching forecast for {city_name}: {e}")
        return None

def get_forecast_data(city_name):
    """Get forecast data for a city."""
    api_key = _get_config_value("OPENWEATHERMAP_API_KEY")
    if api_key:
        forecast = _fetch_real_forecast(city_name)
        if forecast:
            return forecast
            
    return _generate_simulated_forecast(city_name)

def get_all_cities():
    """Return list of all known cities (for display purposes)."""
    return [{"id": city.lower().replace(" ", "_"), "name": city} for city in KNOWN_CITIES.values()]