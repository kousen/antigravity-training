import fs from 'node:fs/promises';
import path from 'node:path';
import { Task } from './Task.js';

export class TaskManager {
  /**
   * @param {string} [storagePath] Absolute or relative path to the JSON storage file
   */
  constructor(storagePath = path.resolve('data', 'tasks.json')) {
    this.storagePath = storagePath;
    this.tasks = [];
  }

  /**
   * Initializes the manager by reading saved tasks from JSON storage
   */
  async init() {
    await this.load();
  }

  /**
   * Loads tasks from the JSON storage file.
   * If the file does not exist, initializes an empty task list.
   * @returns {Promise<Task[]>}
   */
  async load() {
    try {
      const data = await fs.readFile(this.storagePath, 'utf8');
      const rawTasks = JSON.parse(data);
      if (Array.isArray(rawTasks)) {
        this.tasks = rawTasks.map(item => Task.fromJSON(item));
      } else {
        this.tasks = [];
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.tasks = [];
        await this.save();
      } else {
        throw error;
      }
    }
    return this.tasks;
  }

  /**
   * Writes the current tasks array to the JSON storage file
   */
  async save() {
    const dir = path.dirname(this.storagePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.storagePath, JSON.stringify(this.tasks, null, 2), 'utf8');
  }

  /**
   * Adds a new task and persists it
   * @param {Object} taskData
   * @returns {Promise<Task>}
   */
  async addTask(taskData) {
    const task = new Task(taskData);
    this.tasks.push(task);
    await this.save();
    return task;
  }

  /**
   * Removes a task by ID and persists changes
   * @param {string} id
   * @returns {Promise<Task|null>} Removed task or null if not found
   */
  async removeTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return null;
    }
    const [removed] = this.tasks.splice(index, 1);
    await this.save();
    return removed;
  }

  /**
   * Updates an existing task by ID and persists changes
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<Task>} Updated task
   */
  async updateTask(id, updates = {}) {
    const task = this.getTask(id);
    if (!task) {
      throw new Error(`Task with id "${id}" was not found.`);
    }

    if (updates.title !== undefined) {
      if (!updates.title || typeof updates.title !== 'string' || !updates.title.trim()) {
        throw new Error('Task title cannot be empty.');
      }
      task.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      task.description = updates.description ? String(updates.description).trim() : '';
    }

    if (updates.status !== undefined) {
      const normalizedStatus = String(updates.status).toLowerCase();
      if (!Task.VALID_STATUSES.includes(normalizedStatus)) {
        throw new Error(`Invalid status "${updates.status}". Allowed statuses: ${Task.VALID_STATUSES.join(', ')}`);
      }
      task.status = normalizedStatus;
    }

    if (updates.dueDate !== undefined) {
      task.dueDate = updates.dueDate ? String(updates.dueDate).trim() : null;
    }

    await this.save();
    return task;
  }

  /**
   * Lists tasks with optional status filter
   * @param {Object} [filter={}]
   * @param {string} [filter.status]
   * @returns {Task[]}
   */
  listTasks(filter = {}) {
    if (!filter.status) {
      return [...this.tasks];
    }
    const normalizedStatus = filter.status.toLowerCase();
    return this.tasks.filter(task => task.status === normalizedStatus);
  }

  /**
   * Finds a task by ID
   * @param {string} id
   * @returns {Task|null}
   */
  getTask(id) {
    return this.tasks.find(task => task.id === id) || null;
  }
}
