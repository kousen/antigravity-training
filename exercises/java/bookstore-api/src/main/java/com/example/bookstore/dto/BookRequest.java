package com.example.bookstore.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Request payload for creating or updating a book")
public record BookRequest(
    @Schema(description = "Title of the book", example = "Clean Code")
    @NotBlank(message = "Title cannot be blank")
    String title,

    @Schema(description = "Author of the book", example = "Robert C. Martin")
    @NotBlank(message = "Author cannot be blank")
    String author,

    @Schema(description = "ISBN number", example = "978-0132350884")
    @NotBlank(message = "ISBN cannot be blank")
    String isbn,

    @Schema(description = "Price of the book", example = "39.99")
    @NotNull(message = "Price cannot be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    BigDecimal price,

    @Schema(description = "Publication date", example = "2008-08-01")
    @PastOrPresent(message = "Published date cannot be in the future")
    LocalDate publishedDate,

    @Schema(description = "Genre or category", example = "Technical")
    @NotBlank(message = "Genre cannot be blank")
    String genre,

    @Schema(description = "Available inventory count", example = "15")
    @NotNull(message = "Stock cannot be null")
    @Min(value = 0, message = "Stock must be non-negative")
    Integer stock
) {}
