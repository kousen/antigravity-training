import fs from 'fs/promises';
import { Task } from './models/Task.js';

export class TaskManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.tasks = [];
  }

  async load() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      const jsonTasks = JSON.parse(data);
      this.tasks = jsonTasks.map(jsonTask => Task.fromJSON(jsonTask));
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.tasks = [];
        await this.save();
      } else {
        throw error;
      }
    }
  }

  async save() {
    const data = JSON.stringify(this.tasks, null, 2);
    await fs.writeFile(this.filePath, data, 'utf8');
  }

  async addTask(title, description, dueDate) {
    const id = Math.random().toString(36).substr(2, 9);
    const newTask = new Task(id, title, description, 'pending', dueDate);
    this.tasks.push(newTask);
    await this.save();
    return newTask;
  }

  async removeTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found.`);
    }
    const removedTask = this.tasks.splice(index, 1)[0];
    await this.save();
    return removedTask;
  }

  async updateTask(id, updates) {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }
    Object.assign(task, updates);
    await this.save();
    return task;
  }

  listTasks(filters = {}) {
    let filteredTasks = [...this.tasks];

    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term)
      );
    }

    if (filters.sortBy === 'dueDate') {
      filteredTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    return filteredTasks;
  }
}
