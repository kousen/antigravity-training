# Bookstore API

A modern Spring Boot REST API for managing books, designed for Gemini CLI training exercises.

## Tech Stack

- **Java 21**
- **Spring Boot 3.5.7**
- **Jakarta Bean Validation**
- **SpringDoc OpenAPI 3 / Swagger UI**
- **JUnit 5, AssertJ, and MockMvc** (56 automated tests)

## Setup & Running

```bash
# Run the application (starts on http://localhost:8080)
mvn spring-boot:run

# Run the full test suite
mvn clean test
```

## Documentation

- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI 3 JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- **Architecture Guide:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Agent Guidelines:** [AGENTS.md](AGENTS.md)

## API Endpoints

- `GET /api/books` - List all books (supports `page`, `size`, `sortBy`)
- `GET /api/books/{id}` - Get a specific book by ID
- `GET /api/books/search?q=query` - Search books by title
- `GET /api/books/author/{author}` - Filter books by author
- `GET /api/books/genre/{genre}` - Filter books by genre
- `GET /api/books/in-stock` - Get books in stock
- `POST /api/books` - Create a new book (`Location` header returned)
- `PUT /api/books/{id}` - Update an existing book
- `DELETE /api/books/{id}` - Delete a book

## Completed Exercise Goals

1. ✅ **Spring Boot Architecture:** Layered REST controller, service, immutable Java 21 `record` domain model.
2. ✅ **Input Validation:** Jakarta Bean Validation (`@NotBlank`, `@NotNull`, `@Min`, `@PastOrPresent`, `@DecimalMin`, `@Digits`, `@Positive`).
3. ✅ **Exception Handling:** Centralized `@RestControllerAdvice` handling validation errors, type mismatches, missing parameters, and malformed JSON.
4. ✅ **Testing:** 56 tests across integration (`@SpringBootTest`), controller slice (`@WebMvcTest`), service unit (`AssertJ`), and model validation test suites.
5. ✅ **OpenAPI/Swagger:** Interactive Swagger UI and OpenAPI 3 spec.
6. ✅ **Pagination & Sorting:** Validated pagination with integer overflow protection and multiple sort fields.
7. 🔄 **Current Sprint Focus:** Implementing Caching (Spring Cache abstraction).
