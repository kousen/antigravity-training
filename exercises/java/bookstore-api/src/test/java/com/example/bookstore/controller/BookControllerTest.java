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
import static org.assertj.core.api.Assertions.assertThat;

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
        book1 = new Book(1L, "Title One", "Author One", "978-0132350884",
                new BigDecimal("10.00"), LocalDate.of(2020, 1, 1), "Fiction", 5);
        book2 = new Book(2L, "Title Two", "Author Two", "978-0446310789",
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
        
        assertThat(book1.title()).isEqualTo("Title One");
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
    void createBook_shouldReturnCreatedBookWhenValid() throws Exception {
        Book newBook = new Book(null, "New Title", "New Author", "978-0743273565",
                new BigDecimal("15.50"), LocalDate.of(2022, 3, 3), "Fantasy", 8);
        Book createdBook = new Book(3L, "New Title", "New Author", "978-0743273565",
                new BigDecimal("15.50"), LocalDate.of(2022, 3, 3), "Fantasy", 8);

        when(bookService.addBook(any(), any(), any(), any(), any(), any(), anyInt())).thenReturn(createdBook);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newBook)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Title"));
        
        assertThat(createdBook.id()).isEqualTo(3L);
    }

    @Test
    void createBook_shouldReturnBadRequestWhenInvalidISBN() throws Exception {
        Book invalidIsbnBook = new Book(null, "Valid Title", "Valid Author", "invalid-isbn-string",
                new BigDecimal("15.50"), LocalDate.of(2022, 3, 3), "Fantasy", 8);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidIsbnBook)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isbn").value("Invalid ISBN format"));
    }

    @Test
    void createBook_shouldReturnBadRequestWhenMissingRequiredFields() throws Exception {
        Book incompleteBook = new Book(null, "", "", "978-0743273565",
                new BigDecimal("-1.00"), LocalDate.of(2030, 1, 1), "", -5);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(incompleteBook)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Title cannot be blank"))
                .andExpect(jsonPath("$.author").value("Author cannot be blank"))
                .andExpect(jsonPath("$.price").value("Price must be non-negative"))
                .andExpect(jsonPath("$.stock").value("Stock must be non-negative"));
    }

    @Test
    void updateBook_shouldReturnUpdatedBookWhenValid() throws Exception {
        Book updatedBookDetails = new Book(null, "Updated Title", "Updated Author", "978-0132350884",
                new BigDecimal("12.00"), LocalDate.of(2020, 1, 1), "Fiction", 7);
        Book finalBook = new Book(1L, "Updated Title", "Updated Author", "978-0132350884",
                new BigDecimal("12.00"), LocalDate.of(2020, 1, 1), "Fiction", 7);

        when(bookService.updateBook(eq(1L), any(Book.class))).thenReturn(Optional.of(finalBook));

        mockMvc.perform(put("/api/books/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedBookDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void deleteBook_shouldReturnNoContentWhenFound() throws Exception {
        when(bookService.deleteBook(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/books/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}
