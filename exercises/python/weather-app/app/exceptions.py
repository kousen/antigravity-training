class WeatherAppError(Exception):
    """Base exception for our application."""
    def __init__(self, message: str = "An internal error occurred", status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class CityNotFoundError(WeatherAppError):
    """Raised when a city is not found."""
    def __init__(self, message: str = "City not found"):
        super().__init__(message, status_code=404)


class ExternalAPIError(WeatherAppError):
    """Raised when the external weather API provider fails or is misconfigured."""
    def __init__(self, message: str = "External weather API error", status_code: int = 502):
        # Can default to 502 Bad Gateway, or accept custom status_code (like 503)
        super().__init__(message, status_code=status_code)

