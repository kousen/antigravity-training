# Task Manager CLI

A fast, interactive and direct command-line task management tool built with Node.js ES modules. Features persistent JSON storage, ANSI color-coded status & priority badges, human-friendly date parsing, overdue indicators, category tags, and Markdown (`TODO.md`) export.

---

## Key Features

- **Dual Interaction Modes**:
  - **Direct Non-Interactive Commands**: Fast terminal commands for scripts, aliases, and quick additions (`task add ...`, `task list`, `task done 1`).
  - **Interactive CLI Menu**: Interactive prompt loop powered by `node:readline/promises`.
- **Priority Levels**: Support for `high`, `medium`, and `low` with visual badges:
  - 🔴 `[HIGH]`
  - 🟡 `[MED]`
  - 🔵 `[LOW]`
- **Human-Friendly Due Dates & Overdue Alerts**:
  - Accepts natural phrases: `"today"`, `"tomorrow"`, `"+3d"`, `"+7days"`, or standard `YYYY-MM-DD`.
  - Automatically flags overdue pending tasks with `⚠️ [OVERDUE]`.
- **Category Tags**: Tag tasks (e.g. `work`, `urgent`, `dev`) and filter or search by tags (`task list --tag work`).
- **Markdown Export**: Export your tasks into a formatted `TODO.md` checklist (`task export`).
- **JSON File Persistence**: Automatically persists to `tasks.json` with safe handling of missing, empty, or corrupted files.
- **Multi-Criteria Filtering & Sorting**: Filter by status, priority, tag, overdue state, and sort by due date or priority.
- **Zero External Runtime Dependencies**: Built entirely with native Node.js APIs.
- **Comprehensive Automated Test Suite**: 27 unit, integration, and edge-case tests with Jest using `--experimental-vm-modules`.

---

## Project Structure

```text
my-task-manager/
├── src/
│   ├── Task.js           # Task data model with priorities, tags, & overdue check
│   ├── dateUtils.js      # Natural language date parsing & overdue checking
│   ├── taskManager.js    # Core CRUD, persistence, filtering, sorting, & markdown export
│   ├── colors.js         # ANSI colors, status badges, priority badges, & overdue alerts
│   └── cli.js            # Direct CLI argument dispatcher & interactive readline menu
├── tests/
│   ├── dateUtils.test.js # Unit tests for date parsing & overdue detection
│   └── taskManager.test.js # Jest unit & integration tests
├── package.json          # ES module configuration & bin executables
├── tasks.json            # Generated task persistence file (runtime)
└── README.md             # Project documentation
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: `v18.0.0` or later
- **npm**: `v9.0.0` or later

### Install Dependencies

```bash
cd exercises/my-task-manager
npm install
```

### Global CLI Access (Optional)

To use the `task` and `tasks` commands anywhere in your terminal:

```bash
npm link
```

---

## CLI Usage

### Direct Commands

```bash
# Add tasks (supports human dates, priorities, and tags)
task add "Fix authentication bug" --due tomorrow --priority high --tags "security,backend"
task add "Review quarterly report" --due +3d --priority medium --tags "finance"
task add "Buy groceries" --due today --priority low

# List tasks with filters & sorting
task list
task list --pending
task list --completed
task list --priority high
task list --tag security
task list --overdue
task list --sort-due
task list --sort-priority
task list --search "auth"

# Quick completion
task done 1

# Update tasks
task update 1 --priority low --due +5d

# Search tasks
task search "security"

# Delete a task
task remove 1

# Export tasks to Markdown checklist
task export TODO.md

# View help
task help
```

---

### Interactive Menu Mode

Launch the interactive prompt by running the command with no arguments:

```bash
npm start
# or: node src/cli.js
```

```text
==============================
      Task Manager CLI        
==============================

Menu:
  1. List all tasks
  2. Filter tasks (Status / Priority / Tag / Overdue)
  3. Sort tasks (Due Date / Priority)
  4. Search tasks (title, description, tags)
  5. Add new task
  6. Update existing task
  7. Remove task
  8. Export to Markdown (TODO.md)
  9. Exit
```

---

## Running Tests

Run the complete test suite:

```bash
npm test
```

Run tests with code coverage:

```bash
npm test -- --coverage
```

---

## Programmatic API

```javascript
import {
  addTask,
  listTasks,
  updateTask,
  removeTask,
  exportTasksToFile
} from './src/taskManager.js';

// Add a task with human date, priority, and tags
const task = await addTask({
  title: 'Implement OAuth2 flow',
  description: 'Add Google and GitHub providers',
  dueDate: 'tomorrow',
  priority: 'high',
  tags: ['auth', 'api']
});

// List with multiple criteria
const tasks = await listTasks({
  priority: 'high',
  tag: 'auth',
  sortByDueDate: 'asc'
});

// Mark as completed
await updateTask(task.id, { status: 'completed' });

// Export to Markdown
await exportTasksToFile('TODO.md');
```

---

## License

MIT
