package com.example.bookstore.controller;

import com.example.bookstore.model.Book;
import com.example.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * REST controller for book operations.
 */
@Tag(name = "Books", description = "Operations for managing the bookstore catalog")
@Validated
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "Get all books", description = "Retrieves all books with optional pagination and sorting")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of books"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination or sorting parameters")
    })
    @GetMapping
    public List<Book> getAllBooks(
            @Parameter(description = "Page index (0-indexed)") @RequestParam(defaultValue = "0") @Min(value = 0, message = "Page index must not be negative") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "10") @Min(value = 1, message = "Page size must be at least 1") @Max(value = 100, message = "Page size cannot exceed 100") int size,
            @Parameter(description = "Property to sort by (e.g. title, author, price)") @RequestParam(defaultValue = "id") String sortBy) {
        return bookService.getAllBooks(page, size, sortBy);
    }

    @Operation(summary = "Get book by ID", description = "Retrieves a specific book by its unique ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book found"),
            @ApiResponse(responseCode = "400", description = "Invalid book ID supplied"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@Parameter(description = "ID of the book to retrieve") @PathVariable @Positive(message = "Book ID must be positive") Long id) {
        return bookService.getBook(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Search books by title", description = "Searches for books containing the given title query (case-insensitive)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results returned"),
            @ApiResponse(responseCode = "400", description = "Missing or blank search query")
    })
    @GetMapping("/search")
    public List<Book> searchBooks(@Parameter(description = "Search query string") @RequestParam @NotBlank(message = "Search query cannot be blank") String q) {
        return bookService.searchByTitle(q);
    }

    @Operation(summary = "Filter books by author", description = "Retrieves all books by a specific author")
    @ApiResponse(responseCode = "200", description = "Books by author returned")
    @GetMapping("/author/{author}")
    public List<Book> getByAuthor(@Parameter(description = "Author name") @PathVariable @NotBlank(message = "Author cannot be blank") String author) {
        return bookService.getByAuthor(author);
    }

    @Operation(summary = "Filter books by genre", description = "Retrieves all books belonging to a specific genre")
    @ApiResponse(responseCode = "200", description = "Books by genre returned")
    @GetMapping("/genre/{genre}")
    public List<Book> getByGenre(@Parameter(description = "Genre name") @PathVariable @NotBlank(message = "Genre cannot be blank") String genre) {
        return bookService.getByGenre(genre);
    }

    @Operation(summary = "Get in-stock books", description = "Retrieves all books currently in stock")
    @ApiResponse(responseCode = "200", description = "In-stock books returned")
    @GetMapping("/in-stock")
    public List<Book> getInStock() {
        return bookService.getInStockBooks();
    }

    @Operation(summary = "Create a new book", description = "Adds a new book to the catalog")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Book created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid book payload provided")
    })
    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book created = bookService.addBook(
                book.title(), book.author(), book.isbn(),
                book.price(), book.publishedDate(), book.genre(), book.stock()
        );
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Update an existing book", description = "Updates fields of an existing book by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid book payload or ID provided"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @Parameter(description = "ID of the book to update") @PathVariable @Positive(message = "Book ID must be positive") Long id,
            @Valid @RequestBody Book book) {
        return bookService.updateBook(id, book)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a book", description = "Deletes a book from the catalog by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Book successfully deleted"),
            @ApiResponse(responseCode = "400", description = "Invalid book ID supplied"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @Parameter(description = "ID of the book to delete") @PathVariable @Positive(message = "Book ID must be positive") Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
