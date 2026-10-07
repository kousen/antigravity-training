package com.example.bookstore.dto;

import com.example.bookstore.model.Book;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Response payload representing a book")
public record BookResponse(
    @Schema(description = "Unique book identifier", example = "1")
    Long id,

    @Schema(description = "Title of the book", example = "Clean Code")
    String title,

    @Schema(description = "Author of the book", example = "Robert C. Martin")
    String author,

    @Schema(description = "ISBN number", example = "978-0132350884")
    String isbn,

    @Schema(description = "Price of the book", example = "39.99")
    BigDecimal price,

    @Schema(description = "Publication date", example = "2008-08-01")
    LocalDate publishedDate,

    @Schema(description = "Genre or category", example = "Technical")
    String genre,

    @Schema(description = "Available inventory count", example = "15")
    int stock,

    @Schema(description = "Whether the book is currently in stock", example = "true")
    boolean inStock
) {
    public static BookResponse fromDomain(Book book) {
        return new BookResponse(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            book.getIsbn(),
            book.getPrice(),
            book.getPublishedDate(),
            book.getGenre(),
            book.getStock(),
            book.isInStock()
        );
    }
}
