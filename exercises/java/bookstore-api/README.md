# Bookstore API

A Spring Boot REST API for managing books, designed for Antigravity CLI training exercises.

## Setup

```bash
./mvnw spring-boot:run
```

Once running:
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON Spec:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

## API Endpoints

- `GET /api/books?page=0&size=10&sortBy=id` - Paginated and sorted book listings with optional filter params (`q`, `author`, `genre`, `inStock`)
- `GET /api/books/{id}` - Get a specific book
- `GET /api/books/search?q=query` - Search by title
- `GET /api/books/author/{author}` - Get by author
- `GET /api/books/genre/{genre}` - Get by genre
- `GET /api/books/in-stock` - Get books in stock
- `POST /api/books` - Create a new book (`201 Created` with `Location` header)
- `PUT /api/books/{id}` - Update a book
- `DELETE /api/books/{id}` - Delete a book (`204 No Content`)

## Architectural Highlights

- **Java 21 Records:** Immutable DTOs (`BookRequest`, `BookResponse`, `PageResponse`) separating presentation from internal domain model.
- **Jakarta Bean Validation:** Declarative constraints on request payloads (`@NotBlank`, `@DecimalMin`, `@PastOrPresent`, `@Min`).
- **RFC 7807 / RFC 9457 ProblemDetail:** Standardized error formats for validation failures (400) and missing resources (404).
- **OpenAPI 3 / Swagger Documentation:** Annotations on controllers and DTOs with automated interactive Swagger UI.
- **Testing:** Web slice tests with `@WebMvcTest` and `@MockitoBean`, plus unit tests for `BookService`.

## Exercise Goals

Use Antigravity CLI to:

1. Explore the Spring Boot architecture
2. Add input validation with Bean Validation
3. Add proper exception handling with @ControllerAdvice / RFC 7807 ProblemDetail
4. Create comprehensive JUnit 5 tests
5. Add OpenAPI/Swagger documentation
6. Implement pagination for book listings
7. Add a review/rating system for books
