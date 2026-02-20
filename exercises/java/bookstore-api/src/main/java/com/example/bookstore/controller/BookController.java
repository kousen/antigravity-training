package com.example.bookstore.controller;

import com.example.bookstore.model.Book;
import com.example.bookstore.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

/**
 * REST controller for book operations.
 */
@Tag(name = "Books", description = "The Book management API")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "Get all books", description = "Returns a paginated list of all books in the bookstore.")
    @GetMapping
    public List<Book> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        return bookService.getAllBooks(page, size, sortBy);
    }

    @Operation(summary = "Get a book by ID", description = "Returns a single book matching the provided ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the book", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Book.class)) }),
            @ApiResponse(responseCode = "404", description = "Book not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(
            @Parameter(description = "ID of the book to be searched") @PathVariable Long id) {
        return bookService.getBook(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Search books", description = "Search for books by their title.")
    @GetMapping("/search")
    public List<Book> searchBooks(@Parameter(description = "The title search query") @RequestParam String q) {
        return bookService.searchByTitle(q);
    }

    @Operation(summary = "Get books by author", description = "Returns a list of books matching the specified author.")
    @GetMapping("/author/{author}")
    public List<Book> getByAuthor(@Parameter(description = "The author to filter by") @PathVariable String author) {
        return bookService.getByAuthor(author);
    }

    @Operation(summary = "Get books by genre", description = "Returns a list of books matching the specified genre.")
    @GetMapping("/genre/{genre}")
    public List<Book> getByGenre(@Parameter(description = "The genre to filter by") @PathVariable String genre) {
        return bookService.getByGenre(genre);
    }

    @Operation(summary = "Get in-stock books", description = "Returns a list of all books currently in stock.")
    @GetMapping("/in-stock")
    public List<Book> getInStock() {
        return bookService.getInStockBooks();
    }

    @Operation(summary = "Create a new book", description = "Adds a new book to the bookstore inventory.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Book created successfully", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Book.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Book> createBook(
            @Parameter(description = "The book object to create") @Valid @RequestBody Book book) {
        Book created = bookService.addBook(
                book.getTitle(), book.getAuthor(), book.getIsbn(),
                book.getPrice(), book.getPublishedDate(), book.getGenre(), book.getStock());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update an existing book", description = "Updates the details of an existing book by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book updated successfully", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Book.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content),
            @ApiResponse(responseCode = "404", description = "Book not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @Parameter(description = "ID of the book to update") @PathVariable Long id,
            @Parameter(description = "Updated book data") @Valid @RequestBody Book book) {
        return bookService.updateBook(id, book)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a book", description = "Removes a book from the inventory by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Book deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "Book not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@Parameter(description = "ID of the book to delete") @PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
