package com.example.bookstore.controller;

import com.example.bookstore.dto.BookRequest;
import com.example.bookstore.dto.BookResponse;
import com.example.bookstore.dto.PageResponse;
import com.example.bookstore.exception.BookNotFoundException;
import com.example.bookstore.model.Book;
import com.example.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for book operations.
 */
@Tag(name = "Books", description = "Operations for managing bookstore catalog and inventory")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "Get books with pagination and optional filtering")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved books page")
    })
    @GetMapping
    public ResponseEntity<PageResponse<BookResponse>> getAllBooks(
            @Parameter(description = "Optional search query matching title") @RequestParam(required = false) String q,
            @Parameter(description = "Optional filter by author") @RequestParam(required = false) String author,
            @Parameter(description = "Optional filter by genre") @RequestParam(required = false) String genre,
            @Parameter(description = "Optional filter by in-stock status") @RequestParam(required = false) Boolean inStock,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Field to sort by (id, title, author, price, publishedDate, genre, stock)")
            @RequestParam(defaultValue = "id") String sortBy) {
        PageResponse<BookResponse> response = bookService.getBooksPage(q, author, genre, inStock, page, size, sortBy);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get a book by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book found"),
            @ApiResponse(responseCode = "404", description = "Book not found",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBook(@PathVariable Long id) {
        return bookService.getBook(id)
                .map(BookResponse::fromDomain)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    @Operation(summary = "Search books by title")
    @ApiResponse(responseCode = "200", description = "List of matching books")
    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> searchBooks(@RequestParam String q) {
        List<BookResponse> list = bookService.searchByTitle(q).stream()
                .map(BookResponse::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Get books by author")
    @ApiResponse(responseCode = "200", description = "List of books by author")
    @GetMapping("/author/{author}")
    public ResponseEntity<List<BookResponse>> getByAuthor(@PathVariable String author) {
        List<BookResponse> list = bookService.getByAuthor(author).stream()
                .map(BookResponse::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Get books by genre")
    @ApiResponse(responseCode = "200", description = "List of books by genre")
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<BookResponse>> getByGenre(@PathVariable String genre) {
        List<BookResponse> list = bookService.getByGenre(genre).stream()
                .map(BookResponse::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Get books currently in stock")
    @ApiResponse(responseCode = "200", description = "List of in-stock books")
    @GetMapping("/in-stock")
    public ResponseEntity<List<BookResponse>> getInStock() {
        List<BookResponse> list = bookService.getInStockBooks().stream()
                .map(BookResponse::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Create a new book")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Book successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    @PostMapping
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookRequest request) {
        Book created = bookService.addBook(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(BookResponse.fromDomain(created));
    }

    @Operation(summary = "Update an existing book")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Book successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "404", description = "Book not found",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request) {
        return bookService.updateBook(id, request)
                .map(BookResponse::fromDomain)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    @Operation(summary = "Delete a book by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Book successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Book not found",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new BookNotFoundException(id);
    }
}
