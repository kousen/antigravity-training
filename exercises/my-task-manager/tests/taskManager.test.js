import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Task, normalizePriority, normalizeTags } from '../src/Task.js';
import {
  addTask,
  listTasks,
  updateTask,
  removeTask,
  loadTasks,
  saveTasks,
  filterByStatus,
  filterByPriority,
  filterByTag,
  sortByDueDate,
  sortByPriority,
  searchByQuery,
  filterTasksByStatus,
  sortTasksByDueDate,
  searchTasks,
  normalizeStatus,
  exportToMarkdown,
  exportTasksToFile
} from '../src/taskManager.js';
import { getStatusBadge, getPriorityBadge, getOverdueBadge, colors } from '../src/colors.js';
import { formatTask, getFlag } from '../src/cli.js';

describe('Task Model & Normalization', () => {
  test('creates a valid Task instance with priority, tags, and human date', () => {
    const task = new Task({
      id: 1,
      title: 'Learn Antigravity',
      description: 'Explore agent capabilities',
      status: 'in_progress',
      dueDate: 'tomorrow',
      priority: 'high',
      tags: ['ai', 'agent']
    });

    expect(task.id).toBe(1);
    expect(task.title).toBe('Learn Antigravity');
    expect(task.description).toBe('Explore agent capabilities');
    expect(task.status).toBe('in_progress');
    expect(task.priority).toBe('high');
    expect(task.tags).toEqual(['ai', 'agent']);
    expect(task.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('normalizes tags from comma-separated string or array', () => {
    expect(normalizeTags('work, urgent, #backend')).toEqual(['work', 'urgent', 'backend']);
    expect(normalizeTags(['#frontend', ' ui '])).toEqual(['frontend', 'ui']);
    expect(normalizeTags(null)).toEqual([]);
  });

  test('normalizes priorities', () => {
    expect(normalizePriority('HIGH')).toBe('high');
    expect(normalizePriority('p1')).toBe('high');
    expect(normalizePriority('low')).toBe('low');
    expect(normalizePriority('')).toBe('medium');
    expect(normalizePriority(null)).toBe('medium');
  });

  test('checks isOverdue accurately', () => {
    const pastTask = new Task({
      id: 1,
      title: 'Old task',
      dueDate: '2020-01-01',
      status: 'pending'
    });
    expect(pastTask.isOverdue()).toBe(true);

    const completedPastTask = new Task({
      id: 2,
      title: 'Done old task',
      dueDate: '2020-01-01',
      status: 'completed'
    });
    expect(completedPastTask.isOverdue()).toBe(false);

    const futureTask = new Task({
      id: 3,
      title: 'Future task',
      dueDate: '2099-01-01',
      status: 'pending'
    });
    expect(futureTask.isOverdue()).toBe(false);
  });

  test('throws error when title is missing or whitespace', () => {
    expect(() => new Task({ id: 1, title: '' })).toThrow('Task title is required');
    expect(() => new Task({ id: 1, title: '   ' })).toThrow('Task title is required');
  });

  test('serializes to and from JSON with all properties', () => {
    const task = new Task({
      id: 2,
      title: 'Write tests',
      status: 'completed',
      priority: 'high',
      tags: ['jest', 'esm']
    });

    const json = task.toJSON();
    const restored = Task.fromJSON(json);

    expect(restored).toBeInstanceOf(Task);
    expect(restored.id).toBe(2);
    expect(restored.priority).toBe('high');
    expect(restored.tags).toEqual(['jest', 'esm']);
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
      // ignore
    }
  });

  test('loadTasks returns empty array if file does not exist or is empty', async () => {
    expect(await loadTasks(tempStoragePath)).toEqual([]);
    await fs.writeFile(tempStoragePath, '   \n  ', 'utf8');
    expect(await loadTasks(tempStoragePath)).toEqual([]);
  });

  test('loadTasks throws descriptive error when JSON file is corrupted', async () => {
    await fs.writeFile(tempStoragePath, '{ invalid-json', 'utf8');
    await expect(loadTasks(tempStoragePath)).rejects.toThrow(/Corrupted tasks storage file/);
  });

  test('adds tasks with priority, tags, and auto-incremented IDs', async () => {
    const task1 = await addTask({
      title: 'Task 1',
      priority: 'high',
      tags: 'work,feature'
    }, tempStoragePath);

    expect(task1.id).toBe(1);
    expect(task1.priority).toBe('high');
    expect(task1.tags).toEqual(['work', 'feature']);

    const all = await listTasks({}, tempStoragePath);
    expect(all).toHaveLength(1);
  });

  test('updates task fields including priority and tags', async () => {
    const created = await addTask({ title: 'Task', priority: 'low' }, tempStoragePath);
    const updated = await updateTask(created.id, {
      priority: 'high',
      tags: ['urgent'],
      status: 'in_progress'
    }, tempStoragePath);

    expect(updated.priority).toBe('high');
    expect(updated.tags).toEqual(['urgent']);
    expect(updated.status).toBe('in_progress');
  });

  test('removes tasks successfully', async () => {
    const task = await addTask({ title: 'Delete me' }, tempStoragePath);
    expect(await removeTask(task.id, tempStoragePath)).toBe(true);
    expect(await removeTask(999, tempStoragePath)).toBe(false);
  });
});

describe('Filtering, Sorting, and Search Enhancements', () => {
  let sampleTasks;

  beforeEach(() => {
    sampleTasks = [
      new Task({ id: 1, title: 'Buy groceries', description: 'Milk and eggs', status: 'completed', dueDate: '2026-08-15', priority: 'low', tags: ['home'] }),
      new Task({ id: 2, title: 'Write report [v1]', description: 'Financial summary', status: 'in_progress', dueDate: '2026-08-25', priority: 'high', tags: ['work', 'finance'] }),
      new Task({ id: 3, title: 'Fix bug in auth', description: 'OAuth token issue', status: 'pending', dueDate: '2026-08-20', priority: 'high', tags: ['work', 'security'] }),
      new Task({ id: 4, title: 'Clean desk', description: 'Organize workspace', status: 'pending', dueDate: null, priority: 'medium', tags: ['home'] }),
    ];
  });

  test('filters tasks by priority', () => {
    const high = filterByPriority(sampleTasks, 'high');
    expect(high).toHaveLength(2);
    expect(high.map(t => t.id)).toEqual([2, 3]);

    const low = filterByPriority(sampleTasks, 'low');
    expect(low).toHaveLength(1);
    expect(low[0].id).toBe(1);
  });

  test('filters tasks by tag', () => {
    const work = filterByTag(sampleTasks, 'work');
    expect(work).toHaveLength(2);
    expect(work.map(t => t.id)).toEqual([2, 3]);

    const home = filterByTag(sampleTasks, '#home');
    expect(home).toHaveLength(2);
    expect(home.map(t => t.id)).toEqual([1, 4]);
  });

  test('sorts tasks by priority (high > medium > low)', () => {
    const sorted = sortByPriority(sampleTasks, 'desc');
    expect(sorted.map(t => t.priority)).toEqual(['high', 'high', 'medium', 'low']);

    const asc = sortByPriority(sampleTasks, 'asc');
    expect(asc.map(t => t.priority)).toEqual(['low', 'medium', 'high', 'high']);
  });

  test('searches by query matching tags as well as title/desc', () => {
    const byTag = searchByQuery(sampleTasks, 'security');
    expect(byTag).toHaveLength(1);
    expect(byTag[0].id).toBe(3);
  });

  test('multi-filter listTasks with overdue and priority', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'task-prio-test-'));
    const tempStorage = path.join(tempDir, 'tasks.json');

    await addTask({ title: 'Task A', status: 'pending', priority: 'high', tags: ['dev'], dueDate: '2020-01-01' }, tempStorage);
    await addTask({ title: 'Task B', status: 'pending', priority: 'low', tags: ['dev'], dueDate: '2099-01-01' }, tempStorage);

    const highDev = await listTasks({ priority: 'high', tag: 'dev' }, tempStorage);
    expect(highDev).toHaveLength(1);
    expect(highDev[0].title).toBe('Task A');

    const overdue = await listTasks({ overdueOnly: true }, tempStorage);
    expect(overdue).toHaveLength(1);
    expect(overdue[0].title).toBe('Task A');

    // Test storage-level direct functions
    const filteredStatus = await filterTasksByStatus('pending', tempStorage);
    expect(filteredStatus).toHaveLength(2);

    const sortedDue = await sortTasksByDueDate('desc', tempStorage);
    expect(sortedDue[0].title).toBe('Task B');

    const searched = await searchTasks('Task A', tempStorage);
    expect(searched).toHaveLength(1);

    await fs.rm(tempDir, { recursive: true, force: true });
  });
});

