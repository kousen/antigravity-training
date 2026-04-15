# Project Architecture: Bookstore API

This document provides a comprehensive technical overview of the Bookstore API's architecture, following its refactor to support **Immutability** and the **Repository Pattern**.

## 🏛️ Architectural Style
The project implements a **Four-Tier Layered Architecture** (Controller -> Service -> Repository -> Model). This structure aligns with modern Spring Boot best practices and team standards for clean code and separation of concerns.

### 1. Presentation Layer (REST API)
*   **BookController**: Handles HTTP request mapping and coordinates with the service layer. It consumes and produces immutable `Book` records.
*   **GlobalExceptionHandler**: Provides centralized error management using Spring's `@ControllerAdvice` and `@ExceptionHandler`.

### 2. Business Logic Layer
*   **BookService**: Contains core domain logic. It is decoupled from data storage, focusing on business rules like search filtering and pagination.

### 3. Data Access Layer (Persistence)
*   **BookRepository (Interface)**: Defines the contract for all data operations.
*   **InMemoryBookRepository**: A thread-safe implementation that manages the in-memory state using `ConcurrentHashMap`. This allows for easy migration to a persistent DB (like PostgreSQL) by simply swapping implementations.

### 4. Domain Layer
*   **Book (Record)**: A Java `record` providing a truly immutable data model. It includes JSR-380 validation to ensure data integrity at the system boundaries.

---

## 🗺️ System Visualization

### 1. Architectural Component Map
This diagram illustrates the flow of a request through the refactored layers.

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'lineColor': '#6366f1', 'primaryTextColor': '#f8fafc' }}}%%
graph TD
    %% Styling
    classDef client fill:#475569,stroke:#94a3b8,color:#f8fafc
    classDef web fill:#0ea5e9,stroke:#38bdf8,stroke-width:2px,color:#fff
    classDef logic fill:#22c55e,stroke:#4ade80,stroke-width:2px,color:#fff
    classDef data fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
    classDef model fill:#eab308,stroke:#fde047,stroke-width:2px,color:#333
    classDef store fill:#ef4444,stroke:#f87171,stroke-width:2px,color:#fff

    Client[🌐 REST Client]:::client
    
    subgraph Container [Spring Boot Context]
        subgraph Presentation [Web Tier]
            BC[BookController]:::web
            GEH[GlobalExceptionHandler]:::web
        end
        
        subgraph Service [Logic Tier]
            BS[BookService]:::logic
        end
        
        subgraph Repo [Data Tier]
            BR[BookRepository Interface]:::data
            IMBR[InMemoryBookRepository]:::data
        end
        
        subgraph Domain [Domain Tier]
            BM[Book Record]:::model
        end
        
        subgraph Persistence [Storage]
            CHM[ConcurrentHashMap]:::store
        end
    end

    Client ==>|HTTP| BC
    BC -->|Calls| BS
    BS -->|Queries| BR
    BR ---|Implemented by| IMBR
    IMBR -->|State in| CHM
    BC -.->|Maps to| BM
    BS -.->|Processes| BM
```

### 2. Detailed Class Schema (Post-Refactor)
Static relationships emphasizing the dependency inversion through the Repository interface.

```mermaid
classDiagram
    direction LR
    %%{init: {'theme': 'dark'}}%%
    
    class BookController {
        -BookService bookService
        +getAllBooks(...) List~Book~
        +createBook(Book book) Book
    }

    class BookService {
        -BookRepository bookRepository
        +addBook(...) Book
        +updateBook(...) Optional~Book~
    }

    class BookRepository {
        <<interface>>
        +save(Book book) Book
        +findById(Long id) Optional
        +findAll() List
    }

    class InMemoryBookRepository {
        -Map books
        +save(Book book) Book
    }

    class Book {
        <<record>>
        +Long id
        +String title
        +BigDecimal price
    }

    %% Relationships
    BookController o-- BookService
    BookService o-- BookRepository
    BookRepository <|.. InMemoryBookRepository
    BookService ..> Book : creates/mutates
    InMemoryBookRepository *-- Book : stores

    %% Styling
    style BookController fill:#0ea5e9,color:#fff
    style BookService fill:#22c55e,color:#fff
    style BookRepository fill:#8b5cf6,color:#fff
    style InMemoryBookRepository fill:#8b5cf6,color:#fff
    style Book fill:#eab308,color:#333
```

---

## 🛠️ Design Patterns Applied
*   **Dependency Inversion**: The Service depends on the `BookRepository` interface, not the concrete implementation.
*   **Immutability**: The `Book` record ensures that data cannot be modified accidentally after creation. Updates are handled by creating new record instances.
*   **Concurrency**: Thread safety is guaranteed at the repository level via `ConcurrentHashMap` and `AtomicLong`.
*   **AOP Error Handling**: `GlobalExceptionHandler` ensures that business logic doesn't need to worry about formatting error responses.
