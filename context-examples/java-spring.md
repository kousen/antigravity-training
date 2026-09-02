# Java Spring Boot Project

## Project Overview
This is a Spring Boot 3.x REST API application.

## Tech Stack
- **Java**: 21 (LTS)
- **Framework**: Spring Boot 3.2.x
- **Build**: Maven
- **Database**: PostgreSQL with Spring Data JPA
- **Testing**: JUnit 5, Mockito, TestContainers
- **API Docs**: SpringDoc OpenAPI

## Project Structure
```
src/main/java/com/example/app/
├── Application.java           # Main application class
├── config/                    # Configuration classes
├── controller/                # REST controllers
├── dto/                       # Data Transfer Objects
├── entity/                    # JPA entities
├── exception/                 # Custom exceptions
├── repository/                # Spring Data repositories
├── service/                   # Business logic services
└── util/                      # Utility classes
src/main/resources/
├── application.yml            # Main configuration
├── application-dev.yml        # Development profile
└── application-prod.yml       # Production profile
src/test/java/
├── unit/                      # Unit tests
└── integration/               # Integration tests
```

## Coding Standards

### General
- Use constructor injection (not @Autowired field injection)
- Prefer records for DTOs and immutable data
- Use Optional for nullable return values
- Follow Google Java Style Guide

### Package Structure
- One public class per file
- Package names in lowercase
- Group related classes in sub-packages

### Documentation
- JavaDoc for all public classes and methods
- Include @param, @return, @throws tags
- Add examples for complex methods

### Error Handling
- Use @ControllerAdvice for global exception handling
- Create specific exception classes extending RuntimeException
- Return ProblemDetail responses (RFC 7807)

### Testing
- Aim for 80%+ code coverage
- Use @SpringBootTest sparingly (prefer unit tests)
- Use TestContainers for database tests
- Follow Given-When-Then pattern in test names

## API Conventions

### Endpoints
- RESTful resource naming
- Use @RestController and @RequestMapping
- Version via URL path: `/api/v1/...`

### Validation
- Use Bean Validation (@Valid, @NotNull, etc.)
- Custom validators for complex rules
- Return 400 with validation error details

### Responses
- Use ResponseEntity for control over status codes
- DTO classes for request/response bodies
- Consistent error response format

## Current Sprint
- Implementing OAuth 2.0 authentication
- Adding Actuator endpoints for monitoring
- Setting up Flyway migrations

## Common Commands
```bash
# Build the project
./mvnw clean package

# Run with dev profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Run tests
./mvnw test

# Generate test coverage report
./mvnw jacoco:report
```
