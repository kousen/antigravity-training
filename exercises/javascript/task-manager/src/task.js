/**
 * Task Manager - A Node.js task management module.
 * Exercise project for Antigravity CLI training.
 */

class Task {
  constructor(id, title, description = "", status = "pending", dueDate = null) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update(updates) {
    if (updates.title) this.title = updates.title;
    if (updates.description !== undefined) this.description = updates.description;
    if (updates.status) this.status = updates.status;
    if (updates.dueDate !== undefined) this.dueDate = updates.dueDate;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  isOverdue() {
    if (!this.dueDate) return false;
    return new Date(this.dueDate) < new Date() && this.status !== "completed";
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isOverdue: this.isOverdue(),
    };
  }
}

export default Task;