describe('Markdown Export & CLI Helpers', () => {
  test('exports tasks to formatted Markdown string', () => {
    const tasks = [
      new Task({ id: 1, title: 'Buy milk', status: 'pending', priority: 'high', dueDate: '2026-08-30', tags: ['home'] }),
      new Task({ id: 2, title: 'Deploy app', status: 'completed', description: 'Prod push', priority: 'medium' })
    ];

    const md = exportToMarkdown(tasks);
    expect(md).toContain('# Task List');
    expect(md).toContain('- [ ] **#1** Buy milk [HIGH] *(Due: 2026-08-30)* #home');
    expect(md).toContain('- [x] **#2** Deploy app [MEDIUM]\n  > Prod push');
  });

  test('exports tasks to file on disk', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'task-exp-test-'));
    const tempStorage = path.join(tempDir, 'tasks.json');
    const exportFile = path.join(tempDir, 'EXPORT.md');

    await addTask({ title: 'Export Task', status: 'pending' }, tempStorage);
    await exportTasksToFile(exportFile, tempStorage);

    const content = await fs.readFile(exportFile, 'utf8');
    expect(content).toContain('Export Task');

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test('parses CLI flags with getFlag', () => {
    const args = ['add', 'My Task', '--due', 'tomorrow', '--priority', 'high', '--tags', 'work'];
    expect(getFlag(args, '--due')).toBe('tomorrow');
    expect(getFlag(args, '--priority')).toBe('high');
    expect(getFlag(args, '--tags')).toBe('work');
    expect(getFlag(args, '--desc')).toBeNull();
  });

  test('formats badges and task console strings', () => {
    expect(getPriorityBadge('high', false)).toBe('[HIGH]');
    expect(getPriorityBadge('medium', false)).toBe('[MED]');
    expect(getPriorityBadge('low', false)).toBe('[LOW]');
    expect(getOverdueBadge(false)).toBe('⚠️ [OVERDUE]');

    const overdueTask = new Task({
      id: 99,
      title: 'Late task',
      dueDate: '2020-01-01',
      status: 'pending',
      priority: 'high',
      tags: ['urgent']
    });

    const plain = formatTask(overdueTask, false);
    expect(plain).toContain('[#99]');
    expect(plain).toContain('[HIGH]');
    expect(plain).toContain('⚠️ [OVERDUE]');
    expect(plain).toContain('[#urgent]');
  });
});
