# API Developer Guide

This document defines the requirements, standards, and conventions for all APIs in the `src/api` module.

---

## 1. Response Formats

- **JSON Default**: All API endpoints must return data formatted in JSON.
- **Headers**: Responses must include the `Content-Type: application/json` header.

---

## 2. Consistent Error Responses

To maintain a predictable interface, all error responses must follow a consistent schema:

```json
{
  "error": "Short, human-readable error message describing the issue",
  "code": 400,
  "details": {
    "field_name": "Specific details about the error (optional)"
  }
}
```

### Standard Status Codes
- `400 Bad Request`: Validation failure or malformed request payload.
- `401 Unauthorized`: Missing or invalid credentials/API key.
- `404 Not Found`: Requested resource (e.g. city) does not exist.
- `422 Unprocessable Entity`: Request format is correct, but payload fails validation rules.
- `500 Internal Server Error`: Unhandled server-side exception.
- `502 Bad Gateway`: External dependency (e.g., weather API) failure.

---

## 3. Request Validation

- All input parameters (path variables, query parameters, and JSON request bodies) must be validated before processing business logic.
- Returns `400 Bad Request` or `422 Unprocessable Entity` immediately with descriptive errors if validation fails.
- Schema verification should be handled using standard validation decorators or schemas.

---

## 4. OpenAPI / Swagger Documentation

- All endpoints must be documented using **OpenAPI/Swagger** specifications.
- Use YAML/OpenAPI comment blocks in route docstrings.
- Ensure the documentation defines:
  - Request parameters (path, query, body) and types.
  - Response structures for both success (2xx) and failure (4xx, 5xx) states.
  - Examples of payloads.
