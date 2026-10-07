package com.example.bookstore.service;

import com.example.bookstore.dto.BookRequest;
import com.example.bookstore.dto.BookResponse;
import com.example.bookstore.dto.PageResponse;
import com.example.bookstore.model.Book;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

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

    public Book addBook(BookRequest request) {
        return addBook(
                request.title(),
                request.author(),
                request.isbn(),
                request.price(),
                request.publishedDate(),
                request.genre(),
                request.stock() != null ? request.stock() : 0
        );
    }

    public Optional<Book> getBook(Long id) {
        return Optional.ofNullable(books.get(id));
    }

    public List<Book> getAllBooks() {
        return new ArrayList<>(books.values());
    }

    public PageResponse<BookResponse> getBooksPage(String query, String author, String genre,
                                                   Boolean inStock, int page, int size, String sortBy) {
        List<Book> filtered = books.values().stream()
                .filter(b -> query == null || b.getTitle().toLowerCase().contains(query.toLowerCase()))
                .filter(b -> author == null || b.getAuthor().toLowerCase().contains(author.toLowerCase()))
                .filter(b -> genre == null || b.getGenre().equalsIgnoreCase(genre))
                .filter(b -> inStock == null || (inStock ? b.isInStock() : !b.isInStock()))
                .collect(Collectors.toList());

        List<Book> sorted = getSortedBooks(filtered, sortBy);
        List<BookResponse> responses = sorted.stream()
                .map(BookResponse::fromDomain)
                .collect(Collectors.toList());

        return PageResponse.of(responses, page, size);
    }

    public List<Book> getSortedBooks(List<Book> list, String sortBy) {
        String safeSort = sortBy != null ? sortBy.toLowerCase() : "id";
        list.sort((b1, b2) -> switch (safeSort) {
            case "title" -> b1.getTitle().compareToIgnoreCase(b2.getTitle());
            case "author" -> b1.getAuthor().compareToIgnoreCase(b2.getAuthor());
            case "price" -> b1.getPrice().compareTo(b2.getPrice());
            case "publisheddate" -> {
                if (b1.getPublishedDate() == null && b2.getPublishedDate() == null) yield 0;
                if (b1.getPublishedDate() == null) yield -1;
                if (b2.getPublishedDate() == null) yield 1;
                yield b1.getPublishedDate().compareTo(b2.getPublishedDate());
            }
            case "genre" -> b1.getGenre().compareToIgnoreCase(b2.getGenre());
            case "stock" -> Integer.compare(b1.getStock(), b2.getStock());
            default -> Long.compare(b1.getId(), b2.getId());
        });
        return list;
    }

    public List<Book> searchByTitle(String query) {
        if (query == null) return Collections.emptyList();
        String lowerQuery = query.toLowerCase();
        return books.values().stream()
                .filter(book -> book.getTitle().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
    }

    public List<Book> getByAuthor(String author) {
        if (author == null) return Collections.emptyList();
        String lowerAuthor = author.toLowerCase();
        return books.values().stream()
                .filter(book -> book.getAuthor().toLowerCase().contains(lowerAuthor))
                .collect(Collectors.toList());
    }

    public List<Book> getByGenre(String genre) {
        if (genre == null) return Collections.emptyList();
        return books.values().stream()
                .filter(book -> book.getGenre().equalsIgnoreCase(genre))
                .collect(Collectors.toList());
    }

    public List<Book> getInStockBooks() {
        return books.values().stream()
                .filter(Book::isInStock)
                .collect(Collectors.toList());
    }

    public Optional<Book> updateBook(Long id, BookRequest updates) {
        Book existing = books.get(id);
        if (existing == null) {
            return Optional.empty();
        }

        Book updated = new Book(
                id,
                updates.title() != null ? updates.title() : existing.getTitle(),
                updates.author() != null ? updates.author() : existing.getAuthor(),
                updates.isbn() != null ? updates.isbn() : existing.getIsbn(),
                updates.price() != null ? updates.price() : existing.getPrice(),
                updates.publishedDate(), // replaces publishedDate, allowing null to clear
                updates.genre() != null ? updates.genre() : existing.getGenre(),
                updates.stock() != null ? updates.stock() : existing.getStock()
        );

        books.replace(id, updated);
        return Optional.of(updated);
    }

    public boolean deleteBook(Long id) {
        return books.remove(id) != null;
    }
}
