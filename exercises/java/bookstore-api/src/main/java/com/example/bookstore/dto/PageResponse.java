package com.example.bookstore.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Paginated response envelope containing elements and page metadata")
public record PageResponse<T>(
    @Schema(description = "Items on the current page")
    List<T> content,

    @Schema(description = "Current page number (0-indexed)", example = "0")
    int page,

    @Schema(description = "Page size", example = "10")
    int size,

    @Schema(description = "Total number of elements across all pages", example = "42")
    long totalElements,

    @Schema(description = "Total number of pages", example = "5")
    int totalPages,

    @Schema(description = "Whether this is the first page", example = "true")
    boolean first,

    @Schema(description = "Whether this is the last page", example = "false")
    boolean last
) {
    public static <T> PageResponse<T> of(List<T> allItems, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        int totalElements = allItems.size();
        int totalPages = (int) Math.ceil((double) totalElements / safeSize);
        if (totalPages == 0) {
            totalPages = 1;
        }

        int start = Math.min(safePage * safeSize, totalElements);
        int end = Math.min(start + safeSize, totalElements);
        List<T> content = allItems.subList(start, end);

        return new PageResponse<>(
            content,
            safePage,
            safeSize,
            totalElements,
            totalPages,
            safePage == 0,
            safePage >= totalPages - 1
        );
    }
}
