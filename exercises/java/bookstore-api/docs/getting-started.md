# Getting Started

## Prerequisites
* Java 21 or compatible JDK (e.g. JDK 21, JDK 25)
* Apache Maven 3.9+ (or system Maven)

## Building the Project
```bash
mvn clean package
```

## Running Tests
Run the entire test suite (unit tests, MVC slice tests, and full-stack integration tests):
```bash
mvn clean test
```

To run an individual test suite:
```bash
# Service unit tests
mvn test -Dtest=BookServiceTest

# Controller slice tests
mvn test -Dtest=BookControllerTest

# End-to-end integration tests
mvn test -Dtest=BookstoreIntegrationTest
```

## Running the Application
```bash
mvn spring-boot:run
```
The application starts on port `8080` by default.

## Interactive API Documentation
Once running, explore and test the endpoints via Swagger UI:
* **Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **OpenAPI 3 JSON:** `http://localhost:8080/v3/api-docs`
