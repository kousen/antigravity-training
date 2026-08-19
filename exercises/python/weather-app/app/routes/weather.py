from flask import Blueprint, jsonify
from app.services.weather_service import get_weather_data, get_forecast_data, get_all_cities

weather_bp = Blueprint('weather', __name__)

@weather_bp.route("/cities")
def list_cities():
    """
    List all available cities.
    ---
    responses:
      200:
        description: A list of known cities
        examples:
          application/json: {
            "cities": [
              {"id": "london", "name": "London"},
              {"id": "new_york", "name": "New York"}
            ]
          }
    """
    cities = get_all_cities()
    return jsonify({
        "cities": cities
    })


@weather_bp.route("/weather/<city_id>")
def get_weather(city_id):
    """
    Get current weather for a specific city.
    ---
    parameters:
      - name: city_id
        in: path
        type: string
        required: true
        description: The name of the city (e.g., 'london', 'new york')
    responses:
      200:
        description: Current weather data
        schema:
          type: object
          properties:
            city:
              type: string
              description: The name of the city
            temperature:
              type: object
              properties:
                current:
                  type: number
                min:
                  type: number
                max:
                  type: number
                feels_like:
                  type: number
            condition:
              type: string
              description: Weather condition (e.g., sunny, rainy)
            humidity:
              type: integer
            wind_speed:
              type: number
            timestamp:
              type: string
              format: date-time
            source:
              type: string
              description: Data source (openweathermap or simulated)
      404:
        description: City not found
    """
    weather = get_weather_data(city_id)

    if weather is None:
        return jsonify({"error": "City not found"}), 404

    return jsonify(weather)


@weather_bp.route("/forecast/<city_id>")
def get_forecast(city_id):
    """
    Get 5-day weather forecast for a city.
    ---
    parameters:
      - name: city_id
        in: path
        type: string
        required: true
        description: The name of the city
    responses:
      200:
        description: 5-day weather forecast
        schema:
          type: object
          properties:
            city:
              type: string
            source:
              type: string
            forecast:
              type: array
              items:
                type: object
                properties:
                  date:
                    type: string
                    format: date
                  temp_min:
                    type: number
                  temp_max:
                    type: number
                  condition:
                    type: string
      404:
        description: City not found
    """
    forecast = get_forecast_data(city_id)
    
    if forecast is None:
        return jsonify({"error": "City not found"}), 404
        
    return jsonify(forecast)
