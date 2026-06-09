import pytest
from unittest.mock import patch
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    """Test the home endpoint."""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert data['name'] == "Weather API"

def test_list_cities(client):
    """Test the cities list endpoint."""
    response = client.get('/cities')
    assert response.status_code == 200
    data = response.get_json()
    assert "cities" in data
    assert len(data['cities']) > 0

def test_get_weather_valid(client):
    """Test getting weather for a valid city."""
    response = client.get('/weather/london')
    assert response.status_code == 200
    data = response.get_json()
    # Note: City name might come back as "London" or "London, GB" depending on API/Sim
    assert "London" in data['city'] 
    assert "temperature" in data

def test_get_weather_invalid(client):
    """Test getting weather for an invalid city (falls back to simulation)."""
    client.application.config['OPENWEATHERMAP_API_KEY'] = None
    response = client.get('/weather/atlantis')
    assert response.status_code == 200
    data = response.get_json()
    assert data['city'] == "Atlantis"
    assert data.get('source') == 'simulated'

def test_get_forecast_valid(client):
    """Test getting forecast for a valid city."""
    response = client.get('/forecast/london')
    assert response.status_code == 200
    data = response.get_json()
    assert "London" in data['city']
    assert "forecast" in data
    assert len(data['forecast']) == 5

def test_get_forecast_invalid(client):
    """Test getting forecast for an invalid city (falls back to simulation)."""
    client.application.config['OPENWEATHERMAP_API_KEY'] = None
    response = client.get('/forecast/atlantis')
    assert response.status_code == 200
    data = response.get_json()
    assert data['city'] == "Atlantis"
    assert data.get('source') == 'simulated'

def test_global_error_handler_city_not_found(client):
    """Test that CityNotFoundError returns 404 JSON."""
    with patch("app.routes.weather.get_weather_data") as mock_get:
        from app.exceptions import CityNotFoundError
        mock_get.side_effect = CityNotFoundError("City not found: atlantis")
        response = client.get('/weather/atlantis')
        assert response.status_code == 404
        data = response.get_json()
        assert data == {"error": "City not found: atlantis"}

def test_global_error_handler_external_api_error(client):
    """Test that ExternalAPIError returns 502 JSON."""
    with patch("app.routes.weather.get_weather_data") as mock_get:
        from app.exceptions import ExternalAPIError
        mock_get.side_effect = ExternalAPIError("External API Error", status_code=502)
        response = client.get('/weather/london')
        assert response.status_code == 502
        data = response.get_json()
        assert data == {"error": "External API Error"}

def test_caching_behavior(client):
    """Test that subsequent calls return cached weather data."""
    from app import cache
    cache.clear()

    with patch("app.services.weather_service._fetch_real_weather") as mock_real, \
         patch("app.services.weather_service._generate_simulated_weather") as mock_sim:
        
        test_data = {
            "city": "TestCity",
            "temperature": {"current": 20.0},
            "condition": "sunny"
        }
        mock_sim.return_value = test_data
        mock_real.return_value = test_data
        
        # Make the first call
        response1 = client.get("/weather/testcity")
        assert response1.status_code == 200
        
        # Make the second call
        response2 = client.get("/weather/testcity")
        assert response2.status_code == 200
        
        # Either mock_real or mock_sim should have been called exactly once
        assert mock_sim.call_count + mock_real.call_count == 1

def test_caching_behavior_forecast(client):
    """Test that subsequent calls return cached forecast data."""
    from app import cache
    cache.clear()

    with patch("app.services.weather_service._fetch_real_forecast") as mock_real, \
         patch("app.services.weather_service._generate_simulated_forecast") as mock_sim:
        
        test_data = {
            "city": "TestCity",
            "forecast": []
        }
        mock_sim.return_value = test_data
        mock_real.return_value = test_data
        
        # Make the first call
        response1 = client.get("/forecast/testcity")
        assert response1.status_code == 200
        
        # Make the second call
        response2 = client.get("/forecast/testcity")
        assert response2.status_code == 200
        
        # Either mock_real or mock_sim should have been called exactly once
        assert mock_sim.call_count + mock_real.call_count == 1


