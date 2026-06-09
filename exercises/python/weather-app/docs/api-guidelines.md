# API Guidelines

## Response Formats
- **JSON Default**: All API endpoints must return data formatted in JSON.
- **Headers**: Responses must include the `Content-Type: application/json` header.

## Consistent Error Responses
All error responses must follow a consistent schema:
```json
{
  "error": "Short, human-readable error message describing the issue",
  "code": 400,
  "details": {
    "field_name": "Specific details about the error (optional)"
  }
}
```

## Request Validation
- All input parameters (path variables, query parameters, and JSON request bodies) must be validated before processing business logic.
- Returns `400 Bad Request` or `422 Unprocessable Entity` immediately with descriptive errors if validation fails.

## OpenAPI / Swagger Documentation
- All endpoints must be documented using **OpenAPI/Swagger** specifications via YAML/OpenAPI comment blocks in route docstrings.
