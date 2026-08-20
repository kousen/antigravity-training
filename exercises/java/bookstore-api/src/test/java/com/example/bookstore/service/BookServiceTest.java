package com.example.bookstore.service;

import com.example.bookstore.model.Book;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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

    @Nested
    @DisplayName("Initial State & Book Creation")
    class CreationAndRetrievalTests {

        @Test
        @DisplayName("Constructor should populate default seed books")
        void shouldInitializeWithSeedBooks() {
            List<Book> books = bookService.getAllBooks();
            assertThat(books).hasSize(4);
        }

        @Test
        @DisplayName("addBook should generate sequential ID and store book")
        void shouldAddBookSuccessfully() {
            Book book = bookService.addBook(
                    "Domain-Driven Design",
                    "Eric Evans",
                    "978-0321125217",
                    new BigDecimal("45.00"),
                    LocalDate.of(2003, 8, 30),
                    "Technical",
                    12
            );

            assertThat(book).isNotNull();
            assertThat(book.getId()).isEqualTo(5L);
            assertThat(book.getTitle()).isEqualTo("Domain-Driven Design");
            assertThat(bookService.getAllBooks()).hasSize(5);
        }

        @Test
        @DisplayName("getBook should return book when ID exists")
        void shouldReturnBookWhenIdExists() {
            Optional<Book> bookOpt = bookService.getBook(1L);
            assertThat(bookOpt).isPresent();
            assertThat(bookOpt.get().getTitle()).isEqualTo("The Great Gatsby");
        }

        @Test
        @DisplayName("getBook should return empty Optional when ID does not exist")
        void shouldReturnEmptyWhenIdDoesNotExist() {
            Optional<Book> bookOpt = bookService.getBook(999L);
            assertThat(bookOpt).isEmpty();
        }
    }

    @Nested
    @DisplayName("Pagination and Sorting")
    class PaginationAndSortingTests {

        @Test
        @DisplayName("getAllBooks with pagination should return requested slice")
        void shouldPaginateBooks() {
            List<Book> page0 = bookService.getAllBooks(0, 2, "id");
            assertThat(page0).hasSize(2);
            assertThat(page0.get(0).getId()).isEqualTo(1L);
            assertThat(page0.get(1).getId()).isEqualTo(2L);

            List<Book> page1 = bookService.getAllBooks(1, 2, "id");
            assertThat(page1).hasSize(2);
            assertThat(page1.get(0).getId()).isEqualTo(3L);
            assertThat(page1.get(1).getId()).isEqualTo(4L);

            List<Book> pageOut = bookService.getAllBooks(10, 2, "id");
            assertThat(pageOut).isEmpty();
        }

        @Test
        @DisplayName("getAllBooks sorted by title should sort alphabetically")
        void shouldSortByTitle() {
            List<Book> books = bookService.getAllBooks(0, 10, "title");
            assertThat(books).extracting(Book::getTitle)
                    .containsExactly("1984", "Clean Code", "The Great Gatsby", "To Kill a Mockingbird");
        }

        @Test
        @DisplayName("getAllBooks sorted by price should sort ascending")
        void shouldSortByPrice() {
            List<Book> books = bookService.getAllBooks(0, 10, "price");
            assertThat(books).extracting(Book::getPrice)
                    .containsExactly(
                            new BigDecimal("11.99"),
                            new BigDecimal("12.99"),
                            new BigDecimal("14.99"),
                            new BigDecimal("39.99")
                    );
        }

        @Test
        @DisplayName("getAllBooks sorted by publishedDate should sort ascending")
        void shouldSortByPublishedDate() {
            List<Book> books = bookService.getAllBooks(0, 10, "publishedDate");
            assertThat(books).extracting(Book::getPublishedDate)
                    .containsExactly(
                            LocalDate.of(1925, 4, 10),
                            LocalDate.of(1949, 6, 8),
                            LocalDate.of(1960, 7, 11),
                            LocalDate.of(2008, 8, 1)
                    );
        }

        @Test
        @DisplayName("getAllBooks sorted by author should sort alphabetically")
        void shouldSortByAuthor() {
            List<Book> books = bookService.getAllBooks(0, 10, "author");
            assertThat(books).extracting(Book::getAuthor)
                    .containsExactly(
                            "F. Scott Fitzgerald",
                            "George Orwell",
                            "Harper Lee",
                            "Robert C. Martin"
                    );
        }

        @Test
        @DisplayName("getAllBooks sorted by genre should sort alphabetically")
        void shouldSortByGenre() {
            List<Book> books = bookService.getAllBooks(0, 10, "genre");
            assertThat(books).extracting(Book::getGenre)
                    .containsExactly("Dystopian", "Fiction", "Fiction", "Technical");
        }

        @Test
        @DisplayName("getAllBooks sorted by stock should sort ascending")
        void shouldSortByStock() {
            List<Book> books = bookService.getAllBooks(0, 10, "stock");
            assertThat(books).extracting(Book::getStock)
                    .containsExactly(15, 18, 25, 30);
        }
    }

    @Nested
    @DisplayName("Query & Search Operations")
    class SearchAndFilterTests {

        @Test
        @DisplayName("searchByTitle should perform case-insensitive substring matching")
        void shouldSearchByTitle() {
            List<Book> results = bookService.searchByTitle("great");
            assertThat(results).hasSize(1);
            assertThat(results.get(0).getTitle()).isEqualTo("The Great Gatsby");

            List<Book> noMatch = bookService.searchByTitle("NonExistent");
            assertThat(noMatch).isEmpty();
        }

        @Test
        @DisplayName("getByAuthor should return all books by author case-insensitively")
        void shouldGetByAuthor() {
            List<Book> results = bookService.getByAuthor("harper lee");
            assertThat(results).hasSize(1);
            assertThat(results.get(0).getTitle()).isEqualTo("To Kill a Mockingbird");
        }

        @Test
        @DisplayName("getByGenre should return books matching genre case-insensitively")
        void shouldGetByGenre() {
            List<Book> results = bookService.getByGenre("fiction");
            assertThat(results).hasSize(2)
                    .extracting(Book::getTitle)
                    .containsExactlyInAnyOrder("The Great Gatsby", "To Kill a Mockingbird");
        }

        @Test
        @DisplayName("getInStockBooks should only return books with stock greater than 0")
        void shouldReturnInStockBooks() {
            bookService.addBook("Out of stock book", "Author", "ISBN-000",
                    BigDecimal.TEN, LocalDate.of(2020, 1, 1), "Genre", 0);

            List<Book> inStock = bookService.getInStockBooks();
            assertThat(inStock).hasSize(4);
            assertThat(inStock).allMatch(b -> b.getStock() > 0);
        }
    }

    @Nested
    @DisplayName("Update & Delete Operations")
    class UpdateAndDeleteTests {

        @Test
        @DisplayName("updateBook should atomically update provided fields")
        void shouldUpdateBookAtomically() {
            Book updates = new Book(null, "The Great Gatsby - Remastered", null, null,
                    new BigDecimal("19.99"), null, null, 50);

            Optional<Book> updatedOpt = bookService.updateBook(1L, updates);

            assertThat(updatedOpt).isPresent();
            Book updated = updatedOpt.get();
            assertThat(updated.getTitle()).isEqualTo("The Great Gatsby - Remastered");
            assertThat(updated.getAuthor()).isEqualTo("F. Scott Fitzgerald"); // unchanged
            assertThat(updated.getPrice()).isEqualTo(new BigDecimal("19.99"));
            assertThat(updated.getStock()).isEqualTo(50);
        }

        @Test
        @DisplayName("updateBook should return empty when book does not exist")
        void shouldReturnEmptyOnUpdateNonExistentBook() {
            Book updates = new Book(null, "New Title", null, null, null, null, null, -1);
            Optional<Book> updatedOpt = bookService.updateBook(999L, updates);
            assertThat(updatedOpt).isEmpty();
        }

        @Test
        @DisplayName("deleteBook should remove book and return true when found")
        void shouldDeleteBookSuccessfully() {
            boolean deleted = bookService.deleteBook(1L);
            assertThat(deleted).isTrue();
            assertThat(bookService.getBook(1L)).isEmpty();
            assertThat(bookService.getAllBooks()).hasSize(3);
        }

        @Test
        @DisplayName("deleteBook should return false when book not found")
        void shouldReturnFalseWhenDeletingMissingBook() {
            boolean deleted = bookService.deleteBook(999L);
            assertThat(deleted).isFalse();
        }
    }
}
