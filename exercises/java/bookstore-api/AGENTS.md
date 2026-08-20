# AGENTS.md

## Project Overview

**Bookstore API** is a Spring Boot REST API designed as an educational exercise for AI coding assistants and agent workflows. It provides a complete CRUD and query interface for managing a bookstore catalog with built-in validation, exception handling, and OpenAPI documentation.

---

## Tech Stack

* **Language & Runtime:** Java 21
* **Framework:** Spring Boot 3.5.7 (`spring-boot-starter-parent`)
* **Web & REST:** Spring MVC (`spring-boot-starter-web`) on embedded Apache Tomcat
* **Validation:** Jakarta Bean Validation / Hibernate Validator (`spring-boot-starter-validation`)
* **API Documentation:** SpringDoc OpenAPI / Swagger UI (`springdoc-openapi-starter-webmvc-ui` 2.8.12)
* **Testing:** JUnit 5 (Jupiter), AssertJ, Spring Test (`MockMvc`, `@WebMvcTest`, `@MockitoBean`), Mockito
* **Build Tool:** Apache Maven (`pom.xml`)
* **Persistence:** In-memory storage using `ConcurrentHashMap` and `AtomicLong` (data resets on application restart)

---

## Project Structure

```text
bookstore-api/
├── pom.xml
├── README.md
├── ARCHITECTURE.md
├── AGENTS.md
└── src/
    ├── main/java/com/example/bookstore/
    │   ├── BookstoreApplication.java       # Main Spring Boot bootstrap entry point
    │   ├── controller/
    │   │   ├── BookController.java         # REST Controller exposing /api/books
    │   │   └── GlobalExceptionHandler.java # @ControllerAdvice / @RestControllerAdvice for validation errors
    │   ├── model/
    │   │   └── Book.java                   # Book domain model with Bean Validation
    │   └── service/
    │       └── BookService.java            # In-memory business logic & data operations
    └── test/java/com/example/bookstore/
        └── controller/
            └── BookControllerTest.java     # WebMvc slice tests using MockMvc & @MockitoBean
```

---

## Build, Run, and Test Commands

### Running the Application
```bash
# Start the Spring Boot application on port 8080
mvn spring-boot:run
```

### Running Tests
```bash
# Run all tests
mvn test

# Run a specific test class
mvn test -Dtest=BookControllerTest

# Run a single test method
mvn test -Dtest=BookControllerTest#getAllBooks_shouldReturnListOfBooks
```

### Building & Packaging
```bash
# Clean build and compile
mvn clean compile

# Package executable JAR
mvn clean package -DskipTests
```

---

## API Endpoints & Documentation

