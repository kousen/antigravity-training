import os
import requests
from datetime import datetime, timedelta
import random

# For demonstration, keeping a list of "known" cities for the /cities endpoint
KNOWN_CITIES = {
    "new york": "New York",
    "london": "London",
    "tokyo": "Tokyo",
    "sydney": "Sydney",
    "paris": "Paris",
}

CONDITIONS = ["sunny", "cloudy", "rainy", "partly_cloudy", "stormy", "snowy"]

API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY")

GEOCODING_BASE_URL = "http://api.openweathermap.org/geo/1.0/direct"
ONE_CALL_BASE_URL = "https://api.openweathermap.org/data/3.0/onecall"

def _get_lat_lon_from_city_name(city_name):
    """
    Looks up latitude and longitude for a given city name using OpenWeatherMap Geocoding API.
    Returns (lat, lon, resolved_city_name) or None if not found.
    """
    if not API_KEY:
        print("API Key not configured for Geocoding.")
        return None

    params = {
        "q": city_name,
        "limit": 1,  # Get only the most relevant result
        "appid": API_KEY,
    }

    try:
        response = requests.get(GEOCODING_BASE_URL, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        if data:
            result = data[0]
            return result["lat"], result["lon"], result["name"]
        else:
            return None
    except requests.RequestException as e:
        print(f"Error fetching geocoding data for {city_name}: {e}")
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
    
    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY,
        "units": "metric",
        "exclude": "minutely,hourly,alerts"
    }
    
    try:
        response = requests.get(ONE_CALL_BASE_URL, params=params, timeout=5)
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
    except requests.RequestException as e:
        print(f"Error fetching weather for {city_name}: {e}")
        return None

def get_weather_data(city_name):
    """Get weather data for a city, preferring API if available."""
    if API_KEY:
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
    
    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY,
        "units": "metric",
        "exclude": "current,minutely,hourly,alerts"
    }
    
    try:
        response = requests.get(ONE_CALL_BASE_URL, params=params, timeout=5)
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
    except requests.RequestException as e:
        print(f"Error fetching forecast for {city_name}: {e}")
        return None

def get_forecast_data(city_name):
    """Get forecast data for a city."""
    if API_KEY:
        forecast = _fetch_real_forecast(city_name)
        if forecast:
            return forecast
            
    return _generate_simulated_forecast(city_name)

def get_all_cities():
    """Return list of all known cities (for display purposes)."""
    return [{"id": city.lower().replace(" ", "_"), "name": city} for city in KNOWN_CITIES.values()]