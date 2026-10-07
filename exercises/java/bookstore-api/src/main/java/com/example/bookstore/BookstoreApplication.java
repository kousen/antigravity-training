package com.example.bookstore;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Bookstore API - A Spring Boot REST API for managing books.
 * Exercise project for Antigravity CLI training.
 */
@OpenAPIDefinition(
        info = @Info(
                title = "Bookstore API",
                version = "1.0.0",
                description = "REST API for managing books in a bookstore - Antigravity CLI training exercise",
                contact = @Contact(name = "Bookstore Team", email = "support@example.com")
        )
)
@SpringBootApplication
public class BookstoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookstoreApplication.class, args);
    }
}