When running locally (`http://localhost:8080`):
* **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **OpenAPI 3 Spec:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Endpoints

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/books` | Get all books (supports `page`, `size`, `sortBy` query params) |
| `GET` | `/api/books/{id}` | Get book by ID |
| `GET` | `/api/books/search?q={query}` | Search books by title (case-insensitive substring) |
| `GET` | `/api/books/author/{author}` | Filter books by author |
| `GET` | `/api/books/genre/{genre}` | Filter books by genre |
| `GET` | `/api/books/in-stock` | Retrieve all books with stock > 0 |
| `POST` | `/api/books` | Create a new book (`@Valid` JSON body required) |
| `PUT` | `/api/books/{id}` | Update existing book by ID (`@Valid` JSON body required) |
| `DELETE` | `/api/books/{id}` | Delete book by ID |

---

## Team Coding Standards & Conventions

* **Style & Formatting:** Follow Google Java Style Guide / standard Spring idiomatic conventions (2 or 4-space indentation, clear camelCase naming, descriptive method/class names).
* **Dependency Injection:** Mandatory constructor-based injection (`final` fields); avoid `@Autowired` field injection.
* **Immutability & Data Transfer:** Favor immutable Java 21 `record`s for request/response DTOs rather than mutable POJOs.
* **Modern Java 21 Features:** Utilize pattern matching, `record` patterns, `Stream.toList()`, and `var` (where local type inference aids readability).
* **Error Handling:** Centralize exception mapping using `@RestControllerAdvice` and RFC 7807 `ProblemDetail` or structured JSON payloads.
* **Validation:** Apply explicit Jakarta validation constraints (`@NotBlank`, `@NotNull`, `@Min`, `@PastOrPresent`, `@PositiveOrZero`) at API boundaries.
* **Documentation:** Keep OpenAPI/Swagger documentation (`@Tag`, `@Operation`, `@ApiResponse`, `@Schema`) and public Javadocs accurate and up-to-date.

---

## Preferred Testing Frameworks & Patterns

* **Core Test Stack:** JUnit 5 (Jupiter), AssertJ, and Mockito.
* **Assertion Style:** Use **AssertJ** fluent assertions (`assertThat(...)`) instead of legacy JUnit assertions (`assertEquals`).
* **Test Structure:** Follow the **Arrange-Act-Assert (AAA)** or **Given-When-Then (BDD)** test pattern with readable test names (e.g. `getBook_whenIdExists_shouldReturnBook()`).
* **Spring MVC Slice Testing:**
  * Use `@WebMvcTest(TargetController.class)` for controller layer tests.
  * Inject mocks via `@MockitoBean` (standard for Spring Boot 3.4+ / 4.0; do not use legacy `@MockBean`).
  * Verify HTTP status codes, headers, and JSON body paths using `MockMvc` + JsonPath assertions.
* **Unit Testing:**
  * Test service/business logic in pure JUnit 5 unit tests with Mockito (avoiding slow Spring Context loading for pure unit logic).

---

## Current Sprint Focus: Implementing Caching

**Goal:** Integrate Spring's Cache Abstraction to improve read performance and minimize redundant in-memory scans.

### Key Objectives:
1. **Enable Caching:** Add `@EnableCaching` to application configuration / `BookstoreApplication`.
2. **Cache Names & Configuration:**
   * Configure cache regions (e.g., `"books"`, `"booksById"`, `"booksByGenre"`).
   * Consider adding `spring-boot-starter-cache` with a lightweight provider (e.g., Caffeine or Simple ConcurrentMap cache).
3. **Annotate Service Methods:**
   * Apply `@Cacheable(value = "booksById", key = "#id")` on `getBook(Long id)`.
   * Apply `@Cacheable(value = "books")` on catalog queries with appropriate cache keys.
4. **Cache Invalidation & Eviction:**
   * Use `@CacheEvict` / `@CachePut` on `addBook`, `updateBook`, and `deleteBook` to maintain cache coherence and prevent stale reads.
5. **Testing & Verification:**
   * Add automated tests verifying that cached methods bypass service computation/store lookups on repeated invocations.

---

## Code Review Checklist

Before opening a PR or finalizing code changes, verify:

- [ ] **Architecture & DI:** Constructor injection is used for all dependencies; no `@Autowired` on private fields.
- [ ] **Data Contracts & Immutability:** DTOs are defined as immutable Java `record`s where appropriate.
- [ ] **Validation:** Input arguments are annotated with `@Valid` and appropriate Jakarta validation constraints.
- [ ] **Error Handling:** Appropriate HTTP status codes are returned (e.g., `200`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`).
- [ ] **Testing:** All new features and bugfixes include JUnit 5 tests with AssertJ assertions; `@MockitoBean` is used for Spring slice mocks.
- [ ] **Caching Coherence (Current Sprint):** Write operations properly evict or update relevant cache entries; no stale cache bugs.
- [ ] **Thread Safety:** Shared mutable state is guarded or managed with thread-safe abstractions.
- [ ] **Documentation:** OpenAPI annotations (`@Operation`, `@ApiResponse`) and Javadocs are updated.
- [ ] **Build & Test Green:** `mvn clean test` compiles cleanly with zero warnings/failures.
