# Gemini Context: src/api

## API Development Guidelines

### 1. Response Format
*   **JSON Only:** All API endpoints must return valid JSON responses.
*   **Content-Type:** Ensure the `Content-Type` header is set to `application/json`.

### 2. Error Handling
*   **Consistent Format:** Use a standardized JSON structure for all error responses:
    ```json
    {
      "error": "ERROR_CODE",
      "message": "A human-readable description of the error."
    }
    ```
*   **HTTP Status Codes:** Return appropriate HTTP status codes (e.g., `400` for bad requests, `404` for not found, `500` for internal errors).

### 3. Request Validation
*   **Input Validation:** Strictly validate all incoming request data (query parameters, JSON bodies).
*   **Fail Fast:** Reject invalid requests immediately with a `400 Bad Request` and a descriptive error message.

### 4. Documentation
*   **OpenAPI/Swagger:** Every endpoint must include OpenAPI specifications in its docstring.
*   **Completeness:** Document parameters, success responses, and potential error codes.
