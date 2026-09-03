# API Reference

Base URL: `/api/books`

| Method | Endpoint | Query / Path Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `page` (default 0), `size` (default 10), `sortBy` (default `id`) | List books with pagination and sorting |
| `GET` | `/{id}` | `id` (Long) | Get a specific book by ID |
| `GET` | `/search` | `q` (String) | Search books by title (case-insensitive) |
| `GET` | `/author/{author}` | `author` (String) | Filter books by author |
| `GET` | `/genre/{genre}` | `genre` (String) | Filter books by genre |
| `GET` | `/in-stock` | — | List books currently in stock (`stock > 0`) |
| `POST` | `/` | Request Body (`Book`) | Create a new book (`@Valid`, returns `201 Created`) |
| `PUT` | `/{id}` | `id` (Long), Request Body (`Book`) | Update an existing book (`@Valid`) |
| `DELETE` | `/{id}` | `id` (Long) | Delete a book (returns `204 No Content`) |
