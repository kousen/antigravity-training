import readline from 'readline';
import { TaskManager } from './taskManager.js';

const taskManager = new TaskManager('tasks.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  pending: '\x1b[33m',    // Yellow
  'in-progress': '\x1b[36m', // Cyan
  completed: '\x1b[32m', // Green
  header: '\x1b[1m\x1b[35m', // Bold Magenta
  error: '\x1b[31m'      // Red
};

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

function printTask(task) {
  const statusColor = colors[task.status] || colors.reset;
  console.log(`${colors.header}[${task.id}]${colors.reset} ${task.title} - ${statusColor}${task.status}${colors.reset} (Due: ${task.dueDate || 'N/A'})`);
  console.log(`    ${task.description}`);
}

async function main() {
  await taskManager.load();

  while (true) {
    console.log(`\n${colors.header}--- Task Manager ---${colors.reset}`);
    console.log('1. Add Task');
    console.log('2. List All Tasks');
    console.log('3. Filter Tasks by Status');
    console.log('4. Search Tasks');
    console.log('5. Sort Tasks by Due Date');
    console.log('6. Update Task');
    console.log('7. Remove Task');
    console.log('8. Exit');

    const choice = await question('Select an option: ');

    switch (choice) {
      case '1': {
        const title = await question('Title: ');
        const description = await question('Description: ');
        const dueDate = await question('Due Date (YYYY-MM-DD): ');
        const task = await taskManager.addTask(title, description, dueDate);
        console.log(`Task added with ID: ${task.id}`);
        break;
      }
      case '2': {
        const tasks = taskManager.listTasks();
        if (tasks.length === 0) {
          console.log('No tasks found.');
        } else {
          tasks.forEach(printTask);
        }
        break;
      }
      case '3': {
        const status = await question('Status to filter by (pending/in-progress/completed): ');
        const tasks = taskManager.listTasks({ status });
        if (tasks.length === 0) {
          console.log(`No tasks found with status: ${status}`);
        } else {
          tasks.forEach(printTask);
        }
        break;
      }
      case '4': {
        const searchTerm = await question('Search term (title or description): ');
        const tasks = taskManager.listTasks({ searchTerm });
        if (tasks.length === 0) {
          console.log('No matching tasks found.');
        } else {
          tasks.forEach(printTask);
        }
        break;
      }
      case '5': {
        const tasks = taskManager.listTasks({ sortBy: 'dueDate' });
        if (tasks.length === 0) {
          console.log('No tasks found.');
        } else {
          tasks.forEach(printTask);
        }
        break;
      }
      case '6': {
        const id = await question('Task ID to update: ');
        const status = await question('New status (pending/in-progress/completed): ');
        try {
          await taskManager.updateTask(id, { status });
          console.log('Task updated.');
        } catch (error) {
          console.error(`${colors.error}${error.message}${colors.reset}`);
        }
        break;
      }
      case '7': {
        const id = await question('Task ID to remove: ');
        try {
          await taskManager.removeTask(id);
          console.log('Task removed.');
        } catch (error) {
          console.error(`${colors.error}${error.message}${colors.reset}`);
        }
        break;
      }
      case '8': {
        rl.close();
        return;
      }
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
}

main().catch(console.error);
