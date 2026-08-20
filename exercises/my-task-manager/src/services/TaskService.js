import fs from 'node:fs/promises';
import path from 'node:path';
import { Task, normalizePriority } from '../Task.js';

/**
 * Normalizes status strings.
 * @param {string} [status]
 * @returns {string}
 */
export function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'pending';
  return status.trim().toLowerCase().replace(/-/g, '_');
}

/**
 * Pure helper to filter tasks by status.
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
 * Pure helper to filter tasks by priority.
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
 * Pure helper to filter tasks by tag.
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
 * Pure helper to sort tasks by due date.
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
 * Pure helper to sort tasks by priority (high > medium > low by default).
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
 * Pure helper to search tasks by query matching title, description, or tags.
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
 * @param {string} [title='Task List']
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
 * TaskService orchestrates domain operations and queries over a TaskRepository.
 */
export class TaskService {
  /**
   * @param {import('../repositories/TaskRepository.js').TaskRepository} repository
   */
  constructor(repository) {
    if (!repository) {
      throw new Error('TaskService requires a valid TaskRepository instance.');
    }
    this.repository = repository;
  }

  /**
   * Adds a new task.
   * @param {Object} taskData
   * @returns {Promise<Task>}
   */
  async addTask(taskData) {
    return await this.repository.add(taskData);
  }

  /**
   * Finds a task by ID.
   * @param {string|number} id
   * @returns {Promise<Task|null>}
   */
  async getTask(id) {
    return await this.repository.findById(id);
  }

  /**
   * Lists tasks with optional multi-criteria filters and sorting.
   * @param {Object} [options={}]
   * @param {string} [options.status]
   * @param {string} [options.priority]
   * @param {string} [options.tag]
   * @param {boolean} [options.overdueOnly=false]
   * @param {'asc'|'desc'} [options.sortByDueDate]
   * @param {'asc'|'desc'} [options.sortByPriority]
   * @param {string} [options.search]
   * @returns {Promise<Task[]>}
   */
  async listTasks(options = {}) {
    let tasks = await this.repository.findAll();

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
   * Updates an existing task.
   * @param {string|number} id
   * @param {Object} updates
   * @returns {Promise<Task|null>}
   */
  async updateTask(id, updates) {
    return await this.repository.update(id, updates);
  }

  /**
   * Shortcut to mark a task as completed.
   * @param {string|number} id
   * @returns {Promise<Task|null>}
   */
  async completeTask(id) {
    return await this.repository.update(id, { status: 'completed' });
  }

  /**
   * Removes a task by ID.
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async removeTask(id) {
    return await this.repository.delete(id);
  }

  /**
   * Exports tasks to a Markdown file on disk.
   * @param {string} [exportPath='TODO.md']
   * @returns {Promise<string>} Content written
   */
  async exportToFile(exportPath = 'TODO.md') {
    const tasks = await this.repository.findAll();
    const md = exportToMarkdown(tasks);
    await fs.writeFile(path.resolve(exportPath), md, 'utf8');
    return md;
  }
}
