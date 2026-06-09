import pytest
import requests
from unittest.mock import patch, MagicMock
from app.services.weather_service import get_weather_data, get_forecast_data, _get_lat_lon_from_city_name

# Mock data matching OWM One Call 3.0 structure
MOCK_OWM_RESPONSE = {
    "lat": 51.5074,
    "lon": -0.1278,
    "timezone": "Europe/London",
    "current": {
        "dt": 1684929490,
        "sunrise": 1684902300,
        "sunset": 1684959000,
        "temp": 15.5,
        "feels_like": 14.8,
        "pressure": 1015,
        "humidity": 60,
        "dew_point": 7.8,
        "uvi": 4.5,
        "clouds": 75,
        "visibility": 10000,
        "wind_speed": 4.1,
        "wind_deg": 280,
        "weather": [
            {
                "id": 803,
                "main": "Clouds",
                "description": "broken clouds",
                "icon": "04d"
            }
        ]
    },
    "daily": [
        {
            "dt": 1684926000 + (86400 * i),
            "temp": {
                "day": 16.2,
                "min": 10.5,
                "max": 18.0,
                "night": 12.1,
                "eve": 15.8,
                "morn": 11.0
            },
            "weather": [{"main": "Clouds"}]
        } for i in range(8) # Simulate 8 days
    ]
}

MOCK_GEO_RESPONSE = [
    {
        "name": "London",
        "local_names": {"en": "London"},
        "lat": 51.5073219,
        "lon": -0.1276474,
        "country": "GB",
        "state": "England"
    }
]

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service.requests.get")
def test_get_lat_lon_success(mock_get):
    """Test successful geocoding lookup."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = MOCK_GEO_RESPONSE
    mock_get.return_value = mock_response

    lat, lon, name = _get_lat_lon_from_city_name("London")
    
    mock_get.assert_called_once()
    assert lat == 51.5073219
    assert lon == -0.1276474
    assert name == "London"

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service.requests.get")
def test_get_lat_lon_not_found(mock_get):
    """Test geocoding lookup for non-existent city."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [] # Empty list means not found
    mock_get.return_value = mock_response

    result = _get_lat_lon_from_city_name("Atlantis")
    assert result is None

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service._get_lat_lon_from_city_name")
@patch("app.services.weather_service.requests.get")
def test_fetch_real_weather_success(mock_get, mock_geo):
    """Test successful API call and data mapping."""
    # Mock geocoding
    mock_geo.return_value = (51.5074, -0.1278, "London")
    
    # Mock One Call API
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = MOCK_OWM_RESPONSE
    mock_get.return_value = mock_response

    # Call function
    result = get_weather_data("London")

    # Verify geocoding called
    mock_geo.assert_called_once_with("London")

    # Verify requests called correctly (One Call API)
    mock_get.assert_called_once()
    args, kwargs = mock_get.call_args
    assert "lat" in kwargs["params"]
    assert kwargs["params"]["lat"] == 51.5074

    # Verify data mapping
    assert result["city"] == "London"
    assert result["temperature"]["current"] == 15.5
    assert result["source"] == "openweathermap"

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service._get_lat_lon_from_city_name")
@patch("app.services.weather_service.requests.get")
def test_fetch_real_weather_failure_fallback(mock_get, mock_geo):
    """Test API failure falls back to simulation."""
    # Mock geocoding success
    mock_geo.return_value = (51.5074, -0.1278, "London")
    
    # Setup mock to raise exception for One Call API
    mock_get.side_effect = requests.exceptions.RequestException("Connection error")

    # Call function
    result = get_weather_data("London")

    # Verify fallback happened
    assert result is not None
    assert result["city"] == "London"
    assert result["source"] == "simulated"

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service._get_lat_lon_from_city_name")
def test_fetch_real_weather_geocoding_fail_fallback(mock_geo):
    """Test Geocoding failure falls back to simulation."""
    # Mock geocoding failure
    mock_geo.return_value = None

    # Call function
    result = get_weather_data("UnknownCity")

    # Verify fallback happened
    assert result is not None
    assert result["city"] == "Unknowncity" # Simulated title-cases it
    assert result["source"] == "simulated"

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service._get_lat_lon_from_city_name")
@patch("app.services.weather_service.requests.get")
def test_fetch_real_forecast_success(mock_get, mock_geo):
    """Test successful Forecast API call and data mapping."""
    # Mock geocoding
    mock_geo.return_value = (51.5074, -0.1278, "London")
    
    # Setup mock
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = MOCK_OWM_RESPONSE
    mock_get.return_value = mock_response

    # Call function
    result = get_forecast_data("London")

    # Verify requests called correctly
    mock_get.assert_called_once()
    
    # Verify data mapping
    assert result["city"] == "London"
    assert result["source"] == "openweathermap"
    assert "forecast" in result
    assert len(result["forecast"]) == 5


from app.exceptions import CityNotFoundError, ExternalAPIError
from app.services.weather_service import (
    _fetch_real_weather,
    _fetch_real_forecast,
    _log_warning,
    _log_error
)

@patch("app.services.weather_service.has_app_context", return_value=False)
@patch("app.services.weather_service.logger")
def test_logging_outside_app_context(mock_logger, mock_has_context):
    """Test logging functions when outside of Flask app context."""
    _log_warning("Test warning outside context")
    mock_logger.warning.assert_called_once_with("Test warning outside context")
    
    _log_error("Test error outside context")
    mock_logger.error.assert_called_once_with("Test error outside context")

