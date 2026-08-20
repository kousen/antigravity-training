import { Task, normalizePriority, normalizeTags } from '../Task.js';
import { TaskRepository } from './TaskRepository.js';

function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'pending';
  return status.trim().toLowerCase().replace(/-/g, '_');
}

/**
 * Pure In-Memory implementation of TaskRepository.
 * Useful for fast unit testing and ephemeral sessions without file I/O.
 */
export class InMemoryTaskRepository extends TaskRepository {
  /**
   * @param {Task[]} [initialTasks=[]]
   */
  constructor(initialTasks = []) {
    super();
    this.tasks = initialTasks.map(t => (t instanceof Task ? t : Task.fromJSON(t)));
  }

  async findAll() {
    return [...this.tasks];
  }

  async findById(id) {
    const found = this.tasks.find(t => String(t.id) === String(id));
    return found ? Task.fromJSON(found.toJSON()) : null;
  }

  async add({ title, description = '', status = 'pending', dueDate = null, priority = 'medium', tags = [] }) {
    const nextId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => Number(t.id) || 0)) + 1 : 1;

    const newTask = new Task({
      id: nextId,
      title,
      description: description ? description.trim() : '',
      status: normalizeStatus(status),
      dueDate,
      priority,
      tags
    });

    this.tasks.push(newTask);
    return newTask;
  }

  async update(id, updates) {
    const index = this.tasks.findIndex(t => String(t.id) === String(id));
    if (index === -1) {
      return null;
    }
    const existing = this.tasks[index];

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

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  async delete(id) {
    const index = this.tasks.findIndex(t => String(t.id) === String(id));
    if (index === -1) {
      return false;
    }
    this.tasks.splice(index, 1);
    return true;
  }

  async saveAll(tasks) {
    this.tasks = tasks.map(t => Task.fromJSON(t.toJSON()));
  }
}
