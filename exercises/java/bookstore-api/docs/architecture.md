# Architecture

## Layer Responsibilities

* **Controller Layer (`BookController`):** Handles incoming HTTP requests and maps them to service methods under `/api/books`. Uses constructor injection and triggers Bean Validation via `@Valid`.
* **Exception Handling (`GlobalExceptionHandler`):** `@ControllerAdvice` that catches `MethodArgumentNotValidException` to return structured field-level error messages with HTTP 400 Bad Request.
* **Service Layer (`BookService`):** Contains business logic, query filtering, pagination, and manages the in-memory data store. Pre-seeded with sample books (*The Great Gatsby*, *To Kill a Mockingbird*, *1984*, *Clean Code*).
* **Model Layer (`Book`):** Represents a book entity with Jakarta Bean Validation constraints (`@NotBlank`, `@NotNull`, `@Min`, `@PastOrPresent`).

## Data Flow

1. **Request:** Client sends HTTP requests to `/api/books` endpoints.
2. **Validation:** `BookController` validates payloads via `@Valid`. Failed constraints trigger `GlobalExceptionHandler` to respond with `400 Bad Request`.
3. **Execution:** `BookController` delegates valid operations to `BookService`.
4. **State:** `BookService` performs queries or state updates on the thread-safe `ConcurrentHashMap` store.
5. **Response:** Entities and HTTP response codes (`200 OK`, `201 Created`, `204 No Content`, `404 Not Found`) are serialized and returned.
