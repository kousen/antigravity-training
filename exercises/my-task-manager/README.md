# Task Manager CLI

A lightweight, interactive command-line task management application built with Node.js ES modules, featuring persistent JSON storage, ANSI color-coded status badges, multi-criteria filtering, sorting, and search.

---

## Features

- **Interactive CLI Interface**: User-friendly menu powered natively by `node:readline/promises`.
- **JSON File Persistence**: Tasks are saved automatically to `tasks.json` with safe handling of empty or missing files.
- **Full CRUD Support**: Add, list, update (partial or full), and remove tasks seamlessly.
- **Status Filtering**: Filter tasks by status (`pending`, `in_progress` / `in-progress`, `completed`).
- **Due Date Sorting**: Sort tasks in ascending (earliest first) or descending order, with tasks lacking due dates sorted to the end.
- **Search**: Case-insensitive substring search matching task titles and descriptions.
- **ANSI Color Badges**: Visual terminal indicators:
  - `✓ [Completed]` (Green)
  - `⏳ [In Progress]` (Yellow)
  - `○ [Pending]` (Cyan)
- **Zero External Production Dependencies**: Uses only standard Node.js built-in APIs (`fs/promises`, `readline/promises`, `path`, `process`).
- **Comprehensive Test Suite**: 21+ unit and integration tests with Jest using `--experimental-vm-modules` (>98% logic coverage).

---

## Project Structure

```text
my-task-manager/
├── src/
│   ├── Task.js           # Task data model & serialization logic
│   ├── taskManager.js    # Core CRUD, persistence, filtering, sorting, & search
│   ├── colors.js         # ANSI color constants & status badge formatters
│   └── cli.js            # Interactive CLI interface & terminal prompts
├── tests/
│   └── taskManager.test.js # Jest unit, integration, and edge-case tests
├── package.json          # ES module configuration & scripts
├── tasks.json            # Generated task persistence file (runtime)
└── README.md             # Project documentation
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or later (tested on Node v26+)
- **npm**: `v9.0.0` or later

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd exercises/my-task-manager
   ```

2. Install dev dependencies (Jest for testing):
   ```bash
   npm install
   ```

---

## Usage

Start the interactive CLI:

```bash
npm start
```

### CLI Menu Options

```text
==============================
      Task Manager CLI        
==============================

Menu:
  1. List all tasks
  2. Filter tasks by status
  3. Sort tasks by due date
  4. Search tasks (title / description)
  5. Add new task
  6. Update existing task
  7. Remove task
  8. Exit
```

### Example Task Entry & Storage

Tasks are persisted in `tasks.json` with the following structure:

```json
[
  {
    "id": 1,
    "title": "Complete Antigravity training",
    "description": "Work through exercises and explore agent features",
    "status": "in_progress",
    "dueDate": "2026-08-25"
  },
  {
    "id": 2,
    "title": "Publish documentation",
    "description": "Write comprehensive README.md",
    "status": "completed",
    "dueDate": "2026-08-20"
  }
]
```

---

## Running Tests & Coverage

Run the Jest test suite:

```bash
npm test
```

Run tests with code coverage:

```bash
npm test -- --coverage
```

### Test Coverage Highlights

- **`src/Task.js`**: 100% Statements / 100% Branch / 100% Lines
- **`src/taskManager.js`**: 98.7% Lines / 97.7% Statements / 100% Functions
- **`src/colors.js`**: 84.6% Lines / 100% Functions
- **Total Passing Tests**: 21 passing unit & integration tests covering persistence, CRUD operations, gap handling, edge cases, and corrupted data protection.

---

## Programmatic API

You can also import and use the task manager functions programmatically:

```javascript
import {
  addTask,
  listTasks,
  updateTask,
  removeTask,
  filterTasksByStatus,
  sortTasksByDueDate,
  searchTasks
} from './src/taskManager.js';

// Add a new task
const task = await addTask({
  title: 'Write blog post',
  description: 'Discuss Node.js agentic workflows',
  status: 'pending',
  dueDate: '2026-09-01'
});

// List with combined filter, search, and sort
const tasks = await listTasks({
  status: 'pending',
  search: 'blog',
  sortByDueDate: 'asc'
});

// Update task status
await updateTask(task.id, { status: 'completed' });

// Remove task
await removeTask(task.id);
```

---

## License

MIT
