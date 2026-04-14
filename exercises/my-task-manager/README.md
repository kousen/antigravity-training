# Node.js Task Manager CLI

A robust, interactive command-line application for managing tasks, built entirely with Node.js native modules (ESM). It features persistent JSON storage, a color-coded dashboard, priority levels, and comprehensive search/filtering capabilities.

## Features

- **Persistent Storage:** Tasks are automatically saved to and loaded from a local `data/tasks.json` file.
- **Interactive Dashboard:** Real-time summary of pending, in-progress, and completed tasks.
- **Color-Coded Output:** Visual cues for task status (Yellow for Pending, Blue for In-Progress, Green for Completed) and overdue dates.
- **Advanced Filtering & Sorting:** View all tasks, filter by status, or sort by due date.
- **Search Capabilities:** Case-insensitive search across task titles and descriptions.
- **Index-Based Selection:** Easily select tasks by their list number instead of copying full UUIDs.
- **Granular Editing:** Modify any property of a task (Title, Description, Status, Priority, Due Date).
- **Bulk Operations:** One-click clearing of all completed tasks.

---

## Installation

1. **Clone the repository** (or download the source code).
2. **Ensure you have Node.js installed** (v18 or higher recommended).
3. **Install dependencies** (required for the Jest test suite):
   ```bash
   npm install
   ```

---

## Usage

Start the application using the npm script:

```bash
npm start
```

### Sample Workflow & Output

When you start the application, you'll see the Dashboard and Main Menu:

```text
===== Dashboard Summary =====
Pending: 1 | In-Progress: 1 | Completed: 0 | Total: 2

--- Menu ---
1. List/Filter Tasks
2. Add New Task
3. Search Tasks
4. Select & Update/Edit Task
5. Clear Completed Tasks
6. Delete Task
7. Exit

Action > 1
```

If you choose `1` to List Tasks, you can view them in a formatted table:

```text
(a) All, (p) Pending, (i) In-Progress, (c) Completed, (s) Sort by Due Date
Filter/Sort: a

#   | ID       | STATUS             | PRIORITY         | DUE DATE           | TITLE
------------------------------------------------------------------------------------------
1   | fafa1830 | PENDING            | HIGH             | 2026-04-14         | Learn Gemini CLI
2   | a1b2c3d4 | IN-PROGRESS        | MEDIUM           | 2026-04-10         | Write Documentation
```
*(Note: If a task is past its due date and not completed, its date will be highlighted in red)*

---

## API Documentation (For Developers)

The core logic is decoupled from the CLI interface, making it easy to integrate into other Node.js applications.

### `Task` Class (`src/Task.js`)

Represents an individual task.

- **`constructor(title, description, dueDate, priority = 'medium', status = 'pending', id = null)`**
  - Creates a new Task instance. Auto-generates a UUID if `id` is not provided.
- **`isOverdue(todayDateString)`**
  - Returns `true` if the task is not 'completed' and the `dueDate` is before the provided date string (defaults to today).
- **`static fromJSON(data)`**
  - Factory method to re-instantiate a `Task` object from a plain JSON object.

### `TaskManager` Class (`src/TaskManager.js`)

Handles persistence and operations on the task collection.

- **`constructor(filePath = './data/tasks.json')`**
  - Initializes the manager. Does *not* load the file immediately.
- **`async init()`**
  - Reads the JSON file and populates the internal task list with `Task` instances. Creates the directory and file if they don't exist.
- **`async save()`**
  - Writes the current state of `this.tasks` to the JSON file.
- **`async addTask(title, description, dueDate, priority)`**
  - Creates a new task, adds it to the list, saves the file, and returns the new `Task` instance.
- **`async updateTask(id, updates)`**
  - Merges `updates` (object) into the task matching `id`. Prevents modification of the `id` field. Saves and returns the updated `Task`, or `null` if not found.
- **`async removeTask(id)`**
  - Deletes a task by `id`. Saves and returns `true` if successful, `false` if not found.
- **`listTasks(filterStatus)`**
  - Returns an array of tasks. If `filterStatus` is provided (e.g., `'pending'`), returns only matching tasks.
- **`searchTasks(query)`**
  - Returns an array of tasks where the `title` or `description` includes the query string (case-insensitive).
- **`async clearCompletedTasks()`**
  - Removes all tasks with status `'completed'`. Saves and returns the number of tasks removed.
- **`getSummary()`**
  - Returns an object containing counts of tasks by status: `{ pending: X, 'in-progress': Y, completed: Z, total: N }`.

---

## Development & Testing

This project uses **Jest** with Node's experimental VM modules for ES Module support.

To run the comprehensive test suite:

```bash
npm test
```
