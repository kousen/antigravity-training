# Caching Strategy

- To prevent redundant, expensive geocoding and forecast lookups, the service layers wrap responses using `Flask-Caching` under keys:
  - `weather:<city_id>` (timeout: 300s)
  - `forecast:<city_id>` (timeout: 300s)
