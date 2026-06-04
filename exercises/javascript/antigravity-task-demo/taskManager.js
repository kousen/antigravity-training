const fs = require('fs').promises;
const path = require('path');
const Task = require('./task');

const DATA_FILE = path.join(__dirname, 'tasks.json');

class TaskManager {
  constructor(filePath = DATA_FILE) {
    this.tasks = [];
    this.filePath = filePath;
  }

  async loadTasks() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      const parsedTasks = JSON.parse(data);
      // Reconstitute Task objects
      this.tasks = parsedTasks.map(t => new Task(t.id, t.title, t.description, t.status, t.dueDate));
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, start with empty list
        this.tasks = [];
      } else {
        throw error;
      }
    }
  }

  async saveTasks() {
    await fs.writeFile(this.filePath, JSON.stringify(this.tasks, null, 2), 'utf8');
  }

  async addTask(title, description, dueDate) {
    const id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    const newTask = new Task(id, title, description, 'pending', dueDate);
    this.tasks.push(newTask);
    await this.saveTasks();
    return newTask;
  }

  async removeTask(id) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    if (this.tasks.length !== initialLength) {
      await this.saveTasks();
      return true;
    }
    return false;
  }

  async updateTask(id, updates) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      const task = this.tasks[taskIndex];
      // Update properties if provided in updates object
      if (updates.title) task.title = updates.title;
      if (updates.description) task.description = updates.description;
      if (updates.status) task.status = updates.status;
      if (updates.dueDate) task.dueDate = updates.dueDate;
      
      await this.saveTasks();
      return task;
    }
    return null;
  }

  listTasks() {
    return this.tasks;
  }

  getTasksByStatus(status) {
    return this.tasks.filter(task => task.status === status);
  }

  getTasksSortedByDueDate() {
    return [...this.tasks].sort((a, b) => {
      // Handle null due dates (treat as far future or past depending on preference, usually last)
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  searchTasks(query) {
    const lowerQuery = query.toLowerCase();
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) || 
      task.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  getTask(id) {
    return this.tasks.find(task => task.id === id);
  }
}

module.exports = TaskManager;
