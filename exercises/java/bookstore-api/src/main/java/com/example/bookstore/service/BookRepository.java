package com.example.bookstore.service;

import com.example.bookstore.model.Book;
import java.util.List;
import java.util.Optional;

/**
 * Interface for book data access operations.
 * Separates persistence logic from business logic.
 */
public interface BookRepository {
    Book save(Book book);
    Optional<Book> findById(Long id);
    List<Book> findAll();
    boolean deleteById(Long id);
    long getNextId();
}
