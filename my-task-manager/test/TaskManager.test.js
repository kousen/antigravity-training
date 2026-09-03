import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TaskManager } from '../src/TaskManager.js';
import { Task } from '../src/Task.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_STORAGE_PATH = path.join(__dirname, 'fixtures', 'test-tasks.json');

describe('TaskManager', () => {
  let manager;

  beforeEach(async () => {
    // Ensure clean state before each test
    await fs.rm(path.dirname(TEST_STORAGE_PATH), { recursive: true, force: true });
    manager = new TaskManager(TEST_STORAGE_PATH);
    await manager.init();
  });

  afterAll(async () => {
    // Clean up test fixture folder
    await fs.rm(path.dirname(TEST_STORAGE_PATH), { recursive: true, force: true });
  });

  test('starts with an empty task list when storage file is newly initialized', () => {
    expect(manager.listTasks()).toEqual([]);
  });

  test('adds a task and persists to JSON file', async () => {
    const task = await manager.addTask({
      title: 'Write unit tests',
      description: 'Cover all edge cases',
      dueDate: '2026-09-05'
    });

    expect(task).toBeInstanceOf(Task);
    expect(task.title).toBe('Write unit tests');
    expect(manager.listTasks()).toHaveLength(1);

    // Verify persistence by reading the raw JSON file
    const fileContent = JSON.parse(await fs.readFile(TEST_STORAGE_PATH, 'utf8'));
    expect(fileContent).toHaveLength(1);
    expect(fileContent[0].id).toBe(task.id);
    expect(fileContent[0].title).toBe('Write unit tests');
  });

  test('reloads existing tasks from JSON storage file', async () => {
    const task1 = await manager.addTask({ title: 'Task 1' });
    const task2 = await manager.addTask({ title: 'Task 2' });

    // Create a new manager pointing to the same file
    const newManager = new TaskManager(TEST_STORAGE_PATH);
    await newManager.init();

    const tasks = newManager.listTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks[0].id).toBe(task1.id);
    expect(tasks[1].id).toBe(task2.id);
  });

  test('removes a task by id and persists changes', async () => {
    const task1 = await manager.addTask({ title: 'Task to keep' });
    const task2 = await manager.addTask({ title: 'Task to delete' });

    const removed = await manager.removeTask(task2.id);
    expect(removed).toBeDefined();
    expect(removed.id).toBe(task2.id);

    expect(manager.listTasks()).toHaveLength(1);
    expect(manager.getTask(task2.id)).toBeNull();

    // Verify persistence
    const fileContent = JSON.parse(await fs.readFile(TEST_STORAGE_PATH, 'utf8'));
    expect(fileContent).toHaveLength(1);
    expect(fileContent[0].id).toBe(task1.id);

    // Removing non-existent task returns null
    const notFound = await manager.removeTask('non-existent-id');
    expect(notFound).toBeNull();
  });

  test('updates an existing task and persists changes', async () => {
    const task = await manager.addTask({
      title: 'Initial Title',
      description: 'Old desc',
      status: 'pending'
    });

    const updated = await manager.updateTask(task.id, {
      title: 'Updated Title',
      status: 'in-progress',
      dueDate: '2026-09-15'
    });

    expect(updated.title).toBe('Updated Title');
    expect(updated.description).toBe('Old desc');
    expect(updated.status).toBe('in-progress');
    expect(updated.dueDate).toBe('2026-09-15');

    // Verify persistence
    const newManager = new TaskManager(TEST_STORAGE_PATH);
    await newManager.init();
    const persisted = newManager.getTask(task.id);
    expect(persisted.title).toBe('Updated Title');
    expect(persisted.status).toBe('in-progress');
  });

  test('throws an error when updating non-existent task or invalid fields', async () => {
    await expect(manager.updateTask('missing-id', { title: 'New' })).rejects.toThrow(
      'was not found'
    );

    const task = await manager.addTask({ title: 'Valid Task' });
    await expect(manager.updateTask(task.id, { title: '' })).rejects.toThrow(
      'Task title cannot be empty'
    );
    await expect(manager.updateTask(task.id, { status: 'invalid-status' })).rejects.toThrow(
      'Invalid status'
    );
  });

  test('lists tasks and filters by status', async () => {
    await manager.addTask({ title: 'Task A', status: 'pending' });
    await manager.addTask({ title: 'Task B', status: 'in-progress' });
    await manager.addTask({ title: 'Task C', status: 'completed' });
    await manager.addTask({ title: 'Task D', status: 'completed' });

    expect(manager.listTasks()).toHaveLength(4);
    expect(manager.listTasks({ status: 'pending' })).toHaveLength(1);
    expect(manager.listTasks({ status: 'in-progress' })).toHaveLength(1);
    expect(manager.listTasks({ status: 'completed' })).toHaveLength(2);
  });
});
