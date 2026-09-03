# Node.js Task Manager

A modular, lightweight Node.js Task Manager application built with ES Modules, JSON file persistence, and an interactive CLI powered by Node's built-in `readline`.

## Features

- **[`Task`](src/Task.js) Class**: Encapsulates `id`, `title`, `description`, `status` (`pending`, `in-progress`, `completed`), and `dueDate`.
- **[`TaskManager`](src/TaskManager.js)**: Provides asynchronous methods to add, remove, update, and list tasks with auto-saving to JSON storage.
- **Persistent Storage**: Data is saved to and loaded from `data/tasks.json` by default.
- **CLI Interface**: Interactive terminal interface (`src/cli.js`) using `node:readline/promises`.
- **Jest Test Suite**: Comprehensive tests executed via `--experimental-vm-modules`.

## Project Structure

```
.
├── data/
│   └── tasks.json            # Auto-generated persistent JSON storage
├── src/
│   ├── Task.js               # Task model definition and validation
│   ├── TaskManager.js        # CRUD logic and JSON persistence
│   ├── cli.js                # Interactive Readline CLI interface
│   └── index.js              # Application entry point
├── test/
│   ├── Task.test.js          # Unit tests for Task class
│   └── TaskManager.test.js   # Unit & persistence tests for TaskManager
├── package.json
└── README.md
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Task Manager CLI
```bash
npm start
```

### 3. Run Tests
```bash
npm test
```
