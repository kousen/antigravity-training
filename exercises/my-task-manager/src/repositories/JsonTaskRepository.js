import fs from 'node:fs/promises';
import path from 'node:path';
import { Task, normalizePriority, normalizeTags } from '../Task.js';
import { TaskRepository } from './TaskRepository.js';

export const DEFAULT_JSON_PATH = path.resolve('tasks.json');

/**
 * Normalizes status strings.
 * @param {string} [status]
 * @returns {string}
 */
function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'pending';
  return status.trim().toLowerCase().replace(/-/g, '_');
}

/**
 * File-based JSON implementation of TaskRepository.
 * Handles missing files, empty files, and corrupted data gracefully.
 */
export class JsonTaskRepository extends TaskRepository {
  /**
   * @param {string} [filePath=DEFAULT_JSON_PATH]
   */
  constructor(filePath = DEFAULT_JSON_PATH) {
    super();
    this.filePath = path.resolve(filePath);
  }

  /**
   * Loads all tasks from the JSON file.
   * @returns {Promise<Task[]>}
   */
  async findAll() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
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
        throw new Error(`Corrupted tasks storage file at ${this.filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Finds a task by ID.
   * @param {string|number} id
   * @returns {Promise<Task|null>}
   */
  async findById(id) {
    const tasks = await this.findAll();
    const found = tasks.find(t => String(t.id) === String(id));
    return found || null;
  }

  /**
   * Adds and persists a new task with an auto-generated unique ID.
   * @param {Object} taskData
   * @returns {Promise<Task>}
   */
  async add({ title, description = '', status = 'pending', dueDate = null, priority = 'medium', tags = [] }) {
    const tasks = await this.findAll();
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
    await this.saveAll(tasks);
    return newTask;
  }

  /**
   * Updates an existing task by ID and persists changes.
   * @param {string|number} id
   * @param {Object} updates
   * @returns {Promise<Task|null>}
   */
  async update(id, updates) {
    const tasks = await this.findAll();
    const index = tasks.findIndex(t => String(t.id) === String(id));
    if (index === -1) {
      return null;
    }
    const existing = tasks[index];

    const newTitle = updates.title !== undefined
      ? (updates.title.trim() || existing.title)
      : existing.title;

    const newDescription = updates.description !== undefined
      ? (updates.description ? String(updates.description).trim() : '')
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
    await this.saveAll(tasks);
    return updatedTask;
  }

  /**
   * Deletes a task by ID.
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const tasks = await this.findAll();
    const index = tasks.findIndex(t => String(t.id) === String(id));
    if (index === -1) {
      return false;
    }
    tasks.splice(index, 1);
    await this.saveAll(tasks);
    return true;
  }

  /**
   * Saves all tasks to the JSON file.
   * @param {Task[]} tasks
   * @returns {Promise<void>}
   */
  async saveAll(tasks) {
    const jsonContent = JSON.stringify(tasks.map(t => t.toJSON()), null, 2);
    await fs.writeFile(this.filePath, jsonContent, 'utf8');
  }
}
