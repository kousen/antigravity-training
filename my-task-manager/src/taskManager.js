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
    const id = Date.now().toString();
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

  listTasks() {
    return this.tasks;
  }
}
