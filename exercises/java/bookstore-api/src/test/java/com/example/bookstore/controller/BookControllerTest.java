package com.example.bookstore.controller;

import com.example.bookstore.model.Book;
import com.example.bookstore.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookController.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookService bookService;

    @Autowired
    private ObjectMapper objectMapper;

    private Book book1;
    private Book book2;

    @BeforeEach
    void setUp() {
        book1 = new Book(1L, "Title One", "Author One", "111-1-111-111-1",
                new BigDecimal("10.00"), LocalDate.of(2020, 1, 1), "Fiction", 5);
        book2 = new Book(2L, "Title Two", "Author Two", "222-2-222-222-2",
                new BigDecimal("20.00"), LocalDate.of(2021, 2, 2), "Science", 10);
    }

    @Test
    void getAllBooks_shouldReturnListOfBooks() throws Exception {
        when(bookService.getAllBooks(anyInt(), anyInt(), anyString())).thenReturn(Arrays.asList(book1, book2));

        mockMvc.perform(get("/api/books")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Title One"));
    }

    @Test
    void getBookById_shouldReturnBookWhenFound() throws Exception {
        when(bookService.getBook(1L)).thenReturn(Optional.of(book1));

        mockMvc.perform(get("/api/books/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title One"));
    }

    @Test
    void getBookById_shouldReturnNotFoundWhenNotFound() throws Exception {
        when(bookService.getBook(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/books/{id}", 99L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void createBook_shouldReturnCreatedBookWhenValid() throws Exception {
        Book newBook = new Book(null, "New Title", "New Author", "333-3-333-333-3",
                new BigDecimal("15.50"), LocalDate.of(2022, 3, 3), "Fantasy", 8);
        Book createdBook = new Book(3L, "New Title", "New Author", "333-3-333-333-3",
                new BigDecimal("15.50"), LocalDate.of(2022, 3, 3), "Fantasy", 8);

        when(bookService.addBook(any(), any(), any(), any(), any(), any(), anyInt())).thenReturn(createdBook);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newBook)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/books/3"))
                .andExpect(jsonPath("$.title").value("New Title"));
    }

    @Test
    void createBook_shouldReturnBadRequestWhenInvalid() throws Exception {
        Book invalidBook = new Book(null, "", "Author", "ISBN",
                new BigDecimal("-10.00"), LocalDate.of(2025, 1, 1), "", 0);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidBook)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Title cannot be blank"))
                .andExpect(jsonPath("$.price").value("Price must be non-negative"))
                .andExpect(jsonPath("$.genre").value("Genre cannot be blank"));
    }

    @Test
    void updateBook_shouldReturnUpdatedBookWhenValid() throws Exception {
        Book updatedBookDetails = new Book(null, "Updated Title", "Updated Author", "111-1-111-111-1",
                new BigDecimal("12.00"), LocalDate.of(2020, 1, 1), "Fiction", 7);
        Book finalBook = new Book(1L, "Updated Title", "Updated Author", "111-1-111-111-1",
                new BigDecimal("12.00"), LocalDate.of(2020, 1, 1), "Fiction", 7);

        when(bookService.updateBook(eq(1L), any(Book.class))).thenReturn(Optional.of(finalBook));

        mockMvc.perform(put("/api/books/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedBookDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void updateBook_shouldReturnNotFoundWhenBookToUpdateNotFound() throws Exception {
        Book updatedBookDetails = new Book(null, "Updated Title", "Updated Author", "111-1-111-111-1",
                new BigDecimal("12.00"), LocalDate.of(2020, 1, 1), "Fiction", 7);

        when(bookService.updateBook(eq(99L), any(Book.class))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/books/{id}", 99L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedBookDetails)))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateBook_shouldReturnBadRequestWhenInvalid() throws Exception {
        Book invalidBookUpdates = new Book(null, "", "Author", "ISBN",
                new BigDecimal("-5.00"), LocalDate.of(2025, 1, 1), "Genre", 0);

        mockMvc.perform(put("/api/books/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidBookUpdates)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Title cannot be blank"))
                .andExpect(jsonPath("$.price").value("Price must be non-negative"));
    }

    @Test
    void deleteBook_shouldReturnNoContentWhenFound() throws Exception {
        when(bookService.deleteBook(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/books/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteBook_shouldReturnNotFoundWhenNotFound() throws Exception {
        when(bookService.deleteBook(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/books/{id}", 99L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllBooks_shouldReturnPaginatedBooks() throws Exception {
        when(bookService.getAllBooks(eq(0), eq(1), eq("id"))).thenReturn(Arrays.asList(book1));

        mockMvc.perform(get("/api/books")
                .param("page", "0")
                .param("size", "1")
                .param("sortBy", "id")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Title One"));
    }

    @Test
    void searchBooks_shouldReturnMatchingBooks() throws Exception {
        when(bookService.searchByTitle("One")).thenReturn(Arrays.asList(book1));

        mockMvc.perform(get("/api/books/search")
                .param("q", "One")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Title One"));
    }

    @Test
    void getByAuthor_shouldReturnBooksByAuthor() throws Exception {
        when(bookService.getByAuthor("Author One")).thenReturn(Arrays.asList(book1));

        mockMvc.perform(get("/api/books/author/{author}", "Author One")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].author").value("Author One"));
    }

    @Test
    void getByGenre_shouldReturnBooksByGenre() throws Exception {
        when(bookService.getByGenre("Fiction")).thenReturn(Arrays.asList(book1));

        mockMvc.perform(get("/api/books/genre/{genre}", "Fiction")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].genre").value("Fiction"));
    }

    @Test
    void getInStock_shouldReturnInStockBooks() throws Exception {
        when(bookService.getInStockBooks()).thenReturn(Arrays.asList(book1, book2));

        mockMvc.perform(get("/api/books/in-stock")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
