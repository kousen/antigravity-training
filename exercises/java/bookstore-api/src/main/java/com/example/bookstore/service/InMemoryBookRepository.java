package com.example.bookstore.service;

import com.example.bookstore.model.Book;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory implementation of BookRepository.
 * Manages the data state using a thread-safe ConcurrentHashMap.
 */
@Repository
public class InMemoryBookRepository implements BookRepository {

    private final Map<Long, Book> books = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public InMemoryBookRepository() {
        // Pre-load with initial data
        save(new Book(idCounter.getAndIncrement(), "The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565",
                new BigDecimal("14.99"), LocalDate.of(1925, 4, 10), "Fiction", 25));
        save(new Book(idCounter.getAndIncrement(), "To Kill a Mockingbird", "Harper Lee", "978-0446310789",
                new BigDecimal("12.99"), LocalDate.of(1960, 7, 11), "Fiction", 18));
        save(new Book(idCounter.getAndIncrement(), "1984", "George Orwell", "978-0451524935",
                new BigDecimal("11.99"), LocalDate.of(1949, 6, 8), "Dystopian", 30));
        save(new Book(idCounter.getAndIncrement(), "Clean Code", "Robert C. Martin", "978-0132350884",
                new BigDecimal("39.99"), LocalDate.of(2008, 8, 1), "Technical", 15));
    }

    @Override
    public Book save(Book book) {
        books.put(book.id(), book);
        return book;
    }

    @Override
    public Optional<Book> findById(Long id) {
        return Optional.ofNullable(books.get(id));
    }

    @Override
    public List<Book> findAll() {
        return new ArrayList<>(books.values());
    }

    @Override
    public boolean deleteById(Long id) {
        return books.remove(id) != null;
    }

    @Override
    public long getNextId() {
        return idCounter.getAndIncrement();
    }
}
