package com.example.bookstore.service;

import com.example.bookstore.model.Book;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing books in the bookstore.
 * Delegates data access to BookRepository and handles business logic.
 */
@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book addBook(String title, String author, String isbn,
                        BigDecimal price, LocalDate publishedDate, String genre, int stock) {
        Long id = bookRepository.getNextId();
        Book book = new Book(id, title, author, isbn, price, publishedDate, genre, stock);
        return bookRepository.save(book);
    }

    public Optional<Book> getBook(Long id) {
        return bookRepository.findById(id);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<Book> getAllBooks(int page, int size, String sortBy) {
        List<Book> allBooks = bookRepository.findAll();

        // Sort using Record accessors
        allBooks.sort((b1, b2) -> {
            switch (sortBy.toLowerCase()) {
                case "title":
                    return b1.title().compareToIgnoreCase(b2.title());
                case "author":
                    return b1.author().compareToIgnoreCase(b2.author());
                case "price":
                    return b1.price().compareTo(b2.price());
                case "publisheddate":
                    return b1.publishedDate().compareTo(b2.publishedDate());
                case "genre":
                    return b1.genre().compareToIgnoreCase(b2.genre());
                case "stock":
                    return Integer.compare(b1.stock(), b2.stock());
                default:
                    return Long.compare(b1.id(), b2.id());
            }
        });

        // Paginate
        int start = Math.min(page * size, allBooks.size());
        int end = Math.min(start + size, allBooks.size());

        return allBooks.subList(start, end);
    }

    public List<Book> searchByTitle(String query) {
        String lowerQuery = query.toLowerCase();
        return bookRepository.findAll().stream()
                .filter(book -> book.title().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
    }

    public List<Book> getByAuthor(String author) {
        String lowerAuthor = author.toLowerCase();
        return bookRepository.findAll().stream()
                .filter(book -> book.author().toLowerCase().contains(lowerAuthor))
                .collect(Collectors.toList());
    }

    public List<Book> getByGenre(String genre) {
        return bookRepository.findAll().stream()
                .filter(book -> book.genre().equalsIgnoreCase(genre))
                .collect(Collectors.toList());
    }

    public Optional<Book> updateBook(Long id, Book updates) {
        return bookRepository.findById(id).map(existing -> {
            // Records are immutable, so we create a new one with updated values
            Book updated = new Book(
                    existing.id(),
                    updates.title() != null ? updates.title() : existing.title(),
                    updates.author() != null ? updates.author() : existing.author(),
                    updates.isbn() != null ? updates.isbn() : existing.isbn(),
                    updates.price() != null ? updates.price() : existing.price(),
                    updates.publishedDate() != null ? updates.publishedDate() : existing.publishedDate(),
                    updates.genre() != null ? updates.genre() : existing.genre(),
                    updates.stock() >= 0 ? updates.stock() : existing.stock()
            );
            return bookRepository.save(updated);
        });
    }

    public boolean deleteBook(Long id) {
        return bookRepository.deleteById(id);
    }

    public List<Book> getInStockBooks() {
        return bookRepository.findAll().stream()
                .filter(Book::isInStock)
                .collect(Collectors.toList());
    }
}