@patch.dict("os.environ", {}, clear=True)
@patch("app.services.weather_service.has_app_context", return_value=False)
def test_geocoding_missing_api_key(mock_has_context):
    """Test geocoding fails gracefully and warns when API key is missing."""
    with patch("app.services.weather_service.logger") as mock_logger:
        result = _get_lat_lon_from_city_name("London")
        assert result is None
        mock_logger.warning.assert_called_once_with("API Key not configured for Geocoding.")

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service.requests.get")
def test_geocoding_api_status_errors(mock_get):
    """Test geocoding handles various HTTP status codes."""
    # Test 404
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_get.return_value = mock_response
    with pytest.raises(CityNotFoundError):
        _get_lat_lon_from_city_name("London")
        
    # Test 401
    mock_response.status_code = 401
    with pytest.raises(ExternalAPIError) as exc:
        _get_lat_lon_from_city_name("London")
    assert exc.value.status_code == 401
    
    # Test 500
    mock_response.status_code = 500
    with pytest.raises(ExternalAPIError) as exc:
        _get_lat_lon_from_city_name("London")
    assert exc.value.status_code == 500

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service.requests.get")
def test_geocoding_request_exceptions(mock_get):
    """Test geocoding handles requests exceptions with and without responses."""
    # Timeout/ConnectionError (should log and return None)
    mock_get.side_effect = requests.exceptions.Timeout("Timeout")
    result = _get_lat_lon_from_city_name("London")
    assert result is None
    
    # RequestException with 404 response
    mock_response = MagicMock()
    mock_response.status_code = 404
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(CityNotFoundError):
        _get_lat_lon_from_city_name("London")
        
    # RequestException with 401 response
    mock_response.status_code = 401
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(ExternalAPIError) as exc:
        _get_lat_lon_from_city_name("London")
    assert exc.value.status_code == 401
    
    # RequestException with 500 response
    mock_response.status_code = 500
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(ExternalAPIError) as exc:
        _get_lat_lon_from_city_name("London")
    assert exc.value.status_code == 500
    
    # RequestException with other status code (e.g. 418 I'm a teapot)
    mock_response.status_code = 418
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    result = _get_lat_lon_from_city_name("London")
    assert result is None

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service._get_lat_lon_from_city_name")
@patch("app.services.weather_service.requests.get")
def test_fetch_real_weather_api_status_errors(mock_get, mock_geo):
    """Test fetch_real_weather handles various HTTP status codes."""
    mock_geo.return_value = (51.5074, -0.1278, "London")
    
    # Test 404
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_get.return_value = mock_response
    with pytest.raises(CityNotFoundError):
        _fetch_real_weather("London")
        
    # Test 401
    mock_response.status_code = 401
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_weather("London")
    assert exc.value.status_code == 401
    
    # Test 500
    mock_response.status_code = 500
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_weather("London")
    assert exc.value.status_code == 500

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service._get_lat_lon_from_city_name")
@patch("app.services.weather_service.requests.get")
def test_fetch_real_weather_request_exceptions(mock_get, mock_geo):
    """Test fetch_real_weather handles requests exceptions."""
    mock_geo.return_value = (51.5074, -0.1278, "London")
    
    # ConnectionError/Timeout
    mock_get.side_effect = requests.exceptions.ConnectionError("Connection failed")
    result = _fetch_real_weather("London")
    assert result is None
    
    # RequestException with 404 response
    mock_response = MagicMock()
    mock_response.status_code = 404
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(CityNotFoundError):
        _fetch_real_weather("London")

    # RequestException with 401 response
    mock_response.status_code = 401
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_weather("London")
    assert exc.value.status_code == 401

    # RequestException with 500 response
    mock_response.status_code = 500
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_weather("London")
    assert exc.value.status_code == 500

    # RequestException with other status
    mock_response.status_code = 418
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    result = _fetch_real_weather("London")
    assert result is None

@patch.dict("os.environ", {"OPENWEATHERMAP_API_KEY": "fake_key"})
@patch("app.services.weather_service._get_lat_lon_from_city_name")
@patch("app.services.weather_service.requests.get")
def test_fetch_real_forecast_api_errors(mock_get, mock_geo):
    """Test fetch_real_forecast handles various exceptions."""
    # Case: Geocoding fails (returns None)
    mock_geo.return_value = None
    result = _fetch_real_forecast("London")
    assert result is None
    
    # Geocoding succeeds
    mock_geo.return_value = (51.5074, -0.1278, "London")
    
    # Test 404 status
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_get.return_value = mock_response
    with pytest.raises(CityNotFoundError):
        _fetch_real_forecast("London")
        
    # Test 401 status
    mock_response.status_code = 401
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_forecast("London")
    assert exc.value.status_code == 401
    
    # Test 500 status
    mock_response.status_code = 500
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_forecast("London")
    assert exc.value.status_code == 500
    
    # ConnectionError/Timeout
    mock_get.side_effect = requests.exceptions.Timeout("Timeout")
    result = _fetch_real_forecast("London")
    assert result is None

    # RequestException with 404 response
    mock_response.status_code = 404
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(CityNotFoundError):
        _fetch_real_forecast("London")

    # RequestException with 401 response
    mock_response.status_code = 401
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_forecast("London")
    assert exc.value.status_code == 401

    # RequestException with 500 response
    mock_response.status_code = 500
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    with pytest.raises(ExternalAPIError) as exc:
        _fetch_real_forecast("London")
    assert exc.value.status_code == 500

    # RequestException with other status
    mock_response.status_code = 418
    req_exc = requests.RequestException(response=mock_response)
    mock_get.side_effect = req_exc
    result = _fetch_real_forecast("London")
    assert result is None

