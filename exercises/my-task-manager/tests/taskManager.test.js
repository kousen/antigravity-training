import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Task } from '../src/Task.js';
import {
  addTask,
  listTasks,
  updateTask,
  removeTask,
  loadTasks,
  saveTasks,
  filterByStatus,
  sortByDueDate,
  searchByQuery,
  filterTasksByStatus,
  sortTasksByDueDate,
  searchTasks,
  normalizeStatus
} from '../src/taskManager.js';
import { getStatusBadge, colors } from '../src/colors.js';
import { formatTask } from '../src/cli.js';

describe('Task Model', () => {
  test('creates a valid Task instance', () => {
    const task = new Task({
      id: 1,
      title: 'Learn Antigravity',
      description: 'Explore agent capabilities',
      status: 'in_progress',
      dueDate: '2026-09-01'
    });

    expect(task.id).toBe(1);
    expect(task.title).toBe('Learn Antigravity');
    expect(task.description).toBe('Explore agent capabilities');
    expect(task.status).toBe('in_progress');
    expect(task.dueDate).toBe('2026-09-01');
  });

  test('throws error when title is missing, empty, or whitespace', () => {
    expect(() => new Task({ id: 1, title: '' })).toThrow('Task title is required');
    expect(() => new Task({ id: 1, title: '   ' })).toThrow('Task title is required');
    expect(() => new Task({ id: 1 })).toThrow('Task title is required');
  });

  test('serializes to and from JSON', () => {
    const task = new Task({
      id: 2,
      title: 'Write tests',
      status: 'completed'
    });

    const json = task.toJSON();
    const restored = Task.fromJSON(json);

    expect(restored).toBeInstanceOf(Task);
    expect(restored.id).toBe(2);
    expect(restored.title).toBe('Write tests');
    expect(restored.status).toBe('completed');
  });
});

describe('TaskManager Persistence & CRUD Operations', () => {
  let tempStoragePath;

  beforeEach(async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'task-test-'));
    tempStoragePath = path.join(tempDir, 'test-tasks.json');
  });

  afterEach(async () => {
    try {
      await fs.rm(path.dirname(tempStoragePath), { recursive: true, force: true });
    } catch {
      // ignore cleanup error
    }
  });

  test('loadTasks returns empty array if file does not exist', async () => {
    const tasks = await loadTasks(tempStoragePath);
    expect(tasks).toEqual([]);
  });

  test('loadTasks returns empty array if file is empty (0 bytes or whitespace)', async () => {
    await fs.writeFile(tempStoragePath, '   \n  ', 'utf8');
    const tasks = await loadTasks(tempStoragePath);
    expect(tasks).toEqual([]);
  });

  test('loadTasks throws descriptive error when JSON file is corrupted', async () => {
    await fs.writeFile(tempStoragePath, '{ invalid-json', 'utf8');
    await expect(loadTasks(tempStoragePath)).rejects.toThrow(/Corrupted tasks storage file/);
  });

  test('adds tasks and increments IDs automatically', async () => {
    const task1 = await addTask({ title: 'Task 1', description: 'First' }, tempStoragePath);
    const task2 = await addTask({ title: 'Task 2', dueDate: '2026-10-10' }, tempStoragePath);

    expect(task1.id).toBe(1);
    expect(task1.title).toBe('Task 1');
    expect(task1.status).toBe('pending');

    expect(task2.id).toBe(2);
    expect(task2.title).toBe('Task 2');
    expect(task2.dueDate).toBe('2026-10-10');

    const all = await listTasks({}, tempStoragePath);
    expect(all).toHaveLength(2);
  });

  test('handles ID gaps properly after deletions', async () => {
    const t1 = await addTask({ title: 'Task 1' }, tempStoragePath);
    const t2 = await addTask({ title: 'Task 2' }, tempStoragePath);
    const t3 = await addTask({ title: 'Task 3' }, tempStoragePath);

    expect(t3.id).toBe(3);

    // Delete middle task #2
    await removeTask(t2.id, tempStoragePath);

    // Adding next task should generate ID #4 (not colliding with t3)
    const t4 = await addTask({ title: 'Task 4' }, tempStoragePath);
    expect(t4.id).toBe(4);
  });

  test('updates an existing task and preserves ID', async () => {
    const created = await addTask({ title: 'Original Title', description: 'Old desc', dueDate: '2026-09-01' }, tempStoragePath);

    const updated = await updateTask(
      created.id,
      { title: 'Updated Title', status: 'completed' },
      tempStoragePath
    );

    expect(updated).not.toBeNull();
    expect(updated.id).toBe(created.id);
    expect(updated.title).toBe('Updated Title');
    expect(updated.description).toBe('Old desc');
    expect(updated.dueDate).toBe('2026-09-01');
    expect(updated.status).toBe('completed');
  });

  test('allows clearing fields via updateTask', async () => {
    const created = await addTask({
      title: 'Task with fields',
      description: 'To be cleared',
      dueDate: '2026-09-01'
    }, tempStoragePath);

    const updated = await updateTask(
      created.id,
      { description: '', dueDate: null },
      tempStoragePath
    );

    expect(updated.description).toBe('');
    expect(updated.dueDate).toBeNull();
  });

  test('returns null when updating non-existent task', async () => {
    const result = await updateTask(999, { title: 'Nope' }, tempStoragePath);
    expect(result).toBeNull();
  });

  test('removes an existing task', async () => {
    const task = await addTask({ title: 'To Delete' }, tempStoragePath);
    const removed = await removeTask(task.id, tempStoragePath);
    expect(removed).toBe(true);

    const tasks = await listTasks({}, tempStoragePath);
    expect(tasks).toHaveLength(0);
  });

  test('returns false when removing non-existent task', async () => {
    const removed = await removeTask(999, tempStoragePath);
    expect(removed).toBe(false);
  });
});

