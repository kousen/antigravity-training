import { randomUUID } from 'node:crypto';

export class Task {
  static VALID_STATUSES = ['pending', 'in-progress', 'completed'];

  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} params.title
   * @param {string} [params.description='']
   * @param {string} [params.status='pending']
   * @param {string|null} [params.dueDate=null]
   */
  constructor({ id = randomUUID(), title, description = '', status = 'pending', dueDate = null }) {
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new Error('Task title is required and cannot be empty.');
    }

    const normalizedStatus = status.toLowerCase();
    if (!Task.VALID_STATUSES.includes(normalizedStatus)) {
      throw new Error(`Invalid status "${status}". Allowed statuses: ${Task.VALID_STATUSES.join(', ')}`);
    }

    this.id = id;
    this.title = title.trim();
    this.description = description ? description.trim() : '';
    this.status = normalizedStatus;
    this.dueDate = dueDate ? String(dueDate).trim() : null;
  }

  /**
   * Creates a Task instance from plain JSON object
   * @param {Object} json
   * @returns {Task}
   */
  static fromJSON(json) {
    return new Task({
      id: json.id,
      title: json.title,
      description: json.description,
      status: json.status,
      dueDate: json.dueDate
    });
  }

  /**
   * Serializes task object to plain JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate
    };
  }
}
