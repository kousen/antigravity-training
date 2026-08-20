package com.example.bookstore.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Book Bean Validation Unit Tests")
class BookValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    private Book createValidBook() {
        return new Book(1L, "Valid Title", "Valid Author", "978-0123456789",
                new BigDecimal("19.99"), LocalDate.now().minusDays(10), "Fiction", 5);
    }

    @Test
    @DisplayName("Valid book should have no constraint violations")
    void validBook_shouldHaveNoViolations() {
        Book book = createValidBook();
        Set<ConstraintViolation<Book>> violations = validator.validate(book);
        assertThat(violations).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    @DisplayName("Blank title should produce validation error")
    void blankTitle_shouldFailValidation(String invalidTitle) {
        Book book = new Book(1L, invalidTitle, "Author", "ISBN", new BigDecimal("10.00"),
                LocalDate.now().minusDays(1), "Fiction", 5);

        Set<ConstraintViolation<Book>> violations = validator.validate(book);
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("Title cannot be blank");
    }

    @Test
    @DisplayName("Future published date should fail validation")
    void futurePublishedDate_shouldFailValidation() {
        Book book = new Book(1L, "Title", "Author", "ISBN", new BigDecimal("10.00"),
                LocalDate.now().plusDays(1), "Fiction", 5);

        Set<ConstraintViolation<Book>> violations = validator.validate(book);
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("Published date cannot be in the future");
    }

    @Test
    @DisplayName("Negative stock should fail validation")
    void negativeStock_shouldFailValidation() {
        Book book = new Book(1L, "Title", "Author", "ISBN", new BigDecimal("10.00"),
                LocalDate.now().minusDays(1), "Fiction", -1);

        Set<ConstraintViolation<Book>> violations = validator.validate(book);
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("Stock must be non-negative");
    }

    @Test
    @DisplayName("Negative price should fail validation")
    void negativePrice_shouldFailValidation() {
        Book book = new Book(1L, "Title", "Author", "ISBN", new BigDecimal("-0.01"),
                LocalDate.now().minusDays(1), "Fiction", 5);

        Set<ConstraintViolation<Book>> violations = validator.validate(book);
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("Price must be non-negative");
    }

    @Test
    @DisplayName("Zero price and zero stock are valid")
    void zeroPriceAndStock_shouldBeValid() {
        Book book = new Book(1L, "Title", "Author", "ISBN", BigDecimal.ZERO,
                LocalDate.now().minusDays(1), "Fiction", 0);

        Set<ConstraintViolation<Book>> violations = validator.validate(book);
        assertThat(violations).isEmpty();
        assertThat(book.isInStock()).isFalse();
    }
}
