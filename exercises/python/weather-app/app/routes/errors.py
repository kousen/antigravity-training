from flask import jsonify
from werkzeug.exceptions import HTTPException
from app.exceptions import WeatherAppError

def register_error_handlers(app):
    """Register global error handlers for the Flask app."""
    
    @app.errorhandler(WeatherAppError)
    def handle_weather_app_error(error):
        response = jsonify({
            "error": error.message
        })
        response.status_code = error.status_code
        return response

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        response = jsonify({
            "error": error.description
        })
        response.status_code = error.code
        return response

    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        app.logger.error(f"Unhandled exception: {error}", exc_info=True)
        response = jsonify({
            "error": "An unexpected internal server error occurred"
        })
        response.status_code = 500
        return response
