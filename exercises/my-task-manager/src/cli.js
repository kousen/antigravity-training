import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  addTask,
  listTasks,
  updateTask,
  removeTask,
  filterTasksByStatus,
  sortTasksByDueDate,
  searchTasks
} from './taskManager.js';
import { colors, getStatusBadge } from './colors.js';

/**
 * Format a task for display in the console with optional ANSI colors.
 * @param {import('./Task.js').Task} task
 * @param {boolean} [useColors=true]
 * @returns {string}
 */
export function formatTask(task, useColors = true) {
  const badge = getStatusBadge(task.status, useColors);

  if (!useColors) {
    const due = task.dueDate ? ` (Due: ${task.dueDate})` : '';
    const desc = task.description ? `\n    Description: ${task.description}` : '';
    return `[#${task.id}] ${badge} ${task.title}${due}${desc}`;
  }

  const idText = `${colors.bold}${colors.gray}[#${task.id}]${colors.reset}`;
  const titleText = `${colors.bold}${task.title}${colors.reset}`;
  const dueText = task.dueDate
    ? ` ${colors.magenta}(Due: ${task.dueDate})${colors.reset}`
    : '';
  const descText = task.description
    ? `\n    ${colors.dim}Description:${colors.reset} ${task.description}`
    : '';

  return `${idText} ${badge} ${titleText}${dueText}${descText}`;
}

/**
 * Display a formatted list of tasks.
 * @param {import('./Task.js').Task[]} tasks
 * @param {string} title
 */
function displayTaskList(tasks, title = 'Tasks') {
  if (tasks.length === 0) {
    console.log(`\n${colors.dim}No matching tasks found.${colors.reset}`);
    return;
  }
  console.log(`\n${colors.bold}${colors.blue}--- ${title} (${tasks.length}) ---${colors.reset}`);
  tasks.forEach(task => console.log(formatTask(task, true)));
}

/**
 * Run interactive CLI session.
 */
export async function runCLI() {
  const rl = readline.createInterface({ input, output });

  console.log(`\n${colors.bold}${colors.cyan}==============================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}      Task Manager CLI        ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}==============================${colors.reset}`);

  try {
    let running = true;
    while (running) {
      console.log(`\n${colors.bold}Menu:${colors.reset}`);
      console.log(`  ${colors.yellow}1.${colors.reset} List all tasks`);
      console.log(`  ${colors.yellow}2.${colors.reset} Filter tasks by status`);
      console.log(`  ${colors.yellow}3.${colors.reset} Sort tasks by due date`);
      console.log(`  ${colors.yellow}4.${colors.reset} Search tasks (title / description)`);
      console.log(`  ${colors.yellow}5.${colors.reset} Add new task`);
      console.log(`  ${colors.yellow}6.${colors.reset} Update existing task`);
      console.log(`  ${colors.yellow}7.${colors.reset} Remove task`);
      console.log(`  ${colors.yellow}8.${colors.reset} Exit`);

      const choice = (await rl.question(`\n${colors.bold}Select an option (1-8): ${colors.reset}`)).trim();

      switch (choice) {
        case '1': {
          const tasks = await listTasks();
          displayTaskList(tasks, 'All Tasks');
          break;
        }

        case '2': {
          console.log('\nSelect status to filter by:');
          console.log(`  1. ${colors.cyan}Pending${colors.reset}`);
          console.log(`  2. ${colors.yellow}In Progress${colors.reset}`);
          console.log(`  3. ${colors.green}Completed${colors.reset}`);
          const statusChoice = (await rl.question('Choice (1-3): ')).trim();

          let selectedStatus = '';
          if (statusChoice === '1') selectedStatus = 'pending';
          else if (statusChoice === '2') selectedStatus = 'in_progress';
          else if (statusChoice === '3') selectedStatus = 'completed';
          else {
            console.log(`${colors.red}Invalid status selection.${colors.reset}`);
            break;
          }

          const filtered = await filterTasksByStatus(selectedStatus);
          displayTaskList(filtered, `Filtered by "${selectedStatus}"`);
          break;
        }

        case '3': {
          console.log('\nSelect sort order:');
          console.log('  1. Ascending (Earliest due date first)');
          console.log('  2. Descending (Latest due date first)');
          const sortChoice = (await rl.question('Choice (1-2) [default 1]: ')).trim();
          const order = sortChoice === '2' ? 'desc' : 'asc';

          const sorted = await sortTasksByDueDate(order);
          displayTaskList(sorted, `Sorted by Due Date (${order.toUpperCase()})`);
          break;
        }

        case '4': {
          const query = await rl.question('\nEnter search term (matches title or description): ');
          if (!query.trim()) {
            console.log(`${colors.dim}Empty search term. Returning to menu.${colors.reset}`);
            break;
          }
          const results = await searchTasks(query.trim());
          displayTaskList(results, `Search results for "${query.trim()}"`);
          break;
        }

        case '5': {
          const title = await rl.question('\nEnter task title: ');
          if (!title.trim()) {
            console.log(`${colors.red}Error: Task title cannot be empty.${colors.reset}`);
            break;
          }
          const description = await rl.question('Enter task description (optional): ');
          const dueDate = await rl.question('Enter due date (YYYY-MM-DD, optional): ');

          const created = await addTask({
            title: title.trim(),
            description: description.trim() || '',
            dueDate: dueDate.trim() || null
          });
          console.log(`\n${colors.green}✓ Task added successfully! ID: #${created.id}${colors.reset}`);
          break;
        }

        case '6': {
          const id = await rl.question('\nEnter Task ID to update: ');
          const tasks = await listTasks();
          const task = tasks.find(t => String(t.id) === id.trim());
          if (!task) {
            console.log(`${colors.red}Error: Task #${id} not found.${colors.reset}`);
            break;
          }

          console.log(`\nEditing Task #${task.id} ("${task.title}"):`);
          const newTitle = await rl.question(`New title (leave blank for "${task.title}"): `);
          const newDesc = await rl.question(`New description (leave blank for "${task.description || 'none'}"): `);
          const newStatus = await rl.question(`New status [pending/in_progress/completed] (leave blank for "${task.status}"): `);
          const newDueDate = await rl.question(`New due date (leave blank for "${task.dueDate || 'none'}"): `);

          const updates = {};
          if (newTitle.trim()) updates.title = newTitle.trim();
          if (newDesc.trim()) updates.description = newDesc.trim();
          if (newStatus.trim()) updates.status = newStatus.trim();
          if (newDueDate.trim()) updates.dueDate = newDueDate.trim();

          const updated = await updateTask(id.trim(), updates);
          console.log(`\n${colors.green}✓ Task #${updated.id} updated successfully!${colors.reset}`);
          break;
        }

        case '7': {
          const id = await rl.question('\nEnter Task ID to remove: ');
          const removed = await removeTask(id.trim());
          if (removed) {
            console.log(`\n${colors.green}✓ Task #${id} removed successfully.${colors.reset}`);
          } else {
            console.log(`${colors.red}Error: Task #${id} not found.${colors.reset}`);
          }
          break;
        }

        case '8': {
          console.log(`\n${colors.cyan}Goodbye!${colors.reset}`);
          running = false;
          break;
        }

        default: {
          console.log(`${colors.red}\nInvalid choice. Please select an option between 1 and 8.${colors.reset}`);
        }
      }
    }
  } finally {
    rl.close();
  }
}

// Run when executed directly via node src/cli.js
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/^.*[\\/]/, ''))) {
  runCLI().catch(err => {
    console.error('Error running CLI:', err);
    process.exit(1);
  });
}