describe('Filtering, Sorting, and Search Edge Cases', () => {
  let sampleTasks;

  beforeEach(() => {
    sampleTasks = [
      new Task({ id: 1, title: 'Buy groceries', description: 'Milk, eggs, and bread', status: 'completed', dueDate: '2026-08-15' }),
      new Task({ id: 2, title: 'Write report [v1]', description: 'Quarterly financial summary (urgent)', status: 'in_progress', dueDate: '2026-08-25' }),
      new Task({ id: 3, title: 'Fix bug in auth (OAuth)', description: 'Resolve token expiration issue', status: 'pending', dueDate: '2026-08-20' }),
      new Task({ id: 4, title: 'Clean desk', description: 'Organize workspace', status: 'pending', dueDate: null }),
      new Task({ id: 5, title: 'Archive logs', description: '', status: 'pending', dueDate: 'invalid-date' })
    ];
  });

  test('normalizes status strings with mixed case, whitespace, and hyphens', () => {
    expect(normalizeStatus('  IN-PROGRESS  ')).toBe('in_progress');
    expect(normalizeStatus('Completed')).toBe('completed');
    expect(normalizeStatus('  pending  ')).toBe('pending');
    expect(normalizeStatus('')).toBe('pending');
    expect(normalizeStatus(null)).toBe('pending');
  });

  test('filters tasks by status with casing tolerance', () => {
    const pending = filterByStatus(sampleTasks, '  PENDING  ');
    expect(pending).toHaveLength(3);
    expect(pending.map(t => t.id)).toEqual([3, 4, 5]);

    const inProgress = filterByStatus(sampleTasks, 'in-progress');
    expect(inProgress).toHaveLength(1);
    expect(inProgress[0].id).toBe(2);

    // Empty or undefined status filter returns all tasks
    expect(filterByStatus(sampleTasks, '')).toHaveLength(5);
    expect(filterByStatus(sampleTasks, null)).toHaveLength(5);
  });

  test('sorts tasks by due date with invalid dates and nulls placed at the end', () => {
    const asc = sortByDueDate(sampleTasks, 'asc');
    // Expected order: 2026-08-15 (#1), 2026-08-20 (#3), 2026-08-25 (#2), null (#4) & invalid (#5) at the end
    expect(asc.slice(0, 3).map(t => t.id)).toEqual([1, 3, 2]);
    expect([asc[3].id, asc[4].id]).toEqual(expect.arrayContaining([4, 5]));

    const desc = sortByDueDate(sampleTasks, 'desc');
    // Expected order: 2026-08-25 (#2), 2026-08-20 (#3), 2026-08-15 (#1), null (#4) & invalid (#5) at the end
    expect(desc.slice(0, 3).map(t => t.id)).toEqual([2, 3, 1]);
    expect([desc[3].id, desc[4].id]).toEqual(expect.arrayContaining([4, 5]));
  });

  test('searches tasks safely with special characters and punctuation', () => {
    // Parentheses and brackets
    const matchSpecial = searchByQuery(sampleTasks, '(OAuth)');
    expect(matchSpecial).toHaveLength(1);
    expect(matchSpecial[0].id).toBe(3);

    const matchBrackets = searchByQuery(sampleTasks, '[v1]');
    expect(matchBrackets).toHaveLength(1);
    expect(matchBrackets[0].id).toBe(2);

    // Matching in description with special chars
    const matchDesc = searchByQuery(sampleTasks, '(urgent)');
    expect(matchDesc).toHaveLength(1);
    expect(matchDesc[0].id).toBe(2);
  });

  test('searchByQuery handles whitespace-only or non-string queries gracefully', () => {
    expect(searchByQuery(sampleTasks, '   ')).toHaveLength(5);
    expect(searchByQuery(sampleTasks, '')).toHaveLength(5);
    expect(searchByQuery(sampleTasks, null)).toHaveLength(5);
    expect(searchByQuery(sampleTasks, undefined)).toHaveLength(5);
  });

  test('combined query via listTasks (filtering + searching + sorting)', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'task-comb-test-'));
    const tempStorage = path.join(tempDir, 'tasks.json');

    await addTask({ title: 'Feature A (UI)', description: 'React component', status: 'pending', dueDate: '2026-10-15' }, tempStorage);
    await addTask({ title: 'Feature B (API)', description: 'Express route (UI)', status: 'pending', dueDate: '2026-10-01' }, tempStorage);
    await addTask({ title: 'Feature C (Done)', description: 'UI completed', status: 'completed', dueDate: '2026-09-01' }, tempStorage);

    // Filter pending + search "UI" + sort ascending
    const results = await listTasks({
      status: 'pending',
      search: 'UI',
      sortByDueDate: 'asc'
    }, tempStorage);

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Feature B (API)'); // earlier due date 2026-10-01
    expect(results[1].title).toBe('Feature A (UI)'); // 2026-10-15

    // Storage convenience wrappers
    const filteredDirect = await filterTasksByStatus('completed', tempStorage);
    expect(filteredDirect).toHaveLength(1);
    expect(filteredDirect[0].title).toBe('Feature C (Done)');

    const sortedDirect = await sortTasksByDueDate('desc', tempStorage);
    expect(sortedDirect[0].title).toBe('Feature A (UI)');

    const searchedDirect = await searchTasks('route', tempStorage);
    expect(searchedDirect).toHaveLength(1);
    expect(searchedDirect[0].title).toBe('Feature B (API)');

    await fs.rm(tempDir, { recursive: true, force: true });
  });
});

