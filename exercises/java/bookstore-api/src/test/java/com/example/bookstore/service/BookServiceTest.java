package com.example.bookstore.service;

import com.example.bookstore.dto.BookRequest;
import com.example.bookstore.dto.BookResponse;
import com.example.bookstore.dto.PageResponse;
import com.example.bookstore.model.Book;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class BookServiceTest {

    private BookService bookService;

    @BeforeEach
    void setUp() {
        bookService = new BookService();
    }

    @Test
    @DisplayName("Should initialize with seed data")
    void shouldInitializeWithSeedData() {
        List<Book> books = bookService.getAllBooks();
        assertThat(books).hasSize(4);
    }

    @Test
    @DisplayName("Should add new book via BookRequest")
    void shouldAddBook() {
        BookRequest request = new BookRequest(
                "Domain-Driven Design",
                "Eric Evans",
                "978-0321125217",
                new BigDecimal("49.99"),
                LocalDate.of(2003, 8, 30),
                "Software Architecture",
                10
        );

        Book created = bookService.addBook(request);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getTitle()).isEqualTo("Domain-Driven Design");
        assertThat(created.getStock()).isEqualTo(10);
        assertThat(bookService.getBook(created.getId())).isPresent();
    }

    @Test
    @DisplayName("Should retrieve book by ID when present and empty when missing")
    void shouldGetBookById() {
        Optional<Book> found = bookService.getBook(1L);
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("The Great Gatsby");

        Optional<Book> notFound = bookService.getBook(9999L);
        assertThat(notFound).isEmpty();
    }

    @Test
    @DisplayName("Should return paginated and sorted results with metadata")
    void shouldPaginateAndSortBooks() {
        PageResponse<BookResponse> page1 = bookService.getBooksPage(
                null, null, null, null, 0, 2, "title");

        assertThat(page1.content()).hasSize(2);
        assertThat(page1.page()).isEqualTo(0);
        assertThat(page1.size()).isEqualTo(2);
        assertThat(page1.totalElements()).isEqualTo(4);
        assertThat(page1.totalPages()).isEqualTo(2);
        assertThat(page1.first()).isTrue();
        assertThat(page1.last()).isFalse();

        PageResponse<BookResponse> page2 = bookService.getBooksPage(
                null, null, null, null, 1, 2, "title");

        assertThat(page2.content()).hasSize(2);
        assertThat(page2.page()).isEqualTo(1);
        assertThat(page2.first()).isFalse();
        assertThat(page2.last()).isTrue();
    }

    @Test
    @DisplayName("Should search books by title case-insensitively")
    void shouldSearchByTitle() {
        List<Book> results = bookService.searchByTitle("clean");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("Clean Code");
    }

    @Test
    @DisplayName("Should filter books by author")
    void shouldFilterByAuthor() {
        List<Book> results = bookService.getByAuthor("orwell");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getAuthor()).isEqualTo("George Orwell");
    }

    @Test
    @DisplayName("Should filter books by genre")
    void shouldFilterByGenre() {
        List<Book> results = bookService.getByGenre("fiction");
        assertThat(results).hasSize(2);
    }

    @Test
    @DisplayName("Should retrieve only in-stock books")
    void shouldFilterInStockBooks() {
        List<Book> inStock = bookService.getInStockBooks();
        assertThat(inStock).isNotEmpty();
        assertThat(inStock).allMatch(Book::isInStock);
    }

    @Test
    @DisplayName("Should update book details without clobbering unprovided fields")
    void shouldUpdateBook() {
        BookRequest update = new BookRequest(
                "1984 - Special Edition",
                null,
                null,
                new BigDecimal("15.99"),
                null,
                null,
                null
        );

        Optional<Book> updated = bookService.updateBook(3L, update);

        assertThat(updated).isPresent();
        assertThat(updated.get().getTitle()).isEqualTo("1984 - Special Edition");
        assertThat(updated.get().getPrice()).isEqualTo(new BigDecimal("15.99"));
        assertThat(updated.get().getAuthor()).isEqualTo("George Orwell");
        assertThat(updated.get().getStock()).isEqualTo(30);
    }

    @Test
    @DisplayName("Should delete book and return true if existed")
    void shouldDeleteBook() {
        boolean deleted = bookService.deleteBook(1L);
        assertThat(deleted).isTrue();
        assertThat(bookService.getBook(1L)).isEmpty();

        boolean notFoundDeleted = bookService.deleteBook(9999L);
        assertThat(notFoundDeleted).isFalse();
    }

    @Test
    @DisplayName("Should sort books by various fields correctly")
    void shouldSortBooksByDifferentFields() {
        assertThat(bookService.getAllBooks(0, 4, "author").get(0).getAuthor())
                .isEqualTo("F. Scott Fitzgerald");
        assertThat(bookService.getAllBooks(0, 4, "price").get(0).getPrice())
                .isEqualTo(new BigDecimal("11.99"));
        assertThat(bookService.getAllBooks(0, 4, "publisheddate").get(0).getPublishedDate())
                .isEqualTo(LocalDate.of(1925, 4, 10));
        assertThat(bookService.getAllBooks(0, 4, "genre").get(0).getGenre())
                .isEqualTo("Dystopian");
        assertThat(bookService.getAllBooks(0, 4, "stock").get(0).getStock())
                .isEqualTo(15);
        assertThat(bookService.getAllBooks(0, 4, "unknown").get(0).getId())
                .isEqualTo(1L);
    }

    @Test
    @DisplayName("Should gracefully handle null query filters")
    void shouldHandleNullFilters() {
        assertThat(bookService.searchByTitle(null)).isEmpty();
        assertThat(bookService.getByAuthor(null)).isEmpty();
        assertThat(bookService.getByGenre(null)).isEmpty();
    }

    @Test
    @DisplayName("Should update book using domain Book instance")
    void shouldUpdateUsingDomainBook() {
        Book updates = new Book();
        updates.setTitle("Updated Gatsby");
        updates.setStock(50);

        Optional<Book> result = bookService.updateBook(1L, updates);
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Updated Gatsby");
        assertThat(result.get().getStock()).isEqualTo(50);

        assertThat(bookService.updateBook(9999L, updates)).isEmpty();
    }
}
