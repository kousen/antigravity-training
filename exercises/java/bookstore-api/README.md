# Bookstore API

A Spring Boot REST API for managing books. It is designed as an educational project for Gemini CLI training exercises. It simulates a bookstore backend allowing users to manage a collection of books.

## Prerequisites
- Java 21 or compatible JDK
- Maven (or use the provided `mvnw` wrapper)

## Installation & Setup
1. Navigate to the root folder of the project.
2. Build the project using Maven:
   ```bash
   ./mvnw clean install
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
The application will start on the default port `8080`.

## Quick Start
Send a simple `GET` request to see the pre-loaded inventory of books:
```bash
curl -X GET http://localhost:8080/api/books
```

## Key Features
- **In-Memory Storage:** Uses `ConcurrentHashMap` for fast, temporary data retention (data resets on restart).
- **RESTful Endpoints:** Full CRUD capabilities for managing books.
- **Search & Filtering:** Search by query, author, genre, and stock availability.
- **Modern Stack:** Built on Java 21 and Spring Boot 3.2.0 Web.
- **Data Validation:** Bean Validation support (e.g., `@NotNull`, `@Size`).

## Configuration
The project is configured to run out-of-the-box on `localhost:8080`. It requires no external database or complex environment variables since it leverages an in-memory data store.

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

## Exercise Goals
Use Gemini CLI to explore and enhance the application:
1. **Architecture Exploration:** Understand the Spring Boot setup
2. **Input Validation:** Add Bean Validation to the `Book` model
3. **Exception Handling:** Implement `@ControllerAdvice` for global error handling
4. **Testing:** Create comprehensive JUnit 5 tests
5. **Documentation:** Add OpenAPI/Swagger documentation
6. **Pagination:** Implement pagination for book listings
7. **Reviews:** Add a review/rating system for books
