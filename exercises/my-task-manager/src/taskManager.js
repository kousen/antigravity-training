import fs from 'node:fs/promises';
import path from 'node:path';
import { Task, normalizePriority, normalizeTags } from './Task.js';

export const DEFAULT_STORAGE_PATH = path.resolve('tasks.json');

/**
 * Normalizes status strings (e.g., 'in-progress' -> 'in_progress', '  Pending  ' -> 'pending').
 * @param {string} [status]
 * @returns {string}
 */
export function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'pending';
  return status.trim().toLowerCase().replace(/-/g, '_');
}

/**
 * Loads tasks from the JSON storage file.
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<Task[]>}
 */
export async function loadTasks(storagePath = DEFAULT_STORAGE_PATH) {
  try {
    const data = await fs.readFile(storagePath, 'utf8');
    const trimmed = data.trim();
    if (!trimmed) {
      return [];
    }
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed.map(item => Task.fromJSON(item)) : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Corrupted tasks storage file at ${storagePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Saves tasks array to the JSON storage file.
 * @param {Task[]} tasks
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<void>}
 */
export async function saveTasks(tasks, storagePath = DEFAULT_STORAGE_PATH) {
  const jsonContent = JSON.stringify(tasks.map(t => t.toJSON()), null, 2);
  await fs.writeFile(storagePath, jsonContent, 'utf8');
}

/**
 * Filters an array of tasks by status.
 * @param {Task[]} tasks
 * @param {string} [status]
 * @returns {Task[]}
 */
export function filterByStatus(tasks, status) {
  if (!status || typeof status !== 'string' || !status.trim()) {
    return tasks;
  }
  const target = normalizeStatus(status);
  return tasks.filter(t => normalizeStatus(t.status) === target);
}

/**
 * Filters an array of tasks by priority level.
 * @param {Task[]} tasks
 * @param {string} [priority]
 * @returns {Task[]}
 */
export function filterByPriority(tasks, priority) {
  if (!priority || typeof priority !== 'string' || !priority.trim()) {
    return tasks;
  }
  const target = normalizePriority(priority);
  return tasks.filter(t => t.priority === target);
}

/**
 * Filters an array of tasks by tag name.
 * @param {Task[]} tasks
 * @param {string} [tag]
 * @returns {Task[]}
 */
export function filterByTag(tasks, tag) {
  if (!tag || typeof tag !== 'string' || !tag.trim()) {
    return tasks;
  }
  const target = tag.trim().replace(/^#/, '').toLowerCase();
  return tasks.filter(t => t.tags && t.tags.includes(target));
}

/**
 * Sorts an array of tasks by due date.
 * Invalid, null, or missing dates are placed at the end.
 * @param {Task[]} tasks
 * @param {'asc'|'desc'} [order='asc']
 * @returns {Task[]}
 */
export function sortByDueDate(tasks, order = 'asc') {
  const normalizedOrder = order === 'desc' ? 'desc' : 'asc';

  return [...tasks].sort((a, b) => {
    const timeA = a.dueDate ? new Date(a.dueDate).getTime() : NaN;
    const timeB = b.dueDate ? new Date(b.dueDate).getTime() : NaN;

    const validA = !isNaN(timeA);
    const validB = !isNaN(timeB);

    if (!validA && !validB) return 0;
    if (!validA) return 1;
    if (!validB) return -1;

    return normalizedOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });
}

/**
 * Sorts tasks by priority (high > medium > low by default).
 * @param {Task[]} tasks
 * @param {'desc'|'asc'} [order='desc']
 * @returns {Task[]}
 */
export function sortByPriority(tasks, order = 'desc') {
  const weight = { high: 3, medium: 2, low: 1 };
  const normalizedOrder = order === 'asc' ? 'asc' : 'desc';

  return [...tasks].sort((a, b) => {
    const valA = weight[a.priority] || 2;
    const valB = weight[b.priority] || 2;
    return normalizedOrder === 'asc' ? valA - valB : valB - valA;
  });
}

/**
 * Searches an array of tasks by matching query in title, description, or tags.
 * @param {Task[]} tasks
 * @param {string} query
 * @returns {Task[]}
 */
export function searchByQuery(tasks, query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return tasks;
  }
  const q = query.trim().toLowerCase();
  return tasks.filter(task => {
    const titleMatch = (task.title || '').toLowerCase().includes(q);
    const descMatch = (task.description || '').toLowerCase().includes(q);
    const tagMatch = task.tags && task.tags.some(t => t.toLowerCase().includes(q));
    return titleMatch || descMatch || tagMatch;
  });
}

/**
 * Converts a list of tasks into formatted Markdown.
 * @param {Task[]} tasks
 * @param {string} [title='Tasks']
 * @returns {string}
 */
export function exportToMarkdown(tasks, title = 'Task List') {
  const lines = [`# ${title}\n`];

  if (tasks.length === 0) {
    lines.push('_No tasks found._\n');
    return lines.join('\n');
  }

  tasks.forEach(task => {
    const check = task.status === 'completed' ? 'x' : ' ';
    const prio = task.priority ? ` [${task.priority.toUpperCase()}]` : '';
    const due = task.dueDate ? ` *(Due: ${task.dueDate})*` : '';
    const tags = task.tags && task.tags.length > 0 ? ` ${task.tags.map(t => `#${t}`).join(' ')}` : '';
    const desc = task.description ? `\n  > ${task.description}` : '';

    lines.push(`- [${check}] **#${task.id}** ${task.title}${prio}${due}${tags}${desc}`);
  });

  return lines.join('\n');
}

/**
 * Adds a new task and persists it.
 * @param {Object} taskData
 * @param {string} taskData.title
 * @param {string} [taskData.description='']
 * @param {string} [taskData.status='pending']
 * @param {string|null} [taskData.dueDate=null]
 * @param {string} [taskData.priority='medium']
 * @param {string[]|string} [taskData.tags=[]]
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<Task>}
 */
export async function addTask(
  {
    title,
    description = '',
    status = 'pending',
    dueDate = null,
    priority = 'medium',
    tags = []
  },
  storagePath = DEFAULT_STORAGE_PATH
) {
  const tasks = await loadTasks(storagePath);
  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => Number(t.id) || 0)) + 1 : 1;
  const newTask = new Task({
    id: nextId,
    title,
    description: description ? description.trim() : '',
    status: normalizeStatus(status),
    dueDate,
    priority,
    tags
  });
  tasks.push(newTask);
  await saveTasks(tasks, storagePath);
  return newTask;
}

