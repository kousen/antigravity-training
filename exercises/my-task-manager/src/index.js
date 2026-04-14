import readline from 'readline';
import { TaskManager } from './TaskManager.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const taskManager = new TaskManager();
let lastList = []; // Store the most recently displayed tasks for selection by index

const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m"
};

const CURRENT_DATE = "2026-04-14";

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'completed': return COLORS.green;
        case 'in-progress': return COLORS.blue;
        case 'pending': return COLORS.yellow;
        default: return COLORS.reset;
    }
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return COLORS.red;
        case 'medium': return COLORS.cyan;
        case 'low': return COLORS.gray;
        default: return COLORS.reset;
    }
}

function displayTaskTable(tasks) {
    lastList = tasks;
    if (tasks.length === 0) {
        console.log(`\n${COLORS.gray}No tasks found.${COLORS.reset}`);
        return;
    }

    console.log(`\n${COLORS.bright}${'#'.padEnd(3)} | ${'ID'.padEnd(8)} | ${'STATUS'.padEnd(10)} | ${'PRIORITY'.padEnd(8)} | ${'DUE DATE'.padEnd(10)} | ${'TITLE'}${COLORS.reset}`);
    console.log('-'.repeat(90));

    tasks.forEach((t, i) => {
        const idShort = t.id.split('-')[0];
        const statusStr = `${getStatusColor(t.status)}${t.status.toUpperCase()}${COLORS.reset}`;
        const priorityStr = `${getPriorityColor(t.priority)}${t.priority.toUpperCase()}${COLORS.reset}`;
        
        const isOverdue = t.status !== 'completed' && t.dueDate < CURRENT_DATE;
        const dateColor = isOverdue ? COLORS.red : COLORS.reset;
        const dateStr = `${dateColor}${t.dueDate}${COLORS.reset}`;

        console.log(`${(i + 1).toString().padEnd(3)} | ${idShort.padEnd(8)} | ${statusStr.padEnd(19)} | ${priorityStr.padEnd(17)} | ${dateStr.padEnd(19)} | ${t.title}`);
    });
}

function displayTaskDetail(t) {
    const sCol = getStatusColor(t.status);
    const pCol = getPriorityColor(t.priority);
    console.log(`\n${COLORS.bright}--- Task Details ---${COLORS.reset}`);
    console.log(`ID:          ${t.id}`);
    console.log(`Title:       ${COLORS.bright}${t.title}${COLORS.reset}`);
    console.log(`Description: ${t.description}`);
    console.log(`Status:      ${sCol}${t.status.toUpperCase()}${COLORS.reset}`);
    console.log(`Priority:    ${pCol}${t.priority.toUpperCase()}${COLORS.reset}`);
    console.log(`Due Date:    ${t.dueDate}${t.dueDate < CURRENT_DATE && t.status !== 'completed' ? ` ${COLORS.red}(OVERDUE)${COLORS.reset}` : ''}`);
    console.log('--------------------');
}

async function mainMenu() {
    const summary = taskManager.getSummary();
    console.log(`\n${COLORS.bright}===== Dashboard Summary =====${COLORS.reset}`);
    console.log(`${COLORS.yellow}Pending: ${summary.pending}${COLORS.reset} | ${COLORS.blue}In-Progress: ${summary['in-progress']}${COLORS.reset} | ${COLORS.green}Completed: ${summary.completed}${COLORS.reset} | Total: ${summary.total}`);

    console.log(`\n${COLORS.bright}--- Menu ---${COLORS.reset}`);
    console.log(`1. ${COLORS.blue}List/Filter Tasks${COLORS.reset}`);
    console.log(`2. ${COLORS.green}Add New Task${COLORS.reset}`);
    console.log(`3. ${COLORS.cyan}Search Tasks${COLORS.reset}`);
    console.log(`4. ${COLORS.magenta}Select & Update/Edit Task${COLORS.reset}`);
    console.log(`5. ${COLORS.yellow}Clear Completed Tasks${COLORS.reset}`);
    console.log(`6. ${COLORS.red}Delete Task${COLORS.reset}`);
    console.log(`7. Exit`);

    const choice = await ask('\nAction > ');

    switch (choice) {
        case '1':
            console.log('\n(a) All, (p) Pending, (i) In-Progress, (c) Completed, (s) Sort by Due Date');
            const opt = (await ask('Filter/Sort: ')).toLowerCase();
            let list;
            if (opt === 'p') list = taskManager.listTasks('pending');
            else if (opt === 'i') list = taskManager.listTasks('in-progress');
            else if (opt === 'c') list = taskManager.listTasks('completed');
            else if (opt === 's') list = [...taskManager.listTasks()].sort((a,b) => a.dueDate.localeCompare(b.dueDate));
            else list = taskManager.listTasks();
            displayTaskTable(list);
            break;

        case '2':
            const title = await ask('Title: ');
            if (!title) { console.log('Title required.'); break; }
            const desc = await ask('Description: ');
            const date = await ask('Due (YYYY-MM-DD): ');
            const priority = await ask('Priority (low/medium/high): ') || 'medium';
            const newTask = await taskManager.addTask(title, desc, date, priority);
            console.log(`\n${COLORS.green}Task added!${COLORS.reset}`);
            break;

        case '3':
            const q = await ask('Search query: ');
            displayTaskTable(taskManager.searchTasks(q));
            break;

        case '4':
            if (lastList.length === 0) {
                console.log('Please list tasks first to select by #.');
                break;
            }
            const idxStr = await ask('Select task # (or ID): ');
            let target;
            const idx = parseInt(idxStr) - 1;
            if (!isNaN(idx) && lastList[idx]) {
                target = lastList[idx];
            } else {
                target = taskManager.listTasks().find(t => t.id === idxStr || t.id.startsWith(idxStr));
            }

            if (!target) { console.log('Task not found.'); break; }
            displayTaskDetail(target);
            
            console.log('Update: (t) Title, (d) Desc, (p) Priority, (s) Status, (dd) Due Date, (any) Cancel');
            const field = (await ask('Field: ')).toLowerCase();
            const newVal = await ask('New Value: ');
            
            const up = {};
            if (field === 't') up.title = newVal;
            else if (field === 'd') up.description = newVal;
            else if (field === 'p') up.priority = newVal;
            else if (field === 's') up.status = newVal;
            else if (field === 'dd') up.dueDate = newVal;
            else break;

            const updated = await taskManager.updateTask(target.id, up);
            console.log(`\n${COLORS.green}Updated!${COLORS.reset}`);
            break;

        case '5':
            const n = await taskManager.clearCompletedTasks();
            console.log(`\n${COLORS.green}Cleared ${n} tasks.${COLORS.reset}`);
            break;

        case '6':
            const rid = await ask('Task # or ID to delete: ');
            let rTask;
            const rIdx = parseInt(rid) - 1;
            if (!isNaN(rIdx) && lastList[rIdx]) rTask = lastList[rIdx];
            else rTask = taskManager.listTasks().find(t => t.id === rid || t.id.startsWith(rid));

            if (rTask && await taskManager.removeTask(rTask.id)) {
                console.log(`\n${COLORS.red}Deleted.${COLORS.reset}`);
            } else {
                console.log('Not found.');
            }
            break;

        case '7':
            console.log('\nGoodbye!');
            rl.close();
            return;

        default:
            console.log('Invalid option.');
    }
    await mainMenu();
}

async function start() {
    await taskManager.init();
    await mainMenu();
}

start().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
