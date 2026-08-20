package com.example.bookstore;

import com.example.bookstore.model.Book;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("Bookstore End-to-End Integration Tests")
class BookstoreApplicationIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/books";
    }

    @Test
    @DisplayName("Context loads and pre-populates initial seed books")
    void contextLoads_andReturnsSeedBooks() {
        ResponseEntity<Book[]> response = restTemplate.getForEntity(getBaseUrl(), Book[].class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSizeGreaterThanOrEqualTo(4);
    }

    @Test
    @DisplayName("Complete CRUD lifecycle test via HTTP")
    void shouldExecuteFullCrudLifecycle() {
        // 1. CREATE
        Book newBook = new Book(null, "E2E Test Book", "Integration Author", "978-9999999999",
                new BigDecimal("29.99"), LocalDate.of(2024, 1, 1), "Integration", 10);

        ResponseEntity<Book> createResponse = restTemplate.postForEntity(getBaseUrl(), newBook, Book.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getHeaders().getLocation()).isNotNull();
        Book created = createResponse.getBody();
        assertThat(created).isNotNull();
        Long id = created.id();
        assertThat(id).isNotNull();

        // 2. READ
        ResponseEntity<Book> getResponse = restTemplate.getForEntity(getBaseUrl() + "/" + id, Book.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).isNotNull();
        assertThat(getResponse.getBody().title()).isEqualTo("E2E Test Book");

        // 3. SEARCH
        ResponseEntity<Book[]> searchResponse = restTemplate.getForEntity(getBaseUrl() + "/search?q=E2E", Book[].class);
        assertThat(searchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(searchResponse.getBody()).isNotEmpty();

        // 4. DELETE
        restTemplate.delete(getBaseUrl() + "/" + id);

        // 5. VERIFY DELETION
        ResponseEntity<Book> verifyDeleteResponse = restTemplate.getForEntity(getBaseUrl() + "/" + id, Book.class);
        assertThat(verifyDeleteResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Validation failure returns 400 Bad Request with field errors")
    void invalidBookPayload_shouldReturn400() {
        Book invalidBook = new Book(null, "", "Author", "ISBN", new BigDecimal("-5.00"),
                LocalDate.now(), "", -1);

        ResponseEntity<Map> response = restTemplate.postForEntity(getBaseUrl(), invalidBook, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).containsKey("title");
        assertThat(response.getBody()).containsKey("price");
        assertThat(response.getBody()).containsKey("genre");
        assertThat(response.getBody()).containsKey("stock");
    }
}
