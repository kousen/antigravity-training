package com.example.bookstore.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Immutable domain model and transfer record representing a book in the bookstore.
 */
@Schema(description = "Book domain and transfer record")
public record Book(
        @Schema(description = "Unique ID of the book (auto-generated on creation)", example = "1")
        Long id,

        @NotBlank(message = "Title cannot be blank")
        @Size(max = 255, message = "Title cannot exceed 255 characters")
        @Schema(description = "Book title", example = "The Great Gatsby")
        String title,

        @NotBlank(message = "Author cannot be blank")
        @Size(max = 255, message = "Author cannot exceed 255 characters")
        @Schema(description = "Author name", example = "F. Scott Fitzgerald")
        String author,

        @NotBlank(message = "ISBN cannot be blank")
        @Size(max = 20, message = "ISBN cannot exceed 20 characters")
        @Schema(description = "ISBN identifier", example = "978-0743273565")
        String isbn,

        @NotNull(message = "Price cannot be null")
        @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
        @Digits(integer = 8, fraction = 2, message = "Price format must have up to 2 decimal places")
        @Schema(description = "Unit retail price", example = "14.99")
        BigDecimal price,

        @PastOrPresent(message = "Published date cannot be in the future")
        @Schema(description = "Publication date (YYYY-MM-DD)", example = "1925-04-10")
        LocalDate publishedDate,

        @NotBlank(message = "Genre cannot be blank")
        @Size(max = 100, message = "Genre cannot exceed 100 characters")
        @Schema(description = "Book genre", example = "Fiction")
        String genre,

        @Min(value = 0, message = "Stock must be non-negative")
        @Schema(description = "Available inventory quantity", example = "25")
        int stock
) {
    public boolean isInStock() {
        return stock > 0;
    }

    // JavaBean-style getter aliases for compatibility
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public BigDecimal getPrice() { return price; }
    public LocalDate getPublishedDate() { return publishedDate; }
    public String getGenre() { return genre; }
    public int getStock() { return stock; }
}
