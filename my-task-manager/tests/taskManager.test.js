import { TaskManager } from '../src/taskManager.js';
import fs from 'fs/promises';

describe('TaskManager', () => {
  const testDb = 'test-tasks-jest.json';
  let taskManager;

  beforeEach(async () => {
    taskManager = new TaskManager(testDb);
    // Ensure the test db doesn't exist before each test
    try {
      await fs.unlink(testDb);
    } catch (e) {
      // ignore
    }
  });

  afterEach(async () => {
    try {
      await fs.unlink(testDb);
    } catch (e) {
      // ignore
    }
  });

  it('should load an empty array if the file does not exist', async () => {
    await taskManager.load();
    expect(taskManager.tasks).toEqual([]);

    // It should have created the file
    const fileExists = await fs.access(testDb).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
  });

  it('should add a task and persist it', async () => {
    await taskManager.load();
    const task = await taskManager.addTask('Title 1', 'Desc 1', '2026-10-10');

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Title 1');
    expect(task.status).toBe('pending');
    expect(taskManager.tasks.length).toBe(1);

    // Verify it was saved to file
    const data = await fs.readFile(testDb, 'utf8');
    const savedTasks = JSON.parse(data);
    expect(savedTasks.length).toBe(1);
    expect(savedTasks[0].id).toBe(task.id);
  });

  it('should list tasks with and without filters', async () => {
    await taskManager.load();
    await taskManager.addTask('Alpha', 'Desc A', '2026-12-01'); // pending
    await taskManager.addTask('Beta', 'Desc B', '2026-01-01'); // pending
    const taskC = await taskManager.addTask('Gamma searchable', 'Desc C', '2026-06-01'); // pending -> completed

    await taskManager.updateTask(taskC.id, { status: 'completed' });

    const allTasks = taskManager.listTasks();
    expect(allTasks.length).toBe(3);

    // Filter by status
    const completedTasks = taskManager.listTasks({ status: 'completed' });
    expect(completedTasks.length).toBe(1);
    expect(completedTasks[0].title).toBe('Gamma searchable');

    // Filter by searchTerm
    const searchResults = taskManager.listTasks({ searchTerm: 'searchable' });
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].title).toBe('Gamma searchable');

    // Sort by dueDate
    const sorted = taskManager.listTasks({ sortBy: 'dueDate' });
    expect(sorted[0].title).toBe('Beta'); // 2026-01-01
    expect(sorted[2].title).toBe('Alpha'); // 2026-12-01
  });

  it('should remove a task', async () => {
    await taskManager.load();
    const task = await taskManager.addTask('To Remove', 'Desc', '2026-01-01');

    expect(taskManager.tasks.length).toBe(1);
    await taskManager.removeTask(task.id);
    expect(taskManager.tasks.length).toBe(0);

    // Verify it throws when removing non-existent
    await expect(taskManager.removeTask('invalid-id')).rejects.toThrow('Task with ID invalid-id not found.');
  });

  it('should throw an error when updating a non-existent task', async () => {
    await taskManager.load();
    await expect(taskManager.updateTask('invalid-id', { status: 'completed' })).rejects.toThrow('Task with ID invalid-id not found.');
  });
});
