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

@patch("app.services.weather_service.API_KEY", None)
def test_get_weather_invalid(client):
    """Test getting weather for an invalid city (falls back to simulation)."""
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

@patch("app.services.weather_service.API_KEY", None)
def test_get_forecast_invalid(client):
    """Test getting forecast for an invalid city (falls back to simulation)."""
    response = client.get('/forecast/atlantis')
    assert response.status_code == 200
    data = response.get_json()
    assert data['city'] == "Atlantis"
    assert data.get('source') == 'simulated'
