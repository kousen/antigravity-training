# API Directory Rules

This directory and its subdirectories contain API endpoint implementations. All agents working within this scope must adhere to the following conventions:

## 1. JSON-Only Responses
* **Format:** All endpoints must return JSON (`application/json`).
* **Controllers:** Use `@RestController` (or `@ResponseBody`) to ensure automatic serialization.
* **Content Negotiation:** Avoid returning raw strings, HTML, or plain text unless explicitly requested.

## 2. Consistent Error Response Format
* **Standard Error Payload:** All error responses must adhere to a consistent JSON structure:
  ```json
  {
    "timestamp": "ISO-8601 string",
    "status": 400,
    "error": "Bad Request",
    "message": "Human-readable description of error",
    "path": "/api/..."
  }
  ```
* **Validation Errors:** When validation fails, include field-specific details (e.g., field name and constraint violation message).
* **Exception Handling:** Route exceptions through `@ControllerAdvice` or centralized exception handlers rather than building ad-hoc error response bodies inside controller methods.

## 3. Request Validation
* **Payload Validation:** Validate all request bodies using Jakarta Bean Validation annotations (`@Valid` with `@RequestBody`).
* **Domain Constraints:** Ensure input models define appropriate constraints (`@NotBlank`, `@NotNull`, `@Min`, `@PastOrPresent`, etc.).
* **Parameter Validation:** Validate route parameters (`@PathVariable`) and query parameters (`@RequestParam`) where appropriate.

## 4. OpenAPI / SpringDoc Documentation
* **Endpoint Annotations:** Document every public endpoint using standard OpenAPI 3 annotations:
  * `@Tag`: Group endpoints by resource/domain.
  * `@Operation`: Provide a concise `summary` and detailed `description`.
  * `@ApiResponses` / `@ApiResponse`: Document expected success and failure HTTP status codes (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
  * `@Parameter`: Clarify constraints and descriptions for path variables and query parameters.
