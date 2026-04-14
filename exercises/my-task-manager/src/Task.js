import { randomUUID } from 'crypto';

export class Task {
    constructor(title, description, dueDate, priority = 'medium', status = 'pending', id = null) {
        this.id = id || randomUUID();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
    }

    isOverdue(today = new Date().toISOString().split('T')[0]) {
        if (this.status === 'completed') return false;
        return this.dueDate < today;
    }

    static fromJSON(data) {
        return new Task(
            data.title,
            data.description,
            data.dueDate,
            data.priority,
            data.status,
            data.id
        );
    }
}
