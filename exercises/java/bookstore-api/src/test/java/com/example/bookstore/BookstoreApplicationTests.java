package com.example.bookstore;

import com.example.bookstore.dto.BookRequest;
import com.example.bookstore.dto.BookResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookstoreApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl(String path) {
        return "http://localhost:" + port + path;
    }

    @Test
    @DisplayName("Context loads successfully")
    void contextLoads() {
        assertThat(port).isGreaterThan(0);
    }

    @Test
    @DisplayName("OpenAPI JSON documentation endpoint is reachable and valid")
    void openApiDocumentationEndpoint_isAvailable() {
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(
                baseUrl("/api-docs"), JsonNode.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().has("openapi")).isTrue();
        assertThat(response.getBody().get("info").get("title").asText()).isEqualTo("Bookstore API");
    }

    @Test
    @DisplayName("Complete end-to-end book lifecycle without mocks")
    void completeBookLifecycle_endToEnd() {
        // 1. Create a new book
        BookRequest createRequest = new BookRequest(
                "Refactoring",
                "Martin Fowler",
                "978-0201485677",
                new BigDecimal("47.99"),
                LocalDate.of(1999, 7, 8),
                "Software Engineering",
                12
        );

        ResponseEntity<BookResponse> createResponse = restTemplate.postForEntity(
                baseUrl("/api/books"), createRequest, BookResponse.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getHeaders().getLocation()).isNotNull();

        BookResponse createdBook = createResponse.getBody();
        assertThat(createdBook).isNotNull();
        assertThat(createdBook.id()).isNotNull();
        assertThat(createdBook.title()).isEqualTo("Refactoring");
        assertThat(createdBook.inStock()).isTrue();

        URI location = createResponse.getHeaders().getLocation();
        Long createdId = createdBook.id();

        // 2. Fetch the created book by URI
        ResponseEntity<BookResponse> fetchResponse = restTemplate.getForEntity(
                location, BookResponse.class);

        assertThat(fetchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(fetchResponse.getBody()).isNotNull();
        assertThat(fetchResponse.getBody().id()).isEqualTo(createdId);
        assertThat(fetchResponse.getBody().author()).isEqualTo("Martin Fowler");

        // 3. Search for the created book via pagination & search query
        ResponseEntity<JsonNode> searchResponse = restTemplate.getForEntity(
                baseUrl("/api/books?q=Refactoring&page=0&size=5"), JsonNode.class);

        assertThat(searchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode searchBody = searchResponse.getBody();
        assertThat(searchBody).isNotNull();
        assertThat(searchBody.get("content").isArray()).isTrue();
        assertThat(searchBody.get("totalElements").asInt()).isGreaterThanOrEqualTo(1);

        // 4. Update the book
        BookRequest updateRequest = new BookRequest(
                "Refactoring: Second Edition",
                "Martin Fowler",
                "978-0201485677",
                new BigDecimal("52.99"),
                LocalDate.of(2018, 11, 20),
                "Software Engineering",
                20
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<BookRequest> updateEntity = new HttpEntity<>(updateRequest, headers);

        ResponseEntity<BookResponse> updateResponse = restTemplate.exchange(
                baseUrl("/api/books/" + createdId),
                HttpMethod.PUT,
                updateEntity,
                BookResponse.class
        );

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody()).isNotNull();
        assertThat(updateResponse.getBody().title()).isEqualTo("Refactoring: Second Edition");
        assertThat(updateResponse.getBody().price()).isEqualTo(new BigDecimal("52.99"));

        // 5. Delete the book
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                baseUrl("/api/books/" + createdId),
                HttpMethod.DELETE,
                HttpEntity.EMPTY,
                Void.class
        );

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // 6. Verify subsequent GET returns 404 Not Found with RFC 7807 ProblemDetail
        ResponseEntity<JsonNode> notFoundResponse = restTemplate.getForEntity(
                baseUrl("/api/books/" + createdId), JsonNode.class);

        assertThat(notFoundResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        JsonNode notFoundBody = notFoundResponse.getBody();
        assertThat(notFoundBody).isNotNull();
        assertThat(notFoundBody.get("title").asText()).isEqualTo("Resource Not Found");
        assertThat(notFoundBody.get("status").asInt()).isEqualTo(404);
    }

    @Test
    @DisplayName("POST with invalid payload returns RFC 7807 400 Bad Request")
    void postWithInvalidData_returnsProblemDetail() {
        BookRequest invalidRequest = new BookRequest(
                "",
                "",
                "",
                new BigDecimal("-5.00"),
                LocalDate.now().plusYears(1),
                "",
                -1
        );

        ResponseEntity<JsonNode> response = restTemplate.postForEntity(
                baseUrl("/api/books"), invalidRequest, JsonNode.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        JsonNode body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("title").asText()).isEqualTo("Validation Failed");
        assertThat(body.get("status").asInt()).isEqualTo(400);
        assertThat(body.has("invalidFields")).isTrue();
        assertThat(body.get("invalidFields").has("title")).isTrue();
        assertThat(body.get("invalidFields").has("price")).isTrue();
    }
}
