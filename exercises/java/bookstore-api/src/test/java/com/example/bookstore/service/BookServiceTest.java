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
        assertThat(bookService.getBooksPage(null, null, null, null, 0, 4, "author").content().get(0).author())
                .isEqualTo("F. Scott Fitzgerald");
        assertThat(bookService.getBooksPage(null, null, null, null, 0, 4, "price").content().get(0).price())
                .isEqualTo(new BigDecimal("11.99"));
        assertThat(bookService.getBooksPage(null, null, null, null, 0, 4, "publisheddate").content().get(0).publishedDate())
                .isEqualTo(LocalDate.of(1925, 4, 10));
        assertThat(bookService.getBooksPage(null, null, null, null, 0, 4, "genre").content().get(0).genre())
                .isEqualTo("Dystopian");
        assertThat(bookService.getBooksPage(null, null, null, null, 0, 4, "stock").content().get(0).stock())
                .isEqualTo(15);
        assertThat(bookService.getBooksPage(null, null, null, null, 0, 4, "unknown").content().get(0).id())
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
    @DisplayName("Should clear publishedDate when null in BookRequest")
    void shouldClearOptionalPublishedDateOnUpdate() {
        BookRequest clearDateRequest = new BookRequest(
                "The Great Gatsby",
                "F. Scott Fitzgerald",
                "978-0743273565",
                new BigDecimal("14.99"),
                null,
                "Fiction",
                25
        );

        Optional<Book> result = bookService.updateBook(1L, clearDateRequest);
        assertThat(result).isPresent();
        assertThat(result.get().getPublishedDate()).isNull();

        assertThat(bookService.updateBook(9999L, clearDateRequest)).isEmpty();
    }

    @Test
    @DisplayName("Should prevent integer overflow with very large page and size")
    void shouldPreventIntegerOverflowInPagination() {
        PageResponse<BookResponse> response = PageResponse.of(
                List.of(), 2, Integer.MAX_VALUE);
        assertThat(response.content()).isEmpty();
        assertThat(response.page()).isEqualTo(2);
        assertThat(response.totalElements()).isEqualTo(0);
    }
}
