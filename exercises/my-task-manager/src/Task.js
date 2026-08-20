import { parseHumanDate, isDateOverdue } from './dateUtils.js';

/**
 * Normalizes priority values ('high', 'medium', 'low').
 * @param {string} [priority]
 * @returns {'high'|'medium'|'low'}
 */
export function normalizePriority(priority) {
  if (!priority || typeof priority !== 'string') return 'medium';
  const p = priority.trim().toLowerCase();
  if (p === 'high' || p === 'h' || p === '1' || p === 'p1') return 'high';
  if (p === 'low' || p === 'l' || p === '3' || p === 'p3') return 'low';
  return 'medium';
}

/**
 * Normalizes tags array or comma-separated string.
 * @param {string[]|string} [tags]
 * @returns {string[]}
 */
export function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map(t => String(t).trim().replace(/^#/, '').toLowerCase())
      .filter(t => t.length > 0);
  }
  if (typeof tags === 'string') {
    return tags
      .split(/[\s,]+/)
      .map(t => t.trim().replace(/^#/, '').toLowerCase())
      .filter(t => t.length > 0);
  }
  return [];
}

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
   * @param {string|null} [params.dueDate=null] - Optional due date string (e.g. YYYY-MM-DD or human phrase)
   * @param {string} [params.priority='medium'] - Priority ('high', 'medium', 'low')
   * @param {string[]|string} [params.tags=[]] - Category tags
   */
  constructor({
    id,
    title,
    description = '',
    status = 'pending',
    dueDate = null,
    priority = 'medium',
    tags = []
  }) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new Error('Task title is required and cannot be empty.');
    }
    this.id = id;
    this.title = title.trim();
    this.description = description ? String(description).trim() : '';
    this.status = status;
    this.dueDate = dueDate ? (parseHumanDate(dueDate) || dueDate.trim()) : null;
    this.priority = normalizePriority(priority);
    this.tags = normalizeTags(tags);
  }

  /**
   * Returns true if the task is overdue and not completed.
   * @param {Date} [referenceDate=new Date()]
   * @returns {boolean}
   */
  isOverdue(referenceDate = new Date()) {
    if (this.status === 'completed' || !this.dueDate) {
      return false;
    }
    return isDateOverdue(this.dueDate, referenceDate);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      priority: this.priority,
      tags: this.tags
    };
  }

  static fromJSON(data) {
    return new Task(data);
  }
}
