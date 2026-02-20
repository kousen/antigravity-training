import { Task } from '../src/models/Task.js';

describe('Task Model', () => {
    it('should create a Task with default status and no dueDate', () => {
        const task = new Task('1', 'Test Task', 'Description');
        expect(task.id).toBe('1');
        expect(task.title).toBe('Test Task');
        expect(task.description).toBe('Description');
        expect(task.status).toBe('pending');
        expect(task.dueDate).toBeNull();
    });

    it('should create a Task with provided status and dueDate', () => {
        const task = new Task('2', 'Test Task 2', 'Desc 2', 'in-progress', '2026-12-31');
        expect(task.id).toBe('2');
        expect(task.title).toBe('Test Task 2');
        expect(task.description).toBe('Desc 2');
        expect(task.status).toBe('in-progress');
        expect(task.dueDate).toBe('2026-12-31');
    });

    it('fromJSON should correctly instantiate a Task from a JSON object', () => {
        const json = {
            id: '3',
            title: 'JSON Task',
            description: 'JSON Desc',
            status: 'completed',
            dueDate: '2026-06-01'
        };
        const task = Task.fromJSON(json);
        expect(task).toBeInstanceOf(Task);
        expect(task.id).toBe('3');
        expect(task.title).toBe('JSON Task');
        expect(task.description).toBe('JSON Desc');
        expect(task.status).toBe('completed');
        expect(task.dueDate).toBe('2026-06-01');
    });
});
