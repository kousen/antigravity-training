package com.example.bookstore.service;

import com.example.bookstore.model.Book;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class BookServiceTest {

    private BookRepository bookRepository;
    private BookService bookService;

    @BeforeEach
    void setUp() {
        bookRepository = new InMemoryBookRepository();
        bookService = new BookService(bookRepository);
    }

    @Test
    void addBook_shouldCreateAndReturnBook() {
        Book book = bookService.addBook("New Book", "Author", "978-0132350884",
                new BigDecimal("29.99"), LocalDate.now(), "Tech", 10);

        assertThat(book.id()).isNotNull();
        assertThat(book.title()).isEqualTo("New Book");
        assertThat(bookRepository.findById(book.id())).isPresent();
    }

    @Test
    void getBook_shouldReturnBookWhenExists() {
        Optional<Book> found = bookService.getBook(1L);
        assertThat(found).isPresent();
        assertThat(found.get().title()).isEqualTo("The Great Gatsby");
    }

    @Test
    void getAllBooks_shouldReturnAllInitialBooks() {
        List<Book> all = bookService.getAllBooks();
        assertThat(all).hasSize(4);
    }

    @Test
    void getAllBooks_withPaginationAndSorting_shouldReturnCorrectSubset() {
        // Default sort by ID
        List<Book> page1 = bookService.getAllBooks(0, 2, "id");
        assertThat(page1).hasSize(2);
        assertThat(page1.get(0).id()).isEqualTo(1L);
        assertThat(page1.get(1).id()).isEqualTo(2L);

        // Sort by Title
        List<Book> sortedByTitle = bookService.getAllBooks(0, 4, "title");
        assertThat(sortedByTitle.get(0).title()).isEqualTo("1984");
        assertThat(sortedByTitle.get(1).title()).isEqualTo("Clean Code");

        // Sort by Price
        List<Book> sortedByPrice = bookService.getAllBooks(0, 4, "price");
        assertThat(sortedByPrice.get(0).price()).isEqualByComparingTo("11.99");

        // Sort by Stock
        List<Book> sortedByStock = bookService.getAllBooks(0, 4, "stock");
        assertThat(sortedByStock.get(0).stock()).isEqualTo(15);
        
        // Sort by Genre
        List<Book> sortedByGenre = bookService.getAllBooks(0, 4, "genre");
        assertThat(sortedByGenre.get(0).genre()).isEqualTo("Dystopian");

        // Sort by Date
        List<Book> sortedByDate = bookService.getAllBooks(0, 4, "publishedDate");
        assertThat(sortedByDate.get(0).publishedDate()).isEqualTo(LocalDate.of(1925, 4, 10));
    }

    @Test
    void searchByTitle_shouldReturnMatchingBooks() {
        List<Book> results = bookService.searchByTitle("great");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).title()).isEqualTo("The Great Gatsby");
    }

    @Test
    void getByAuthor_shouldReturnMatchingBooks() {
        List<Book> results = bookService.getByAuthor("Lee");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).author()).isEqualTo("Harper Lee");
    }

    @Test
    void getByGenre_shouldReturnMatchingBooks() {
        List<Book> results = bookService.getByGenre("Technical");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).genre()).isEqualTo("Technical");
    }

    @Test
    void updateBook_shouldModifyExistingBook() {
        Book updates = new Book(null, "Updated Title", null, null, new BigDecimal("50.00"), null, null, 100);
        Optional<Book> updated = bookService.updateBook(1L, updates);

        assertThat(updated).isPresent();
        assertThat(updated.get().title()).isEqualTo("Updated Title");
        assertThat(updated.get().price()).isEqualByComparingTo("50.00");
        assertThat(updated.get().stock()).isEqualTo(100);
        assertThat(updated.get().author()).isEqualTo("F. Scott Fitzgerald"); // Should remain unchanged
    }

    @Test
    void updateBook_shouldReturnEmptyWhenNotFound() {
        Book updates = new Book(null, "Title", null, null, BigDecimal.TEN, null, null, 1);
        Optional<Book> result = bookService.updateBook(999L, updates);
        assertThat(result).isEmpty();
    }

    @Test
    void deleteBook_shouldRemoveBook() {
        boolean deleted = bookService.deleteBook(1L);
        assertThat(deleted).isTrue();
        assertThat(bookService.getBook(1L)).isEmpty();
    }

    @Test
    void getInStockBooks_shouldReturnOnlyInStock() {
        // Add an out of stock book
        bookRepository.save(new Book(5L, "Out of Stock", "Author", "ISBN", BigDecimal.ONE, LocalDate.now(), "Genre", 0));
        
        List<Book> inStock = bookService.getInStockBooks();
        assertThat(inStock).allMatch(Book::isInStock);
        assertThat(inStock).hasSize(4); // The 4 initial books
    }
}
