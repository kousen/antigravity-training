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

    public static final int MAX_CAPACITY = 10_000;

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
        if (books.size() >= MAX_CAPACITY) {
            throw new IllegalStateException("Catalog capacity limit of " + MAX_CAPACITY + " books reached");
        }
        Long id = idCounter.getAndIncrement();
        Book book = new Book(id, title, author, isbn, price, publishedDate, genre, stock);
        books.put(id, book);
        return book;
    }

    public Optional<Book> getBook(Long id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(books.get(id));
    }

    public List<Book> getAllBooks() {
        return List.copyOf(books.values());
    }

    public List<Book> getAllBooks(int page, int size, String sortBy) {
        if (page < 0 || size <= 0) {
            return List.of();
        }

        List<Book> allBooks = new ArrayList<>(books.values());

        // Sort with null-safety and switch expression
        String sortField = sortBy != null ? sortBy.toLowerCase() : "id";
        allBooks.sort((b1, b2) -> switch (sortField) {
            case "title" -> b1.title().compareToIgnoreCase(b2.title());
            case "author" -> b1.author().compareToIgnoreCase(b2.author());
            case "price" -> b1.price().compareTo(b2.price());
            case "publisheddate" -> b1.publishedDate().compareTo(b2.publishedDate());
            case "genre" -> b1.genre().compareToIgnoreCase(b2.genre());
            case "stock" -> Integer.compare(b1.stock(), b2.stock());
            default -> Long.compare(b1.id(), b2.id()); // Fallback sort by ID
        });

        // Guard against 32-bit integer multiplication overflow and out-of-bounds
        long startLong = (long) page * (long) size;
        if (startLong >= allBooks.size()) {
            return List.of();
        }
        int start = (int) startLong;
        int end = (int) Math.min(startLong + size, (long) allBooks.size());

        return List.copyOf(allBooks.subList(start, end));
    }

    public List<Book> searchByTitle(String query) {
        if (query == null) return List.of();
        String lowerQuery = query.toLowerCase();
        return books.values().stream()
                .filter(book -> book.title().toLowerCase().contains(lowerQuery))
                .toList();
    }

    public List<Book> getByAuthor(String author) {
        if (author == null) return List.of();
        String lowerAuthor = author.toLowerCase();
        return books.values().stream()
                .filter(book -> book.author().toLowerCase().contains(lowerAuthor))
                .toList();
    }

    public List<Book> getByGenre(String genre) {
        if (genre == null) return List.of();
        return books.values().stream()
                .filter(book -> book.genre().equalsIgnoreCase(genre))
                .toList();
    }

    public Optional<Book> updateBook(Long id, Book updates) {
        if (id == null || updates == null) {
            return Optional.empty();
        }

        Book updated = books.computeIfPresent(id, (bookId, existing) -> {
            String title = updates.title() != null ? updates.title() : existing.title();
            String author = updates.author() != null ? updates.author() : existing.author();
            String isbn = updates.isbn() != null ? updates.isbn() : existing.isbn();
            BigDecimal price = updates.price() != null ? updates.price() : existing.price();
            LocalDate publishedDate = updates.publishedDate() != null ? updates.publishedDate() : existing.publishedDate();
            String genre = updates.genre() != null ? updates.genre() : existing.genre();
            int stock = updates.stock() >= 0 ? updates.stock() : existing.stock();

            return new Book(bookId, title, author, isbn, price, publishedDate, genre, stock);
        });

        return Optional.ofNullable(updated);
    }

    public boolean deleteBook(Long id) {
        if (id == null) return false;
        return books.remove(id) != null;
    }

    public List<Book> getInStockBooks() {
        return books.values().stream()
                .filter(Book::isInStock)
                .toList();
    }
}
