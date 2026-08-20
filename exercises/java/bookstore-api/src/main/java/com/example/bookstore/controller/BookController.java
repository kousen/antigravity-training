package com.example.bookstore.controller;

import com.example.bookstore.model.Book;
import com.example.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * REST controller for book operations.
 */
@Tag(name = "Books", description = "Operations for managing the bookstore catalog")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "Get all books", description = "Retrieves all books with optional pagination and sorting")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of books")
    @GetMapping
    public List<Book> getAllBooks(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Property to sort by (e.g. title, author, price)") @RequestParam(defaultValue = "id") String sortBy) {
        return bookService.getAllBooks(page, size, sortBy);
    }

    @Operation(summary = "Get book by ID", description = "Retrieves a specific book by its unique ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book found"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@Parameter(description = "ID of the book to retrieve") @PathVariable Long id) {
        return bookService.getBook(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Search books by title", description = "Searches for books containing the given title query (case-insensitive)")
    @ApiResponse(responseCode = "200", description = "Search results returned")
    @GetMapping("/search")
    public List<Book> searchBooks(@Parameter(description = "Search query string") @RequestParam String q) {
        return bookService.searchByTitle(q);
    }

    @Operation(summary = "Filter books by author", description = "Retrieves all books by a specific author")
    @ApiResponse(responseCode = "200", description = "Books by author returned")
    @GetMapping("/author/{author}")
    public List<Book> getByAuthor(@Parameter(description = "Author name") @PathVariable String author) {
        return bookService.getByAuthor(author);
    }

    @Operation(summary = "Filter books by genre", description = "Retrieves all books belonging to a specific genre")
    @ApiResponse(responseCode = "200", description = "Books by genre returned")
    @GetMapping("/genre/{genre}")
    public List<Book> getByGenre(@Parameter(description = "Genre name") @PathVariable String genre) {
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
                book.getTitle(), book.getAuthor(), book.getIsbn(),
                book.getPrice(), book.getPublishedDate(), book.getGenre(), book.getStock()
        );
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Update an existing book", description = "Updates fields of an existing book by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid book payload provided"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@Parameter(description = "ID of the book to update") @PathVariable Long id, @Valid @RequestBody Book book) {
        return bookService.updateBook(id, book)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a book", description = "Deletes a book from the catalog by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Book successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@Parameter(description = "ID of the book to delete") @PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
