# Bookstore API - Agent Guidelines & Architecture Guide

This file provides context, architectural patterns, and development instructions for AI coding agents (Antigravity, Claude Code, etc.) interacting with this codebase.

---

## 1. Project Overview & Tech Stack

* **Language / Runtime:** Java 21+
* **Framework:** Spring Boot 3.5.7 (`spring-boot-starter-web`, `spring-boot-starter-validation`)
* **API Documentation:** SpringDoc OpenAPI 3 UI (`2.8.12`)
* **Testing:** JUnit 5, Mockito (`@MockitoBean`), MockMvc, AssertJ, Spring Boot Test (`spring-boot-starter-test`)
* **Coverage:** `jacoco-maven-plugin` (`0.8.12`)
* **Build Tool:** Apache Maven via wrapper (`./mvnw`)

---

## 2. Essential Commands

```bash
# Build the application
./mvnw clean compile

# Run all tests (unit, slice, integration) and generate JaCoCo report
./mvnw test

# Run tests with clean verification
./mvnw clean test

# Run the Spring Boot application locally
./mvnw spring-boot:run

# Inspect JaCoCo HTML report
open target/site/jacoco/index.html
```

When the application is running:
* **Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **OpenAPI 3 JSON Spec:** `http://localhost:8080/api-docs`

---

## 3. Architecture & Design Principles

### Layering & Separation of Concerns

```
HTTP Request / Response
         ↓
Presentation Layer (Controller & Exception Handling)
  - BookController (@RestController)
  - GlobalExceptionHandler (@RestControllerAdvice)
         ↓
DTO Layer (Contracts)
  - BookRequest (Java 21 Record, Jakarta Validation)
  - BookResponse (Java 21 Record)
  - PageResponse<T> (Java 21 Record, Pagination Metadata)
         ↓
Business & Persistence Layer (Service & Domain Entity)
  - BookService (@Service, ConcurrentHashMap, AtomicLong)
  - Book (Domain Entity)
```

### Key Conventions

1. **DTOs via Java 21 Records:**
   * Always use immutable Java 21 `record`s for client-facing request and response payloads.
   * Never leak internal domain entities (`Book`) directly across HTTP controllers.
   * Input validation annotations belong on the `BookRequest` record, not on domain entities.

2. **HTTP & REST Semantics:**
   * `POST /api/books`: Returns `201 Created` with a `Location: /api/books/{id}` header constructed via `ServletUriComponentsBuilder`.
   * `PUT /api/books/{id}`: Replaces the resource atomically via `ConcurrentHashMap.replace(id, updated)`. Allows clearing optional fields (e.g. `publishedDate`).
   * `DELETE /api/books/{id}`: Returns `204 No Content` on success.
   * Missing resources: Always throw `BookNotFoundException(id)` instead of returning `null` or raw `ResponseEntity.notFound()`.

3. **Error Handling (RFC 7807 / RFC 9457 ProblemDetail):**
   * Centralized in `GlobalExceptionHandler` extending `ResponseEntityExceptionHandler`.
   * Field validation failures return HTTP 400 with an `invalidFields` map property.
   * Resource not found returns HTTP 404 ProblemDetail.
   * Catch-all `Exception.class` logs the error stack trace via SLF4J (`log.error`) before returning HTTP 500 ProblemDetail.

4. **Safe Pagination & Sorting:**
   * Use `PageResponse<T>` for paginated responses to include page metadata (`page`, `size`, `totalElements`, `totalPages`, `first`, `last`).
   * Calculate sublist bounds using 64-bit safe math `(long) page * size` to prevent integer overflow.

5. **Dependency Injection & State:**
   * Use constructor injection exclusively (no `@Autowired` field injection).
   * In-memory persistence uses thread-safe collections (`ConcurrentHashMap`, `AtomicLong`).

---

## 4. Testing Strategy & Standards

Follow the three-tier Spring testing pyramid:

1. **Unit Tests (`BookServiceTest.java`):**
   * Fast, pure POJO tests without Spring container overhead (~30 ms).
   * Test business logic, math calculations, and corner cases directly.
2. **Slice Tests (`BookControllerTest.java`):**
   * Use `@WebMvcTest(BookController.class)` with `MockMvc`.
   * Mock service dependencies using `@MockitoBean` (Spring Boot 3.4+ / 3.5 standard).
   * Test routing, Jackson serialization, Jakarta Bean Validation, and HTTP status codes.
3. **Integration / Functional Tests (`BookstoreApplicationTests.java`):**
   * Use `@SpringBootTest(webEnvironment = RANDOM_PORT)` with `TestRestTemplate`.
   * Test complete end-to-end user workflows against a real embedded Tomcat server with zero mocks.
   * Verify OpenAPI documentation availability at `/api-docs`.

---

## 5. Key Documentation Files

* [`README.md`](README.md): Exercise instructions and endpoint summary.
* [`ARCHITECTURE.md`](ARCHITECTURE.md): Architectural diagrams, component interactions, and sequence flows.
