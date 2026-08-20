/**
 * Represents a single task item.
 */
export class Task {
  /**
   * @param {Object} params
   * @param {string|number} params.id - Unique task identifier
   * @param {string} params.title - Title of the task
   * @param {string} [params.description=''] - Optional description
   * @param {string} [params.status='pending'] - Task status ('pending', 'in_progress', 'completed')
   * @param {string|null} [params.dueDate=null] - Optional due date string (e.g. YYYY-MM-DD)
   */
  constructor({ id, title, description = '', status = 'pending', dueDate = null }) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new Error('Task title is required and cannot be empty.');
    }
    this.id = id;
    this.title = title.trim();
    this.description = description ? description.trim() : '';
    this.status = status;
    this.dueDate = dueDate;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate
    };
  }

  static fromJSON(data) {
    return new Task(data);
  }
}
