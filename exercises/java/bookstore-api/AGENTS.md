# Project: Bookstore API

## Overview
This project is a Spring Boot REST API designed for educational purposes, specifically for training with the Gemini CLI and Google Antigravity. It simulates a bookstore backend allowing users to manage a collection of books.

**Key Characteristics:**
* **Framework:** Spring Boot 4.1.1 (Spring Web MVC)
* **Language:** Java 21 (bytecode target release 21, compatible with JDK 21 through JDK 25)
* **Build Tool:** Apache Maven (`pom.xml`)
* **JSON Engine:** Jackson 3 (`tools.jackson`)
* **API Documentation:** SpringDoc OpenAPI 3.1.0 (`springdoc-openapi-starter-webmvc-ui`)
* **Testing:** JUnit 5, AssertJ, Mockito (`@MockitoBean`), MockMvc slice testing, and `TestRestTemplate` integration testing
* **Persistence:** In-memory thread-safe storage (using `ConcurrentHashMap` and `AtomicLong` in `BookService`).
* **Purpose:** Serves as a hands-on base for practicing software engineering workflows including Bean validation, exception handling, layered testing, API documentation, pagination, and framework migrations.

---

## Documentation & Rules Index

To keep the agent context window efficient (progressive disclosure), detailed specifications and workflows are modularized into dedicated documents:

* **[Architecture](docs/architecture.md):** Layer responsibilities (`BookController`, `BookService`, `Book`, `GlobalExceptionHandler`) and end-to-end data flow.
* **[Getting Started](docs/getting-started.md):** Build commands, test execution targets, running the application, and Swagger UI endpoints.
* **[API Reference](docs/api-reference.md):** REST endpoints table, query parameters, request bodies, and expected HTTP responses.
* **[Coding Standards](docs/coding-standards.md):** Team conventions for dependency injection, test assertions, immutability, and validation.
