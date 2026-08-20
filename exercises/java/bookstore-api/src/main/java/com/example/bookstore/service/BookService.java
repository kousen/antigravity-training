package com.example.bookstore.service;

import com.example.bookstore.model.Book;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service for managing books in the bookstore.
 */
@Service
public class BookService {

    private final Map<Long, Book> books = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public BookService() {
        // Initialize with sample data
        addBook("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565",
                new BigDecimal("14.99"), LocalDate.of(1925, 4, 10), "Fiction", 25);
        addBook("To Kill a Mockingbird", "Harper Lee", "978-0446310789",
                new BigDecimal("12.99"), LocalDate.of(1960, 7, 11), "Fiction", 18);
        addBook("1984", "George Orwell", "978-0451524935",
                new BigDecimal("11.99"), LocalDate.of(1949, 6, 8), "Dystopian", 30);
        addBook("Clean Code", "Robert C. Martin", "978-0132350884",
                new BigDecimal("39.99"), LocalDate.of(2008, 8, 1), "Technical", 15);
    }

    public Book addBook(String title, String author, String isbn,
                        BigDecimal price, LocalDate publishedDate, String genre, int stock) {
        Long id = idCounter.getAndIncrement();
        Book book = new Book(id, title, author, isbn, price, publishedDate, genre, stock);
        books.put(id, book);
        return book;
    }

    public Optional<Book> getBook(Long id) {
        return Optional.ofNullable(books.get(id));
    }

    public List<Book> getAllBooks() {
        return new ArrayList<>(books.values());
    }

    public List<Book> getAllBooks(int page, int size, String sortBy) {
        List<Book> allBooks = new ArrayList<>(books.values());

        // Sort
        allBooks.sort((b1, b2) -> {
            switch (sortBy.toLowerCase()) {
                case "title":
                    return b1.getTitle().compareToIgnoreCase(b2.getTitle());
                case "author":
                    return b1.getAuthor().compareToIgnoreCase(b2.getAuthor());
                case "price":
                    return b1.getPrice().compareTo(b2.getPrice());
                case "publisheddate":
                    return b1.getPublishedDate().compareTo(b2.getPublishedDate());
                case "genre":
                    return b1.getGenre().compareToIgnoreCase(b2.getGenre());
                case "stock":
                    return Integer.compare(b1.getStock(), b2.getStock());
                default:
                    return Long.compare(b1.getId(), b2.getId()); // Default sort by ID
            }
        });

        // Paginate
        int start = Math.min(page * size, allBooks.size());
        int end = Math.min(start + size, allBooks.size());

        return allBooks.subList(start, end);
    }

    public List<Book> searchByTitle(String query) {
        String lowerQuery = query.toLowerCase();
        return books.values().stream()
                .filter(book -> book.getTitle().toLowerCase().contains(lowerQuery))
                .toList();
    }

    public List<Book> getByAuthor(String author) {
        String lowerAuthor = author.toLowerCase();
        return books.values().stream()
                .filter(book -> book.getAuthor().toLowerCase().contains(lowerAuthor))
                .toList();
    }

    public List<Book> getByGenre(String genre) {
        return books.values().stream()
                .filter(book -> book.getGenre().equalsIgnoreCase(genre))
                .toList();
    }

    public Optional<Book> updateBook(Long id, Book updates) {
        Book updated = books.computeIfPresent(id, (bookId, existing) -> {
            String title = updates.getTitle() != null ? updates.getTitle() : existing.getTitle();
            String author = updates.getAuthor() != null ? updates.getAuthor() : existing.getAuthor();
            String isbn = updates.getIsbn() != null ? updates.getIsbn() : existing.getIsbn();
            BigDecimal price = updates.getPrice() != null ? updates.getPrice() : existing.getPrice();
            LocalDate publishedDate = updates.getPublishedDate() != null ? updates.getPublishedDate() : existing.getPublishedDate();
            String genre = updates.getGenre() != null ? updates.getGenre() : existing.getGenre();
            int stock = updates.getStock() >= 0 ? updates.getStock() : existing.getStock();

            return new Book(bookId, title, author, isbn, price, publishedDate, genre, stock);
        });

        return Optional.ofNullable(updated);
    }

    public boolean deleteBook(Long id) {
        return books.remove(id) != null;
    }

    public List<Book> getInStockBooks() {
        return books.values().stream()
                .filter(Book::isInStock)
                .toList();
    }
}
