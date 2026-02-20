import readline from 'readline';
import { TaskManager } from './taskManager.js';

const taskManager = new TaskManager('tasks.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  await taskManager.load();

  while (true) {
    console.log('
--- Task Manager ---');
    console.log('1. Add Task');
    console.log('2. List Tasks');
    console.log('3. Update Task');
    console.log('4. Remove Task');
    console.log('5. Exit');

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
          tasks.forEach(task => {
            console.log(`[${task.id}] ${task.title} - ${task.status} (Due: ${task.dueDate || 'N/A'})`);
            console.log(`    ${task.description}`);
          });
        }
        break;
      }
      case '3': {
        const id = await question('Task ID to update: ');
        const status = await question('New status (pending/completed): ');
        try {
          await taskManager.updateTask(id, { status });
          console.log('Task updated.');
        } catch (error) {
          console.error(error.message);
        }
        break;
      }
      case '4': {
        const id = await question('Task ID to remove: ');
        try {
          await taskManager.removeTask(id);
          console.log('Task removed.');
        } catch (error) {
          console.error(error.message);
        }
        break;
      }
      case '5': {
        rl.close();
        return;
      }
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
}

main().catch(console.error);
