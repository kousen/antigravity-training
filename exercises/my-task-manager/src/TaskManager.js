import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { Task } from './Task.js';

export class TaskManager {
    constructor(filePath = './data/tasks.json') {
        this.filePath = filePath;
        this.tasks = [];
    }

    async init() {
        try {
            const dirPath = path.dirname(this.filePath);
            if (!existsSync(dirPath)) {
                await fs.mkdir(dirPath, { recursive: true });
            }

            if (existsSync(this.filePath)) {
                const data = await fs.readFile(this.filePath, 'utf-8');
                if (data.trim() === '') {
                    this.tasks = [];
                } else {
                    const parsed = JSON.parse(data);
                    this.tasks = Array.isArray(parsed) ? parsed.map(t => Task.fromJSON(t)) : [];
                }
            } else {
                this.tasks = [];
                await this.save();
            }
        } catch (error) {
            console.error('Error initializing TaskManager:', error.message);
            this.tasks = [];
        }
    }

    async save() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.tasks, null, 2));
        } catch (error) {
            console.error('Error saving tasks:', error.message);
        }
    }

    async addTask(title, description, dueDate, priority = 'medium') {
        const task = new Task(title, description, dueDate, priority);
        this.tasks.push(task);
        await this.save();
        return task;
    }

    async removeTask(id) {
        const initialCount = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== id);
        if (this.tasks.length !== initialCount) {
            await this.save();
            return true;
        }
        return false;
    }

    async updateTask(id, updates) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            // Filter out internal fields that shouldn't be edited via this method
            const { id: _, ...safeUpdates } = updates;
            this.tasks[index] = { ...this.tasks[index], ...safeUpdates };
            await this.save();
            return this.tasks[index];
        }
        return null;
    }

    listTasks(filterStatus) {
        if (filterStatus) {
            return this.tasks.filter(t => t.status === filterStatus);
        }
        return this.tasks;
    }

    searchTasks(query) {
        const lowerQuery = query.toLowerCase();
        return this.tasks.filter(t => 
            t.title.toLowerCase().includes(lowerQuery) || 
            t.description.toLowerCase().includes(lowerQuery)
        );
    }

    async clearCompletedTasks() {
        const initialCount = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.status !== 'completed');
        if (this.tasks.length !== initialCount) {
            await this.save();
            return initialCount - this.tasks.length;
        }
        return 0;
    }

    getSummary() {
        return this.tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            acc.total += 1;
            return acc;
        }, { pending: 0, 'in-progress': 0, completed: 0, total: 0 });
    }
}