/**
 * Lists tasks with optional filtering, sorting, and search query.
 * @param {Object} [options={}]
 * @param {string} [options.status]
 * @param {string} [options.priority]
 * @param {string} [options.tag]
 * @param {boolean} [options.overdueOnly=false]
 * @param {'asc'|'desc'} [options.sortByDueDate]
 * @param {'asc'|'desc'} [options.sortByPriority]
 * @param {string} [options.search]
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<Task[]>}
 */
export async function listTasks(options = {}, storagePath = DEFAULT_STORAGE_PATH) {
  let tasks = await loadTasks(storagePath);

  if (options.status) {
    tasks = filterByStatus(tasks, options.status);
  }
  if (options.priority) {
    tasks = filterByPriority(tasks, options.priority);
  }
  if (options.tag) {
    tasks = filterByTag(tasks, options.tag);
  }
  if (options.overdueOnly) {
    tasks = tasks.filter(t => t.isOverdue());
  }
  if (options.search) {
    tasks = searchByQuery(tasks, options.search);
  }
  if (options.sortByDueDate) {
    tasks = sortByDueDate(tasks, options.sortByDueDate);
  }
  if (options.sortByPriority) {
    tasks = sortByPriority(tasks, options.sortByPriority);
  }

  return tasks;
}

/**
 * Filters tasks from storage by status.
 * @param {string} status
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<Task[]>}
 */
export async function filterTasksByStatus(status, storagePath = DEFAULT_STORAGE_PATH) {
  const tasks = await loadTasks(storagePath);
  return filterByStatus(tasks, status);
}

/**
 * Sorts tasks from storage by due date.
 * @param {'asc'|'desc'} [order='asc']
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<Task[]>}
 */
export async function sortTasksByDueDate(order = 'asc', storagePath = DEFAULT_STORAGE_PATH) {
  const tasks = await loadTasks(storagePath);
  return sortByDueDate(tasks, order);
}

/**
 * Searches tasks from storage by query in title, description, or tags.
 * @param {string} query
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<Task[]>}
 */
export async function searchTasks(query, storagePath = DEFAULT_STORAGE_PATH) {
  const tasks = await loadTasks(storagePath);
  return searchByQuery(tasks, query);
}

/**
 * Updates a task by ID.
 * @param {string|number} id
 * @param {Object} updates
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<Task|null>}
 */
export async function updateTask(id, updates, storagePath = DEFAULT_STORAGE_PATH) {
  const tasks = await loadTasks(storagePath);
  const index = tasks.findIndex(t => String(t.id) === String(id));
  if (index === -1) {
    return null;
  }
  const existing = tasks[index];

  const newTitle = updates.title !== undefined
    ? (updates.title.trim() || existing.title)
    : existing.title;

  const newDescription = updates.description !== undefined
    ? (updates.description ? updates.description.trim() : '')
    : existing.description;

  const newStatus = updates.status !== undefined
    ? normalizeStatus(updates.status)
    : existing.status;

  const newDueDate = updates.dueDate !== undefined
    ? (updates.dueDate ? String(updates.dueDate).trim() : null)
    : existing.dueDate;

  const newPriority = updates.priority !== undefined
    ? normalizePriority(updates.priority)
    : existing.priority;

  const newTags = updates.tags !== undefined
    ? normalizeTags(updates.tags)
    : existing.tags;

  const updatedTask = new Task({
    id: existing.id,
    title: newTitle,
    description: newDescription,
    status: newStatus,
    dueDate: newDueDate,
    priority: newPriority,
    tags: newTags
  });

  tasks[index] = updatedTask;
  await saveTasks(tasks, storagePath);
  return updatedTask;
}

/**
 * Removes a task by ID.
 * @param {string|number} id
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<boolean>}
 */
export async function removeTask(id, storagePath = DEFAULT_STORAGE_PATH) {
  const tasks = await loadTasks(storagePath);
  const index = tasks.findIndex(t => String(t.id) === String(id));
  if (index === -1) {
    return false;
  }
  tasks.splice(index, 1);
  await saveTasks(tasks, storagePath);
  return true;
}

/**
 * Exports tasks to a Markdown file.
 * @param {string} [exportPath='TODO.md']
 * @param {string} [storagePath=DEFAULT_STORAGE_PATH]
 * @returns {Promise<string>} Content written
 */
export async function exportTasksToFile(exportPath = 'TODO.md', storagePath = DEFAULT_STORAGE_PATH) {
  const tasks = await loadTasks(storagePath);
  const md = exportToMarkdown(tasks);
  await fs.writeFile(path.resolve(exportPath), md, 'utf8');
  return md;
}
