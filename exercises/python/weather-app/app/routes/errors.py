from flask import Flask, jsonify, Response
from werkzeug.exceptions import HTTPException
from app.exceptions import WeatherAppError

def register_error_handlers(app: Flask) -> None:
    """Register global error handlers for the Flask app."""
    
    @app.errorhandler(WeatherAppError)
    def handle_weather_app_error(error: WeatherAppError) -> Response:
        response = jsonify({
            "error": error.message
        })
        response.status_code = error.status_code
        return response

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException) -> Response:
        response = jsonify({
            "error": error.description
        })
        response.status_code = error.code if error.code is not None else 500
        return response

    @app.errorhandler(Exception)
    def handle_generic_exception(error: Exception) -> Response:
        app.logger.error(f"Unhandled exception: {error}", exc_info=True)
        response = jsonify({
            "error": "An unexpected internal server error occurred"
        })
        response.status_code = 500
        return response

