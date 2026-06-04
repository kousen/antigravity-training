import json

from playwright.sync_api import Page, expect

BASE_URL = "http://127.0.0.1:5050"


def test_swagger_ui_loads(page: Page):
    """Verify that the Swagger UI documentation page loads correctly."""
    page.goto(f"{BASE_URL}/apidocs/")
    expect(page).to_have_title("Flasgger")

    # Check for the API title in the Swagger UI
    header = page.locator(".title")
    expect(header).to_contain_text("Weather API")

def test_api_home_endpoint(page: Page):
    """Verify the root JSON endpoint returns correct metadata."""
    page.goto(BASE_URL)
    data = json.loads(page.locator("body").inner_text())
    assert data["name"] == "Weather API"
    assert data["version"] == "1.0.0"


def test_cities_list_endpoint(page: Page):
    """Verify the /cities endpoint returns a list of cities."""
    page.goto(f"{BASE_URL}/cities")
    body_text = page.locator("body").inner_text()
    assert '"cities":' in body_text
    assert "London" in body_text
    assert "Tokyo" in body_text


def test_weather_endpoint_valid_city(page: Page):
    """Verify weather data is returned for a valid city."""
    page.goto(f"{BASE_URL}/weather/london")
    body_text = page.locator("body").inner_text()
    assert '"city":' in body_text
    # Check for common weather fields
    assert '"temperature":' in body_text
    assert '"condition":' in body_text


def test_forecast_endpoint(page: Page):
    """Verify forecast data is returned for a valid city."""
    page.goto(f"{BASE_URL}/forecast/london")
    body_text = page.locator("body").inner_text()
    assert '"city":' in body_text
    assert '"forecast":' in body_text
    # Should have 5 days of data
    data = json.loads(body_text)
    assert len(data["forecast"]) == 5
