# My Task Manager

A command-line interface (CLI) task management application built with Node.js. It allows you to create, view, search, filter, update, and remove tasks, with all data persistently stored in a local JSON file.

## Features

- **Add Tasks**: Create new tasks with a title, description, and an optional due date.
- **List Tasks**: View all tasks with color-coded statuses.
- **Filter & Search**:
  - Filter tasks by their current status (pending, in-progress, completed).
  - Search for keywords within the task title or description.
- **Sort Tasks**: Order tasks chronologically by their due date.
- **Update Tasks**: Modify the status of an existing task.
- **Remove Tasks**: Delete tasks from the system.
- **Local Persistence**: Tasks are saved automatically to a `tasks.json` file.

## Installation

1. Ensure you have [Node.js](https://nodejs.org/) installed (v14 or higher is recommended).
2. Clone this repository or download the source code.
3. Open a terminal in the project directory.
4. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

Start the interactive CLI application by running:

```bash
npm start
```

### Example Session

```
--- Task Manager ---
1. Add Task
2. List All Tasks
3. Filter Tasks by Status
4. Search Tasks
5. Sort Tasks by Due Date
6. Update Task
7. Remove Task
8. Exit
Select an option: 1

Title: Write documentation
Description: Create a comprehensive README.md
Due Date (YYYY-MM-DD): 2026-03-01
Task added with ID: h9a2x1q

Select an option: 2

[h9a2x1q] Write documentation - pending (Due: 2026-03-01)
    Create a comprehensive README.md
```

## Running Tests

The project uses Jest for unit and integration testing. Tests ensure the reliability of the `Task` model and the `TaskManager` operations, including file persistence and edge cases.

To run the test suite:

```bash
npm test
```

To run tests with coverage reporting:

```bash
npm test -- --coverage
```

## API Documentation for Developers

The application logic is encapsulated in the `TaskManager` class, allowing it to be easily integrated into other scripts or applications.

### Class: `TaskManager`

Importing the class:
```javascript
import { TaskManager } from './src/taskManager.js';
```

#### `constructor(filePath)`
Creates a new `TaskManager` instance.
- **Parameters**: 
  - `filePath` (String): The path to the JSON file where tasks will be stored.
- **Returns**: `TaskManager` instance.

#### `async load()`
Reads the JSON file and loads tasks into memory. If the file does not exist, it initializes an empty task list and creates the file.
- **Returns**: `Promise<void>`

#### `async save()`
Serializes the current tasks in memory and writes them back to the JSON file.
- **Returns**: `Promise<void>`

#### `async addTask(title, description, dueDate)`
Creates a new task and saves it.
- **Parameters**:
  - `title` (String): The task title.
  - `description` (String): The task description.
  - `dueDate` (String|null): The due date formatted as a string (e.g., 'YYYY-MM-DD').
- **Returns**: `Promise<Task>` - The newly created task object.

#### `async removeTask(id)`
Removes a task by its ID. Throws an error if the task is not found.
- **Parameters**:
  - `id` (String): The unique identifier of the task.
- **Returns**: `Promise<Task>` - The removed task object.

#### `async updateTask(id, updates)`
Updates properties of an existing task. Throws an error if the task is not found.
- **Parameters**:
  - `id` (String): The unique identifier of the task.
  - `updates` (Object): An object containing the fields to update (e.g., `{ status: 'completed' }`).
- **Returns**: `Promise<Task>` - The updated task object.

#### `listTasks(filters = {})`
Retrieves a filtered and/or sorted array of tasks.
- **Parameters**:
  - `filters` (Object) - Optional.
    - `status` (String): Filter by exactly matching the status ('pending', 'in-progress', 'completed').
    - `searchTerm` (String): Case-insensitive search inside both title and description.
    - `sortBy` (String): Use `'dueDate'` to sort tasks chronologically.
- **Returns**: `Array<Task>` - A new array containing the matching tasks.
