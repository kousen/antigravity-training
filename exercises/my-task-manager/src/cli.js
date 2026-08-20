#!/usr/bin/env node

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  addTask,
  listTasks,
  updateTask,
  removeTask,
  filterTasksByStatus,
  filterByPriority,
  filterByTag,
  sortTasksByDueDate,
  searchTasks,
  exportTasksToFile,
  exportToMarkdown
} from './taskManager.js';
import { colors, getStatusBadge, getPriorityBadge, getOverdueBadge } from './colors.js';

/**
 * Format a task for display in the console with optional ANSI colors.
 * @param {import('./Task.js').Task} task
 * @param {boolean} [useColors=true]
 * @returns {string}
 */
export function formatTask(task, useColors = true) {
  const badge = getStatusBadge(task.status, useColors);
  const prioBadge = getPriorityBadge(task.priority, useColors);
  const overdueAlert = task.isOverdue() ? ` ${getOverdueBadge(useColors)}` : '';

  if (!useColors) {
    const due = task.dueDate ? ` (Due: ${task.dueDate})` : '';
    const tags = task.tags && task.tags.length > 0 ? ` [${task.tags.map(t => `#${t}`).join(' ')}]` : '';
    const desc = task.description ? `\n    Description: ${task.description}` : '';
    return `[#${task.id}] ${prioBadge} ${badge}${overdueAlert} ${task.title}${due}${tags}${desc}`;
  }

  const idText = `${colors.bold}${colors.gray}[#${task.id}]${colors.reset}`;
  const titleText = `${colors.bold}${task.title}${colors.reset}`;
  const dueText = task.dueDate
    ? ` ${colors.magenta}(Due: ${task.dueDate})${colors.reset}`
    : '';
  const tagsText = task.tags && task.tags.length > 0
    ? ` ${colors.cyan}${task.tags.map(t => `#${t}`).join(' ')}${colors.reset}`
    : '';
  const descText = task.description
    ? `\n    ${colors.dim}Description:${colors.reset} ${task.description}`
    : '';

  return `${idText} ${prioBadge} ${badge}${overdueAlert} ${titleText}${dueText}${tagsText}${descText}`;
}

/**
 * Display a formatted list of tasks.
 * @param {import('./Task.js').Task[]} tasks
 * @param {string} title
 */
export function displayTaskList(tasks, title = 'Tasks') {
  if (tasks.length === 0) {
    console.log(`\n${colors.dim}No matching tasks found.${colors.reset}`);
    return;
  }
  console.log(`\n${colors.bold}${colors.blue}--- ${title} (${tasks.length}) ---${colors.reset}`);
  tasks.forEach(task => console.log(formatTask(task, true)));
}

/**
 * Print CLI help message.
 */
export function printHelp() {
  console.log(`
${colors.bold}${colors.cyan}Task Manager CLI - Usage Guide${colors.reset}

${colors.bold}Interactive Mode:${colors.reset}
  node src/cli.js                      Launch interactive menu

${colors.bold}Direct Commands:${colors.reset}
  task add "<title>" [options]         Add a new task
    --desc "<text>"                      Task description
    --due "<date|tomorrow|+3d>"          Due date (supports human terms)
    --priority "<high|med|low>"          Priority level (default: med)
    --tags "<work,urgent>"               Comma-separated tags

  task list [options]                  List tasks with optional filters
    --pending                            Show pending only
    --in-progress                        Show in-progress only
    --completed                          Show completed only
    --priority "<high|med|low>"          Filter by priority
    --tag "<tagname>"                    Filter by tag
    --overdue                            Show overdue tasks only
    --sort-due                           Sort by due date (earliest first)
    --sort-priority                      Sort by priority (highest first)
    --search "<term>"                    Search title, description, or tags

  task done <id>                       Quick shortcut to mark task as completed
  task update <id> [options]           Update existing task fields
  task remove <id> (or rm)             Delete a task by ID
  task search "<query>"                Search tasks directly
  task export [file.md]                Export tasks to Markdown checklist (default: TODO.md)
  task help (or --help)                Show this help message
`);
}

