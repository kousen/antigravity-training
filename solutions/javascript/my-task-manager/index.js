const readline = require('readline');
const TaskManager = require('./taskManager');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const taskManager = new TaskManager();

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m"
};

function getStatusColor(status) {
  switch (status) {
    case 'completed': return COLORS.green;
    case 'in-progress': return COLORS.blue;
    case 'pending': return COLORS.yellow;
    default: return COLORS.reset;
  }
}

function showMenu() {
  console.log('\n--- Task Manager ---');
  console.log('1. Add Task');
  console.log('2. List Tasks');
  console.log('3. Update Task Status');
  console.log('4. Remove Task');
  console.log('5. Filter by Status');
  console.log('6. Sort by Due Date');
  console.log('7. Search Tasks');
  console.log('8. Exit');
  rl.question('Select an option: ', handleMenuSelection);
}

async function handleMenuSelection(option) {
  try {
    switch (option.trim()) {
      case '1':
        await promptAddTask();
        break;
      case '2':
        displayTasks(taskManager.listTasks());
        showMenu();
        break;
      case '3':
        await promptUpdateTask();
        break;
      case '4':
        await promptRemoveTask();
        break;
      case '5':
        await promptFilterByStatus();
        break;
      case '6':
        displayTasks(taskManager.getTasksSortedByDueDate());
        showMenu();
        break;
      case '7':
        await promptSearchTasks();
        break;
      case '8':
        console.log('Goodbye!');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Invalid option. Please try again.');
        showMenu();
        break;
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    showMenu();
  }
}

async function promptAddTask() {
  rl.question('Title: ', (title) => {
    rl.question('Description: ', (description) => {
      rl.question('Due Date (YYYY-MM-DD): ', async (dueDate) => {
        const task = await taskManager.addTask(title, description, dueDate);
        console.log(`Task added with ID: ${task.id}`);
        showMenu();
      });
    });
  });
}

function displayTasks(tasks = taskManager.listTasks()) {
  if (tasks.length === 0) {
    console.log('No tasks found.');
  } else {
    tasks.forEach(task => {
      const color = getStatusColor(task.status);
      console.log(`\n${color}[${task.id}] ${task.title} (${task.status})${COLORS.reset}`);
      console.log(`    Description: ${task.description}`);
      console.log(`    Due: ${task.dueDate || 'N/A'}`);
    });
  }
}

async function promptFilterByStatus() {
  rl.question('Enter status (pending/in-progress/completed): ', (status) => {
    const tasks = taskManager.getTasksByStatus(status);
    displayTasks(tasks);
    showMenu();
  });
}

async function promptSearchTasks() {
  rl.question('Enter search term: ', (query) => {
    const tasks = taskManager.searchTasks(query);
    displayTasks(tasks);
    showMenu();
  });
}

async function promptUpdateTask() {
  rl.question('Enter Task ID to update: ', (id) => {
    const task = taskManager.getTask(id);
    if (!task) {
      console.log('Task not found.');
      showMenu();
      return;
    }

    console.log(`Current Status: ${task.status}`);
    rl.question('New Status (pending/in-progress/completed): ', async (status) => {
      if (!['pending', 'in-progress', 'completed'].includes(status)) {
        console.log('Invalid status. Update cancelled.');
      } else {
        await taskManager.updateTask(id, { status });
        console.log('Task updated.');
      }
      showMenu();
    });
  });
}

async function promptRemoveTask() {
  rl.question('Enter Task ID to remove: ', async (id) => {
    const success = await taskManager.removeTask(id);
    if (success) {
      console.log('Task removed.');
    } else {
      console.log('Task not found.');
    }
    showMenu();
  });
}

// Initialize and start
(async () => {
  await taskManager.loadTasks();
  showMenu();
})();
