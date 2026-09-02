/**
 * TaskManager - Manages a collection of tasks.
 */

import fs from "node:fs/promises";
import path from "node:path";
import Task from "./task.js";

class TaskManager {
  constructor(storageFile = "tasks.json") {
    this.tasks = new Map();
    this.storageFile = storageFile;
    this.nextId = 1;
  }

  async load() {
    try {
      const data = await fs.readFile(this.storageFile, "utf8");
      const parsed = JSON.parse(data);
      this.nextId = parsed.nextId || 1;
      parsed.tasks.forEach((taskData) => {
        const task = new Task(
          taskData.id,
          taskData.title,
          taskData.description,
          taskData.status,
          taskData.dueDate
        );
        task.createdAt = taskData.createdAt;
        task.updatedAt = taskData.updatedAt;
        this.tasks.set(task.id, task);
      });
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      // File doesn't exist, start fresh
    }
  }

  async save() {
    const data = {
      nextId: this.nextId,
      tasks: Array.from(this.tasks.values()).map((t) => t.toJSON()),
    };
    await fs.writeFile(this.storageFile, JSON.stringify(data, null, 2));
  }

  addTask(title, description = "", dueDate = null) {
    const task = new Task(this.nextId++, title, description, "pending", dueDate);
    this.tasks.set(task.id, task);
    return task;
  }

  getTask(id) {
    return this.tasks.get(id);
  }

  updateTask(id, updates) {
    const task = this.tasks.get(id);
    if (!task) return null;
    return task.update(updates);
  }

  deleteTask(id) {
    return this.tasks.delete(id);
  }

  listTasks(filter = {}) {
    let tasks = Array.from(this.tasks.values());

    if (filter.status) {
      tasks = tasks.filter((t) => t.status === filter.status);
    }

    if (filter.overdue) {
      tasks = tasks.filter((t) => t.isOverdue());
    }

    if (filter.sortBy === "dueDate") {
      tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    return tasks;
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.tasks.values()).filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    );
  }

  getStats() {
    const all = Array.from(this.tasks.values());
    return {
      total: all.length,
      pending: all.filter((t) => t.status === "pending").length,
      inProgress: all.filter((t) => t.status === "in-progress").length,
      completed: all.filter((t) => t.status === "completed").length,
      overdue: all.filter((t) => t.isOverdue()).length,
    };
  }
}

export default TaskManager;