/**
 * Parse CLI flag values from arguments array.
 * @param {string[]} args
 * @param {string} flag
 * @returns {string|null}
 */
export function getFlag(args, flag) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length && !args[index + 1].startsWith('--')) {
    return args[index + 1];
  }
  return null;
}

/**
 * Direct non-interactive command line dispatcher.
 * @param {string[]} argv
 * @returns {Promise<boolean>} True if handled, false if should fall back to interactive
 */
export async function handleDirectCommand(argv) {
  const [command, ...rest] = argv;

  if (!command || command === 'interactive') {
    return false;
  }

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return true;
  }

  switch (command) {
    case 'add': {
      const title = rest.find(arg => !arg.startsWith('--'));
      if (!title) {
        console.error(`${colors.red}Error: Task title is required. Example: task add "New Task"${colors.reset}`);
        return true;
      }

      const description = getFlag(rest, '--desc') || '';
      const dueDate = getFlag(rest, '--due') || null;
      const priority = getFlag(rest, '--priority') || 'medium';
      const tags = getFlag(rest, '--tags') || '';

      const task = await addTask({ title, description, dueDate, priority, tags });
      console.log(`\n${colors.green}✓ Task created!${colors.reset}`);
      console.log(formatTask(task, true));
      return true;
    }

    case 'list':
    case 'ls': {
      let status = undefined;
      if (rest.includes('--pending')) status = 'pending';
      if (rest.includes('--in-progress') || rest.includes('--in_progress')) status = 'in_progress';
      if (rest.includes('--completed')) status = 'completed';

      const priority = getFlag(rest, '--priority');
      const tag = getFlag(rest, '--tag');
      const search = getFlag(rest, '--search');
      const overdueOnly = rest.includes('--overdue');
      const sortByDueDate = rest.includes('--sort-due') ? 'asc' : undefined;
      const sortByPriority = rest.includes('--sort-priority') ? 'desc' : undefined;

      const tasks = await listTasks({
        status,
        priority,
        tag,
        search,
        overdueOnly,
        sortByDueDate,
        sortByPriority
      });

      displayTaskList(tasks, 'Tasks');
      return true;
    }

    case 'done': {
      const id = rest[0];
      if (!id) {
        console.error(`${colors.red}Error: Task ID required. Example: task done 1${colors.reset}`);
        return true;
      }
      const updated = await updateTask(id, { status: 'completed' });
      if (updated) {
        console.log(`\n${colors.green}✓ Task #${id} marked as completed!${colors.reset}`);
        console.log(formatTask(updated, true));
      } else {
        console.error(`${colors.red}Error: Task #${id} not found.${colors.reset}`);
      }
      return true;
    }

    case 'update': {
      const id = rest.find(arg => !arg.startsWith('--'));
      if (!id) {
        console.error(`${colors.red}Error: Task ID required. Example: task update 1 --status completed${colors.reset}`);
        return true;
      }
      const updates = {};
      const title = getFlag(rest, '--title');
      const desc = getFlag(rest, '--desc');
      const status = getFlag(rest, '--status');
      const due = getFlag(rest, '--due');
      const priority = getFlag(rest, '--priority');
      const tags = getFlag(rest, '--tags');

      if (title) updates.title = title;
      if (desc !== null) updates.description = desc;
      if (status) updates.status = status;
      if (due !== null) updates.dueDate = due;
      if (priority) updates.priority = priority;
      if (tags) updates.tags = tags;

      const updated = await updateTask(id, updates);
      if (updated) {
        console.log(`\n${colors.green}✓ Task #${id} updated!${colors.reset}`);
        console.log(formatTask(updated, true));
      } else {
        console.error(`${colors.red}Error: Task #${id} not found.${colors.reset}`);
      }
      return true;
    }

    case 'remove':
    case 'rm':
    case 'delete': {
      const id = rest[0];
      if (!id) {
        console.error(`${colors.red}Error: Task ID required. Example: task remove 1${colors.reset}`);
        return true;
      }
      const removed = await removeTask(id);
      if (removed) {
        console.log(`\n${colors.green}✓ Task #${id} removed successfully.${colors.reset}`);
      } else {
        console.error(`${colors.red}Error: Task #${id} not found.${colors.reset}`);
      }
      return true;
    }

    case 'search': {
      const query = rest.join(' ');
      if (!query.trim()) {
        console.error(`${colors.red}Error: Search query required. Example: task search bug${colors.reset}`);
        return true;
      }
      const results = await searchTasks(query.trim());
      displayTaskList(results, `Search results for "${query.trim()}"`);
      return true;
    }

    case 'export': {
      const targetFile = rest[0] || 'TODO.md';
      await exportTasksToFile(targetFile);
      console.log(`\n${colors.green}✓ Tasks exported successfully to ${targetFile}${colors.reset}`);
      return true;
    }

    default:
      console.error(`${colors.red}Unknown command: "${command}". Run "task help" for usage.${colors.reset}`);
      return true;
  }
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
      console.log(`  ${colors.yellow}2.${colors.reset} Filter tasks (Status / Priority / Tag / Overdue)`);
      console.log(`  ${colors.yellow}3.${colors.reset} Sort tasks (Due Date / Priority)`);
      console.log(`  ${colors.yellow}4.${colors.reset} Search tasks (title, description, tags)`);
      console.log(`  ${colors.yellow}5.${colors.reset} Add new task`);
      console.log(`  ${colors.yellow}6.${colors.reset} Update existing task`);
      console.log(`  ${colors.yellow}7.${colors.reset} Remove task`);
      console.log(`  ${colors.yellow}8.${colors.reset} Export to Markdown (TODO.md)`);
      console.log(`  ${colors.yellow}9.${colors.reset} Exit`);

      const choice = (await rl.question(`\n${colors.bold}Select an option (1-9): ${colors.reset}`)).trim();

      switch (choice) {
        case '1': {
          const tasks = await listTasks();
          displayTaskList(tasks, 'All Tasks');
          break;
        }

        case '2': {
          console.log('\nFilter by:');
          console.log('  1. Status (Pending / In Progress / Completed)');
          console.log('  2. Priority (High / Med / Low)');
          console.log('  3. Tag');
          console.log('  4. Overdue tasks only');
          const fChoice = (await rl.question('Choice (1-4): ')).trim();

          if (fChoice === '1') {
            console.log('\nSelect status: 1. Pending  2. In Progress  3. Completed');
            const sc = (await rl.question('Choice (1-3): ')).trim();
            const statusMap = { '1': 'pending', '2': 'in_progress', '3': 'completed' };
            if (statusMap[sc]) {
              const res = await filterTasksByStatus(statusMap[sc]);
              displayTaskList(res, `Filtered by ${statusMap[sc]}`);
            }
          } else if (fChoice === '2') {
            console.log('\nSelect priority: 1. High  2. Medium  3. Low');
            const pc = (await rl.question('Choice (1-3): ')).trim();
            const prioMap = { '1': 'high', '2': 'medium', '3': 'low' };
            if (prioMap[pc]) {
              const tasks = await listTasks({ priority: prioMap[pc] });
              displayTaskList(tasks, `Priority: ${prioMap[pc]}`);
            }
          } else if (fChoice === '3') {
            const tag = (await rl.question('Enter tag name: ')).trim();
            const tasks = await listTasks({ tag });
            displayTaskList(tasks, `Tagged #${tag}`);
          } else if (fChoice === '4') {
            const tasks = await listTasks({ overdueOnly: true });
            displayTaskList(tasks, 'Overdue Tasks');
          }
          break;
        }

        case '3': {
          console.log('\nSort by:');
          console.log('  1. Due Date (Earliest first)');
          console.log('  2. Due Date (Latest first)');
          console.log('  3. Priority (Highest first)');
          const sChoice = (await rl.question('Choice (1-3): ')).trim();

          if (sChoice === '1') {
            const tasks = await sortTasksByDueDate('asc');
            displayTaskList(tasks, 'Sorted by Due Date (ASC)');
          } else if (sChoice === '2') {
            const tasks = await sortTasksByDueDate('desc');
            displayTaskList(tasks, 'Sorted by Due Date (DESC)');
          } else if (sChoice === '3') {
            const tasks = await listTasks({ sortByPriority: 'desc' });
            displayTaskList(tasks, 'Sorted by Priority (Highest First)');
          }
          break;
        }

        case '4': {
          const query = await rl.question('\nEnter search query: ');
          if (query.trim()) {
            const results = await searchTasks(query.trim());
            displayTaskList(results, `Search results for "${query.trim()}"`);
          }
          break;
        }

        case '5': {
          const title = await rl.question('\nEnter task title: ');
          if (!title.trim()) {
            console.log(`${colors.red}Error: Task title cannot be empty.${colors.reset}`);
            break;
          }
          const description = await rl.question('Description (optional): ');
          const dueDate = await rl.question('Due date (e.g., today, tomorrow, +3d, YYYY-MM-DD, optional): ');
          const priority = await rl.question('Priority [high/med/low] (default med): ');
          const tags = await rl.question('Tags (comma separated, e.g. work,urgent): ');

          const created = await addTask({
            title: title.trim(),
            description: description.trim() || '',
            dueDate: dueDate.trim() || null,
            priority: priority.trim() || 'medium',
            tags: tags.trim() || []
          });
          console.log(`\n${colors.green}✓ Task created!${colors.reset}`);
          console.log(formatTask(created, true));
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
          const newDesc = await rl.question(`New description (leave blank to keep current): `);
          const newStatus = await rl.question(`New status [pending/in_progress/completed] (leave blank for "${task.status}"): `);
          const newDueDate = await rl.question(`New due date (leave blank for "${task.dueDate || 'none'}"): `);
          const newPriority = await rl.question(`New priority [high/med/low] (leave blank for "${task.priority}"): `);
          const newTags = await rl.question(`New tags (comma separated, leave blank for "${task.tags.join(',')}"): `);

          const updates = {};
          if (newTitle.trim()) updates.title = newTitle.trim();
          if (newDesc.trim()) updates.description = newDesc.trim();
          if (newStatus.trim()) updates.status = newStatus.trim();
          if (newDueDate.trim()) updates.dueDate = newDueDate.trim();
          if (newPriority.trim()) updates.priority = newPriority.trim();
          if (newTags.trim()) updates.tags = newTags.trim();

          const updated = await updateTask(id.trim(), updates);
          console.log(`\n${colors.green}✓ Task updated!${colors.reset}`);
          console.log(formatTask(updated, true));
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
          const filename = (await rl.question('Export file path (default TODO.md): ')).trim() || 'TODO.md';
          await exportTasksToFile(filename);
          console.log(`\n${colors.green}✓ Exported tasks to ${filename}${colors.reset}`);
          break;
        }

        case '9': {
          console.log(`\n${colors.cyan}Goodbye!${colors.reset}`);
          running = false;
          break;
        }

        default: {
          console.log(`${colors.red}\nInvalid choice. Please select an option between 1 and 9.${colors.reset}`);
        }
      }
    }
  } finally {
    rl.close();
  }
}

import { fileURLToPath } from 'node:url';

// Entrypoint execution only when run directly from terminal
const isDirectExecution = process.argv[1] && (
  import.meta.url === `file://${process.argv[1]}` ||
  fileURLToPath(import.meta.url) === process.argv[1]
);

if (isDirectExecution) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    handleDirectCommand(args).catch(err => {
      console.error('Error executing command:', err);
      process.exit(1);
    });
  } else {
    runCLI().catch(err => {
      console.error('Error running CLI:', err);
      process.exit(1);
    });
  }
}

