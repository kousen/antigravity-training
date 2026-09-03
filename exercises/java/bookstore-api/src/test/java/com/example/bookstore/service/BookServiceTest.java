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
    @DisplayName("Initialization & Retrieval Tests")
    class RetrievalTests {

        @Test
        @DisplayName("Should initialize with four sample books")
        void shouldInitializeWithSampleBooks() {
            List<Book> books = bookService.getAllBooks();
            assertThat(books).hasSize(4);
            assertThat(books)
                    .extracting(Book::getTitle)
                    .contains("The Great Gatsby", "To Kill a Mockingbird", "1984", "Clean Code");
        }

        @Test
        @DisplayName("Should find book by ID when present")
        void getBook_whenExists_returnsBook() {
            Optional<Book> book = bookService.getBook(1L);
            assertThat(book).isPresent();
            assertThat(book.get().getTitle()).isEqualTo("The Great Gatsby");
            assertThat(book.get().getAuthor()).isEqualTo("F. Scott Fitzgerald");
        }

        @Test
        @DisplayName("Should return empty Optional when book ID does not exist")
        void getBook_whenDoesNotExist_returnsEmpty() {
            Optional<Book> book = bookService.getBook(999L);
            assertThat(book).isEmpty();
        }
    }

    @Nested
    @DisplayName("Create & Delete Tests")
    class MutationTests {

        @Test
        @DisplayName("Should add new book and auto-increment ID")
        void addBook_createsAndStoresBook() {
            Book created = bookService.addBook(
                    "Designing Data-Intensive Applications",
                    "Martin Kleppmann",
                    "978-1449373320",
                    new BigDecimal("49.99"),
                    LocalDate.of(2017, 3, 16),
                    "Technical",
                    40
            );

            assertThat(created).isNotNull();
            assertThat(created.getId()).isGreaterThan(4L);
            assertThat(created.getTitle()).isEqualTo("Designing Data-Intensive Applications");

            Optional<Book> retrieved = bookService.getBook(created.getId());
            assertThat(retrieved).isPresent();
            assertThat(retrieved.get().getAuthor()).isEqualTo("Martin Kleppmann");
            assertThat(bookService.getAllBooks()).hasSize(5);
        }

        @Test
        @DisplayName("Should delete existing book and return true")
        void deleteBook_whenExists_removesBookAndReturnsTrue() {
            boolean result = bookService.deleteBook(1L);

            assertThat(result).isTrue();
            assertThat(bookService.getBook(1L)).isEmpty();
            assertThat(bookService.getAllBooks()).hasSize(3);
        }

        @Test
        @DisplayName("Should return false when deleting nonexistent book")
        void deleteBook_whenDoesNotExist_returnsFalse() {
            boolean result = bookService.deleteBook(999L);

            assertThat(result).isFalse();
            assertThat(bookService.getAllBooks()).hasSize(4);
        }
    }

    @Nested
    @DisplayName("Update Tests")
    class UpdateTests {

        @Test
        @DisplayName("Should update all provided non-null fields on existing book")
        void updateBook_updatesFields() {
            Book updates = new Book(
                    null,
                    "Clean Code 2nd Edition",
                    "Uncle Bob",
                    "978-0132350889",
                    new BigDecimal("44.99"),
                    LocalDate.of(2023, 1, 1),
                    "Software Engineering",
                    20
            );

            Optional<Book> updated = bookService.updateBook(4L, updates);

            assertThat(updated).isPresent();
            assertThat(updated.get().getTitle()).isEqualTo("Clean Code 2nd Edition");
            assertThat(updated.get().getAuthor()).isEqualTo("Uncle Bob");
            assertThat(updated.get().getPrice()).isEqualByComparingTo("44.99");
            assertThat(updated.get().getGenre()).isEqualTo("Software Engineering");
            assertThat(updated.get().getStock()).isEqualTo(20);
        }

        @Test
        @DisplayName("Should only update non-null fields and preserve existing values")
        void updateBook_partialUpdatePreservesUnchangedFields() {
            Book partialUpdate = new Book();
            partialUpdate.setPrice(new BigDecimal("19.99"));
            partialUpdate.setStock(-1); // negative stock means ignore update and preserve existing stock

            Optional<Book> updated = bookService.updateBook(1L, partialUpdate);

            assertThat(updated).isPresent();
            assertThat(updated.get().getPrice()).isEqualByComparingTo("19.99");
            assertThat(updated.get().getTitle()).isEqualTo("The Great Gatsby");
            assertThat(updated.get().getAuthor()).isEqualTo("F. Scott Fitzgerald");
            assertThat(updated.get().getStock()).isEqualTo(25);
        }

        @Test
        @DisplayName("Should return empty Optional when updating non-existent book")
        void updateBook_nonExistent_returnsEmpty() {
            Book updates = new Book();
            updates.setTitle("Unknown Book");

            Optional<Book> updated = bookService.updateBook(999L, updates);

            assertThat(updated).isEmpty();
        }
    }

    @Nested
    @DisplayName("Query, Filter & Search Tests")
    class FilterSearchTests {

        @Test
        @DisplayName("Should search books by title query case-insensitively")
        void searchByTitle_matchesCaseInsensitive() {
            List<Book> matches = bookService.searchByTitle("GATSBY");
            assertThat(matches).hasSize(1);
            assertThat(matches.get(0).getTitle()).isEqualTo("The Great Gatsby");

            List<Book> partialMatches = bookService.searchByTitle("to");
            assertThat(partialMatches)
                    .extracting(Book::getTitle)
                    .contains("To Kill a Mockingbird");
        }

        @Test
        @DisplayName("Should return empty list when title search yields no results")
        void searchByTitle_noMatches() {
            List<Book> matches = bookService.searchByTitle("Nonexistent Book Title");
            assertThat(matches).isEmpty();
        }

        @Test
        @DisplayName("Should filter books by author case-insensitively")
        void getByAuthor_matchesCaseInsensitive() {
            List<Book> books = bookService.getByAuthor("george orwell");
            assertThat(books).hasSize(1);
            assertThat(books.get(0).getTitle()).isEqualTo("1984");
        }

        @Test
        @DisplayName("Should filter books by genre case-insensitively")
        void getByGenre_matchesCaseInsensitive() {
            List<Book> fictionBooks = bookService.getByGenre("fiction");
            assertThat(fictionBooks).hasSize(2);
            assertThat(fictionBooks)
                    .extracting(Book::getTitle)
                    .containsExactlyInAnyOrder("The Great Gatsby", "To Kill a Mockingbird");
        }

        @Test
        @DisplayName("Should filter books that are in stock")
        void getInStockBooks_excludesZeroStock() {
            // Seeded books all have stock > 0
            assertThat(bookService.getInStockBooks()).hasSize(4);

            // Add a book with 0 stock
            bookService.addBook("Out of Stock Book", "Author", "ISBN-0",
                    new BigDecimal("9.99"), LocalDate.now(), "Fiction", 0);

            assertThat(bookService.getAllBooks()).hasSize(5);
            assertThat(bookService.getInStockBooks()).hasSize(4);
            assertThat(bookService.getInStockBooks())
                    .extracting(Book::getTitle)
                    .doesNotContain("Out of Stock Book");
        }
    }

    @Nested
    @DisplayName("Pagination and Sorting Tests")
    class PaginationAndSortingTests {

        @Test
        @DisplayName("Should paginate books correctly")
        void getAllBooks_paginates() {
            List<Book> page0 = bookService.getAllBooks(0, 2, "id");
            List<Book> page1 = bookService.getAllBooks(1, 2, "id");
            List<Book> page2 = bookService.getAllBooks(2, 2, "id");

            assertThat(page0).hasSize(2);
            assertThat(page1).hasSize(2);
            assertThat(page2).isEmpty();

            assertThat(page0.get(0).getId()).isNotEqualTo(page1.get(0).getId());
        }

        @Test
        @DisplayName("Should return empty list when page offset exceeds total count")
        void getAllBooks_pageOutOfRange_returnsEmpty() {
            List<Book> result = bookService.getAllBooks(10, 10, "id");
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("Should sort books by title")
        void getAllBooks_sortedByTitle() {
            List<Book> books = bookService.getAllBooks(0, 10, "title");
            assertThat(books).hasSize(4);
            assertThat(books)
                    .extracting(Book::getTitle)
                    .containsExactly("1984", "Clean Code", "The Great Gatsby", "To Kill a Mockingbird");
        }

        @Test
        @DisplayName("Should sort books by price")
        void getAllBooks_sortedByPrice() {
            List<Book> books = bookService.getAllBooks(0, 10, "price");
            assertThat(books).hasSize(4);
            assertThat(books)
                    .extracting(Book::getPrice)
                    .isSorted();
        }

        @Test
        @DisplayName("Should sort books by author")
        void getAllBooks_sortedByAuthor() {
            List<Book> books = bookService.getAllBooks(0, 10, "author");
            assertThat(books).hasSize(4);
            assertThat(books)
                    .extracting(Book::getAuthor)
                    .containsExactly("F. Scott Fitzgerald", "George Orwell", "Harper Lee", "Robert C. Martin");
        }

        @Test
        @DisplayName("Should sort books by publishedDate")
        void getAllBooks_sortedByPublishedDate() {
            List<Book> books = bookService.getAllBooks(0, 10, "publishedDate");
            assertThat(books).hasSize(4);
            assertThat(books)
                    .extracting(Book::getPublishedDate)
                    .isSorted();
        }

        @Test
        @DisplayName("Should sort books by genre")
        void getAllBooks_sortedByGenre() {
            List<Book> books = bookService.getAllBooks(0, 10, "genre");
            assertThat(books).hasSize(4);
            assertThat(books.get(0).getGenre()).isEqualTo("Dystopian");
        }

        @Test
        @DisplayName("Should sort books by stock")
        void getAllBooks_sortedByStock() {
            List<Book> books = bookService.getAllBooks(0, 10, "stock");
            assertThat(books).hasSize(4);
            assertThat(books)
                    .extracting(Book::getStock)
                    .isSorted();
        }

        @Test
        @DisplayName("Should fall back to ID sorting for unknown sort key")
        void getAllBooks_unknownSortKey_defaultsToId() {
            List<Book> books = bookService.getAllBooks(0, 10, "unknown_field");
            assertThat(books).hasSize(4);
            assertThat(books)
                    .extracting(Book::getId)
                    .isSorted();
        }
    }
}
