import os

class Config:
    OPENWEATHERMAP_API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY")
    GEOCODING_BASE_URL = "http://api.openweathermap.org/geo/1.0/direct"
    ONE_CALL_BASE_URL = "https://api.openweathermap.org/data/3.0/onecall"
