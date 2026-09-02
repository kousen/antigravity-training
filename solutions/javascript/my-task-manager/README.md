# Node.js CLI Task Manager

A simple, robust command-line interface (CLI) application for managing personal tasks. Built with Node.js, it offers features like persistent storage, task filtering, sorting, and search capabilities.

## Features

- **Task Management**: Create, read, update, and delete tasks.
- **Persistence**: Tasks are automatically saved to a local JSON file (`tasks.json`), ensuring your data isn't lost between sessions.
- **Organization**:
  - **Filter**: View tasks by status (pending, in-progress, completed).
  - **Sort**: Order tasks by their due date to prioritize deadlines.
  - **Search**: Find tasks quickly by matching text in titles or descriptions.
- **User Experience**:
  - Interactive command-line menu.
  - Color-coded status indicators (Green for completed, Blue for in-progress, Yellow for pending).

## Prerequisites

- [Node.js](https://nodejs.org/) (version 12.0 or higher recommended)

## Installation

1.  **Clone the repository** (or download the source code):
    ```bash
    git clone <repository-url>
    cd my-task-manager
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
    *Note: The project uses standard Node.js modules for the core app. `jest` is installed as a dev dependency for testing.*

## Usage

Start the application by running:

```bash
node index.js
```

You will be presented with an interactive menu:

```text
--- Task Manager ---
1. Add Task
2. List Tasks
3. Update Task Status
4. Remove Task
5. Filter by Status
6. Sort by Due Date
7. Search Tasks
8. Exit
Select an option: 
```

### Example Workflow

**1. Adding a Task:**
Select option `1` and follow the prompts:
```text
Title: Buy Groceries
Description: Milk, Bread, Eggs
Due Date (YYYY-MM-DD): 2023-12-31
Task added with ID: 1702001234567
```

**2. Listing Tasks:**
Select option `2` to see all tasks with color-coded statuses:
```text
[1702001234567] Buy Groceries (pending)
    Description: Milk, Bread, Eggs
    Due: 2023-12-31
```

**3. Updating Status:**
Select option `3`, enter the Task ID, and choose a new status:
```text
Enter Task ID to update: 1702001234567
Current Status: pending
New Status (pending/in-progress/completed): completed
Task updated.
```

## Developer API

The core logic is encapsulated in the `TaskManager` class, allowing for easy integration or extension.

### `Task` Class
Represents a single unit of work.
- `id`: Unique identifier (String).
- `title`: Short name of the task (String).
- `description`: Detailed info (String).
- `status`: Current state (`'pending' | 'in-progress' | 'completed'`).
- `dueDate`: Date string (String).

### `TaskManager` Class

Handles business logic and data persistence.

#### Methods

- **`constructor(filePath)`**
  - Initializes the manager. Optional `filePath` overrides the default storage location.

- **`async loadTasks()`**
  - Reads and parses tasks from the storage file. Must be called before other operations.

- **`async addTask(title, description, dueDate)`**
  - Creates a new task and saves it.
  - Returns: `Promise<Task>`

- **`async removeTask(id)`**
  - Deletes a task by ID.
  - Returns: `Promise<Boolean>` (true if removed, false if not found).

- **`async updateTask(id, updates)`**
  - Updates fields of a specific task. `updates` is an object with partial Task properties.
  - Returns: `Promise<Task | null>`

- **`listTasks()`**
  - Returns: `Array<Task>` (all tasks).

- **`getTasksByStatus(status)`**
  - Filters tasks.
  - Returns: `Array<Task>`

- **`getTasksSortedByDueDate()`**
  - Returns: `Array<Task>` sorted by date (ascending).

- **`searchTasks(query)`**
  - Case-insensitive search in title and description.
  - Returns: `Array<Task>`

## Testing

The project uses [Jest](https://jestjs.io/) for testing. To run the test suite:

```bash
npm test
```

This runs unit and integration tests covering all core functionality, edge cases, and file persistence.
