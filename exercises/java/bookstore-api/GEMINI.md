# Project: Bookstore API

## Overview
This project is a Spring Boot REST API designed for educational purposes, specifically for training with the Antigravity CLI. It simulates a bookstore backend allowing users to manage a collection of books.

**Key Characteristics:**
*   **Framework:** Spring Boot 3.2.0 (Web)
*   **Language:** Java 21
*   **Build Tool:** Maven
*   **Persistence:** In-memory storage (using `ConcurrentHashMap` in `BookService`), meaning data is lost when the application restarts.
*   **Purpose:** To serve as a base for practicing software engineering tasks like adding validation, exception handling, testing, and documentation.

## Architecture

*   **Controller Layer (`BookController`):** Handles HTTP requests and maps them to service methods. Defines the REST API endpoints.
*   **Service Layer (`BookService`):** Contains business logic and manages the in-memory data store. Pre-loaded with sample data (e.g., "The Great Gatsby", "Clean Code").
*   **Model Layer (`Book`):** Simple POJO representing a book entity with fields like ID, title, author, ISBN, price, etc.

## Getting Started

### Prerequisites
*   Java 21 or compatible JDK
*   Maven (or use the provided `mvnw` wrapper if available, though it was not explicitly seen in the root listing, it is referenced in the README)

### Building the Project
```bash
mvn clean install
```

### Running the Application
```bash
mvn spring-boot:run
```
The application will start on the default port `8080`.

## API Reference

Base URL: `/api/books`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all books |
| `GET` | `/{id}` | Get a specific book by ID |
| `GET` | `/search?q={query}` | Search books by title |
| `GET` | `/author/{author}` | Filter books by author |
| `GET` | `/genre/{genre}` | Filter books by genre |
| `GET` | `/in-stock` | List books currently in stock |
| `POST` | `/` | Create a new book |
| `PUT` | `/{id}` | Update an existing book |
| `DELETE` | `/{id}` | Delete a book |

## Development Conventions

*   **Package Structure:** `com.example.bookstore`
    *   `.controller` for REST controllers
    *   `.model` for data entities
    *   `.service` for business logic
*   **Dependency Injection:** Constructor injection is preferred (as seen in `BookController`).
*   **Data Models:** Mutable POJOs with getters and setters.
*   **Java Features:** Uses standard Java 21 features.

## Exercise Roadmap (Planned Features)

The following areas are intended for development exercises:
1.  **Architecture Exploration:** Understanding the Spring Boot setup.
2.  **Input Validation:** Adding Bean Validation (e.g., `@NotNull`, `@Size`) to the `Book` model.
3.  **Exception Handling:** Implementing `@ControllerAdvice` for global error handling.
4.  **Testing:** Creating JUnit 5 tests (currently `src/test` does not exist).
5.  **Documentation:** Integrating OpenAPI/Swagger.
6.  **Pagination:** Implementing pagination for listing endpoints.
7.  **Reviews:** Adding a system for book ratings and reviews.


## Team's Coding Standards

- Established Java and Spring Boot coding standards
- Established testing standards, favoring JUnit 5 or 6 and AssertJ
- Established documentation standards, favoring Javadoc and OpenAI
- Favor constructor injection over field injection
- Favor immutability over mutability (so records over POJOs for DTOs)
