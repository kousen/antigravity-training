package com.example.bookstore;

import com.example.bookstore.model.Book;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookstoreIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @DisplayName("GET /api/books should return seeded books")
    void getAllBooks_returnsInitialBooks() {
        ResponseEntity<List<Book>> response = restTemplate.exchange(
                "/api/books",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().size()).isGreaterThanOrEqualTo(4);
    }

    @Test
    @DisplayName("GET /api/books/{id} should return book when found")
    void getBookById_returnsBook() {
        ResponseEntity<Book> response = restTemplate.getForEntity("/api/books/1", Book.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        assertThat(response.getBody().getTitle()).isEqualTo("The Great Gatsby");
    }

    @Test
    @DisplayName("GET /api/books/{id} should return 404 when book not found")
    void getBookById_returnsNotFound() {
        ResponseEntity<Void> response = restTemplate.getForEntity("/api/books/9999", Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("End-to-End CRUD: create, fetch, update, and delete book")
    void fullCrudLifecycle() {
        // 1. Create
        Book newBook = new Book(
                null,
                "Effective Java",
                "Joshua Bloch",
                "978-0134685991",
                new BigDecimal("45.00"),
                LocalDate.of(2018, 1, 6),
                "Technical",
                12
        );

        ResponseEntity<Book> createResponse = restTemplate.postForEntity("/api/books", newBook, Book.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Book created = createResponse.getBody();
        assertThat(created).isNotNull();
        assertThat(created.getId()).isNotNull();
        Long newId = created.getId();

        // 2. Fetch
        ResponseEntity<Book> fetchResponse = restTemplate.getForEntity("/api/books/" + newId, Book.class);
        assertThat(fetchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(fetchResponse.getBody()).isNotNull();
        assertThat(fetchResponse.getBody().getTitle()).isEqualTo("Effective Java");

        // 3. Update
        Book updates = new Book(
                null,
                "Effective Java 3rd Edition",
                "Joshua Bloch",
                "978-0134685991",
                new BigDecimal("49.99"),
                LocalDate.of(2018, 1, 6),
                "Technical",
                15
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Book> updateRequest = new HttpEntity<>(updates, headers);

        ResponseEntity<Book> updateResponse = restTemplate.exchange(
                "/api/books/" + newId,
                HttpMethod.PUT,
                updateRequest,
                Book.class
        );
        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody()).isNotNull();
        assertThat(updateResponse.getBody().getTitle()).isEqualTo("Effective Java 3rd Edition");
        assertThat(updateResponse.getBody().getPrice()).isEqualByComparingTo("49.99");

        // 4. Delete
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                "/api/books/" + newId,
                HttpMethod.DELETE,
                null,
                Void.class
        );
        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // 5. Confirm deletion
        ResponseEntity<Void> confirmResponse = restTemplate.getForEntity("/api/books/" + newId, Void.class);
        assertThat(confirmResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("POST /api/books with invalid payload should return 400 Bad Request with field errors")
    void createBook_validationFailure() {
        Book invalidBook = new Book(
                null,
                "", // Blank title
                "", // Blank author
                "", // Blank ISBN
                new BigDecimal("-5.00"), // Negative price
                LocalDate.now().plusYears(1), // Future published date
                "", // Blank genre
                -1 // Negative stock
        );

        ResponseEntity<Map<String, String>> response = restTemplate.exchange(
                "/api/books",
                HttpMethod.POST,
                new HttpEntity<>(invalidBook),
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        Map<String, String> errors = response.getBody();
        assertThat(errors).containsKey("title");
        assertThat(errors).containsKey("author");
        assertThat(errors).containsKey("price");
        assertThat(errors.get("title")).isEqualTo("Title cannot be blank");
        assertThat(errors.get("price")).isEqualTo("Price must be non-negative");
    }

    @Test
    @DisplayName("Search & Filter endpoints should return expected subsets")
    void searchAndFilterEndpoints() {
        // Search by query
        ResponseEntity<List<Book>> searchResponse = restTemplate.exchange(
                "/api/books/search?q=Mockingbird",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(searchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(searchResponse.getBody()).isNotEmpty();
        assertThat(searchResponse.getBody().get(0).getTitle()).isEqualTo("To Kill a Mockingbird");

        // Filter by author
        ResponseEntity<List<Book>> authorResponse = restTemplate.exchange(
                "/api/books/author/George Orwell",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(authorResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(authorResponse.getBody()).isNotEmpty();
        assertThat(authorResponse.getBody().get(0).getTitle()).isEqualTo("1984");

        // Filter by genre
        ResponseEntity<List<Book>> genreResponse = restTemplate.exchange(
                "/api/books/genre/Technical",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(genreResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(genreResponse.getBody()).isNotEmpty();
        assertThat(genreResponse.getBody().get(0).getTitle()).isEqualTo("Clean Code");

        // Filter in-stock books
        ResponseEntity<List<Book>> inStockResponse = restTemplate.exchange(
                "/api/books/in-stock",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(inStockResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(inStockResponse.getBody()).isNotEmpty();
        assertThat(inStockResponse.getBody()).allMatch(Book::isInStock);
    }

    @Test
    @DisplayName("GET /api/books with pagination & sorting should return ordered page")
    void paginationAndSorting() {
        ResponseEntity<List<Book>> response = restTemplate.exchange(
                "/api/books?page=0&size=2&sortBy=title",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(2);

        String firstTitle = response.getBody().get(0).getTitle();
        String secondTitle = response.getBody().get(1).getTitle();
        assertThat(firstTitle.compareToIgnoreCase(secondTitle)).isLessThanOrEqualTo(0);
    }
}
