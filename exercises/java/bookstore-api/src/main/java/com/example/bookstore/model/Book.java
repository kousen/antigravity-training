package com.example.bookstore.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import org.hibernate.validator.constraints.ISBN;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Immutable record representing a book in the bookstore.
 * Standard Java record: components are public and final by default.
 */
public record Book(
    Long id,

    @NotBlank(message = "Title cannot be blank")
    String title,

    @NotBlank(message = "Author cannot be blank")
    String author,

    @NotBlank(message = "ISBN cannot be blank")
    @ISBN(type = ISBN.Type.ANY, message = "Invalid ISBN format")
    String isbn,

    @NotNull(message = "Price cannot be null")
    @Min(value = 0, message = "Price must be non-negative")
    BigDecimal price,

    @PastOrPresent(message = "Published date cannot be in the future")
    LocalDate publishedDate,

    @NotBlank(message = "Genre cannot be blank")
    String genre,

    @Min(value = 0, message = "Stock must be non-negative")
    int stock
) {
    public boolean isInStock() {
        return stock > 0;
    }
}