describe('Console Colors and Status Badges', () => {
  test('handles known and unknown statuses gracefully', () => {
    expect(getStatusBadge('pending', false)).toBe('○ [Pending]');
    expect(getStatusBadge('in_progress', false)).toBe('⏳ [In Progress]');
    expect(getStatusBadge('completed', false)).toBe('✓ [Completed]');
    expect(getStatusBadge('archived', false)).toBe('[archived]');
    expect(getStatusBadge(null, false)).toBe('[Unknown]');

    const coloredCustom = getStatusBadge('archived', true);
    expect(coloredCustom).toContain('[archived]');
    expect(coloredCustom).toContain(colors.reset);
  });

  test('formats task string with and without colors', () => {
    const task = new Task({
      id: 10,
      title: 'Review PR',
      description: 'Check changes',
      status: 'pending',
      dueDate: '2026-08-30'
    });

    const plainOutput = formatTask(task, false);
    expect(plainOutput).toContain('[#10]');
    expect(plainOutput).toContain('○ [Pending]');
    expect(plainOutput).toContain('Review PR');
    expect(plainOutput).toContain('(Due: 2026-08-30)');
    expect(plainOutput).toContain('Description: Check changes');

    const coloredOutput = formatTask(task, true);
    expect(coloredOutput).toContain(colors.cyan);
  });
});
