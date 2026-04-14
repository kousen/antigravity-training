import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { TaskManager } from '../src/TaskManager.js';
import { Task } from '../src/Task.js';

const TEST_DB = './data/test_db.json';

async function clearDb() {
    if (existsSync(TEST_DB)) {
        await fs.unlink(TEST_DB);
    }
}

describe('Task Class Unit Tests', () => {
    test('should create a Task instance with correct fields', () => {
        const t = new Task('T', 'D', '2026-04-14');
        expect(t.title).toBe('T');
        expect(t.id).toHaveLength(36); // UUID length
    });

    test('isOverdue should return true for past dates and not completed', () => {
        const past = new Task('Past', 'D', '2026-04-10', 'pending');
        expect(past.isOverdue('2026-04-14')).toBe(true);
    });

    test('isOverdue should return false for completed tasks even if date is past', () => {
        const pastCompleted = new Task('Past', 'D', '2026-04-10', 'completed');
        expect(pastCompleted.isOverdue('2026-04-14')).toBe(false);
    });

    test('isOverdue should return false for future dates', () => {
        const future = new Task('Future', 'D', '2026-04-20', 'pending');
        expect(future.isOverdue('2026-04-14')).toBe(false);
    });

    test('fromJSON should correctly re-instantiate a Task', () => {
        const json = { id: '123', title: 'J', description: 'D', dueDate: '2026-01-01', status: 'in-progress' };
        const t = Task.fromJSON(json);
        expect(t).toBeInstanceOf(Task);
        expect(t.id).toBe('123');
        expect(t.status).toBe('in-progress');
    });
});

describe('TaskManager Integration & Edge Cases', () => {
    let tm;

    beforeEach(async () => {
        await clearDb();
        tm = new TaskManager(TEST_DB);
        await tm.init();
    });

    afterAll(async () => {
        await clearDb();
    });

    test('should re-instantiate tasks from file on init', async () => {
        await tm.addTask('Task 1', 'D', '2026-01-01');
        const tm2 = new TaskManager(TEST_DB);
        await tm2.init();
        const loadedTask = tm2.listTasks()[0];
        expect(loadedTask).toBeInstanceOf(Task);
        expect(loadedTask.isOverdue('2026-04-14')).toBe(true);
    });

    test('should handle invalid JSON files by resetting to empty array', async () => {
        await fs.writeFile(TEST_DB, '{ not json }');
        const tmBad = new TaskManager(TEST_DB);
        await tmBad.init();
        expect(tmBad.listTasks()).toEqual([]);
    });

    test('should handle empty files gracefully', async () => {
        await fs.writeFile(TEST_DB, '   ');
        const tmEmpty = new TaskManager(TEST_DB);
        await tmEmpty.init();
        expect(tmEmpty.listTasks()).toEqual([]);
    });

    test('should prevent ID mutation during updateTask', async () => {
        const t = await tm.addTask('Original', 'D', '2026-01-01');
        const oldId = t.id;
        const updated = await tm.updateTask(oldId, { id: 'NEW-ID', title: 'New' });
        expect(updated.id).toBe(oldId);
    });

    test('should return null when updating a non-existent task', async () => {
        const result = await tm.updateTask('fake', { title: 'X' });
        expect(result).toBeNull();
    });

    test('getSummary should count statuses accurately', async () => {
        const t1 = await tm.addTask('P1', 'D', 'D');
        const t2 = await tm.addTask('I1', 'D', 'D');
        await tm.updateTask(t2.id, { status: 'in-progress' });
        
        const summary = tm.getSummary();
        expect(summary.pending).toBe(1);
        expect(summary['in-progress']).toBe(1);
        expect(summary.total).toBe(2);
    });

    test('searchTasks should be case-insensitive and match title or description', async () => {
        await tm.addTask('Alpha', 'First task', '2026-01-01');
        await tm.addTask('Beta', 'Second task', '2026-02-01');
        
        expect(tm.searchTasks('alpha')).toHaveLength(1);
        expect(tm.searchTasks('SECOND')).toHaveLength(1);
        expect(tm.searchTasks('task')).toHaveLength(2);
    });

    test('clearCompletedTasks should only remove completed ones', async () => {
        const t1 = await tm.addTask('C', 'D', 'D');
        await tm.updateTask(t1.id, { status: 'completed' });
        await tm.addTask('P', 'D', 'D');
        
        const count = await tm.clearCompletedTasks();
        expect(count).toBe(1);
        expect(tm.listTasks()).toHaveLength(1);
        expect(tm.listTasks()[0].title).toBe('P');
    });
});