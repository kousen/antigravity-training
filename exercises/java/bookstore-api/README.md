# Bookstore API

A Spring Boot REST API for managing books, designed for Antigravity CLI training exercises.

## Setup

```bash
./mvnw spring-boot:run
```

## API Endpoints

- `GET /api/books` - List all books
- `GET /api/books/{id}` - Get a specific book
- `GET /api/books/search?q=query` - Search by title
- `GET /api/books/author/{author}` - Get by author
- `GET /api/books/genre/{genre}` - Get by genre
- `GET /api/books/in-stock` - Get books in stock
- `POST /api/books` - Create a new book
- `PUT /api/books/{id}` - Update a book
- `DELETE /api/books/{id}` - Delete a book

## Exercise Goals

Use Antigravity CLI to:
1. Explore the Spring Boot architecture
2. Add input validation with Bean Validation
3. Add proper exception handling with @ControllerAdvice
4. Create comprehensive JUnit 5 tests
5. Add OpenAPI/Swagger documentation
6. Implement pagination for book listings
7. Add a review/rating system for books
