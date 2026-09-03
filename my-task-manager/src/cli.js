import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { TaskManager } from './TaskManager.js';
import { Task } from './Task.js';

export class TaskCLI {
  constructor(taskManager = new TaskManager()) {
    this.taskManager = taskManager;
    this.rl = null;
  }

  async start() {
    await this.taskManager.init();
    this.rl = readline.createInterface({ input, output });

    console.log('\n======================================');
    console.log('   Welcome to Node.js Task Manager    ');
    console.log('======================================');

    let running = true;
    while (running) {
      this.printMenu();
      const choice = (await this.rl.question('\nSelect an option (1-5): ')).trim();

      switch (choice) {
        case '1':
          await this.handleListTasks();
          break;
        case '2':
          await this.handleAddTask();
          break;
        case '3':
          await this.handleUpdateTask();
          break;
        case '4':
          await this.handleRemoveTask();
          break;
        case '5':
          console.log('\nGoodbye!\n');
          running = false;
          break;
        default:
          console.log('Invalid option. Please choose between 1 and 5.');
          break;
      }
    }

    this.rl.close();
  }

  printMenu() {
    console.log('\n--- Menu ---');
    console.log('1. List tasks');
    console.log('2. Add task');
    console.log('3. Update task');
    console.log('4. Remove task');
    console.log('5. Exit');
  }

  async handleListTasks() {
    console.log('\nFilter options:');
    console.log('0. All tasks');
    console.log('1. Pending');
    console.log('2. In-progress');
    console.log('3. Completed');
    const filterChoice = (await this.rl.question('Filter by status (press Enter for All): ')).trim();

    let filter = {};
    if (filterChoice === '1') filter.status = 'pending';
    else if (filterChoice === '2') filter.status = 'in-progress';
    else if (filterChoice === '3') filter.status = 'completed';

    const tasks = this.taskManager.listTasks(filter);
    if (tasks.length === 0) {
      console.log('\nNo tasks found.');
      return;
    }

    console.log(`\nFound ${tasks.length} task(s):`);
    console.log('--------------------------------------------------------------------------------');
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. [${task.status.toUpperCase()}] ${task.title} (ID: ${task.id})`);
      if (task.description) {
        console.log(`   Description: ${task.description}`);
      }
      console.log(`   Due Date:    ${task.dueDate || 'None'}`);
      console.log('--------------------------------------------------------------------------------');
    });
  }

  async handleAddTask() {
    console.log('\n--- Add New Task ---');
    const title = await this.rl.question('Title (required): ');
    if (!title.trim()) {
      console.log('Error: Title cannot be empty.');
      return;
    }

    const description = await this.rl.question('Description (optional): ');
    const dueDate = await this.rl.question('Due Date (e.g. YYYY-MM-DD, optional): ');

    console.log(`Status options: ${Task.VALID_STATUSES.join(', ')}`);
    const statusInput = await this.rl.question('Status (default: pending): ');
    const status = statusInput.trim() || 'pending';

    try {
      const task = await this.taskManager.addTask({
        title,
        description,
        status,
        dueDate: dueDate.trim() || null
      });
      console.log(`\nTask added successfully with ID: ${task.id}`);
    } catch (err) {
      console.log(`Error adding task: ${err.message}`);
    }
  }

  async handleUpdateTask() {
    console.log('\n--- Update Task ---');
    const id = (await this.rl.question('Enter Task ID to update: ')).trim();
    const existing = this.taskManager.getTask(id);
    if (!existing) {
      console.log(`Task with ID "${id}" not found.`);
      return;
    }

    console.log(`\nUpdating Task: "${existing.title}"`);
    console.log('(Leave input empty to keep current value)');

    const title = await this.rl.question(`New Title [${existing.title}]: `);
    const description = await this.rl.question(`New Description [${existing.description || 'None'}]: `);
    const status = await this.rl.question(`New Status (${Task.VALID_STATUSES.join('/')}) [${existing.status}]: `);
    const dueDate = await this.rl.question(`New Due Date [${existing.dueDate || 'None'}]: `);

    const updates = {};
    if (title.trim()) updates.title = title.trim();
    if (description.trim()) updates.description = description.trim();
    if (status.trim()) updates.status = status.trim();
    if (dueDate.trim()) updates.dueDate = dueDate.trim();

    try {
      const updated = await this.taskManager.updateTask(id, updates);
      console.log(`\nTask "${updated.title}" updated successfully.`);
    } catch (err) {
      console.log(`Error updating task: ${err.message}`);
    }
  }

  async handleRemoveTask() {
    console.log('\n--- Remove Task ---');
    const id = (await this.rl.question('Enter Task ID to remove: ')).trim();
    const removed = await this.taskManager.removeTask(id);

    if (removed) {
      console.log(`Task "${removed.title}" (ID: ${removed.id}) removed successfully.`);
    } else {
      console.log(`Task with ID "${id}" not found.`);
    }
  }
}
