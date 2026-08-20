import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { TaskRepository } from '../src/repositories/TaskRepository.js';
import { JsonTaskRepository } from '../src/repositories/JsonTaskRepository.js';
import { InMemoryTaskRepository } from '../src/repositories/InMemoryTaskRepository.js';
import { Task } from '../src/Task.js';

describe('TaskRepository Base Class', () => {
  test('abstract methods throw when not overridden', async () => {
    const repo = new TaskRepository();
    await expect(repo.findAll()).rejects.toThrow('must be implemented');
    await expect(repo.findById(1)).rejects.toThrow('must be implemented');
    await expect(repo.add({})).rejects.toThrow('must be implemented');
    await expect(repo.update(1, {})).rejects.toThrow('must be implemented');
    await expect(repo.delete(1)).rejects.toThrow('must be implemented');
    await expect(repo.saveAll([])).rejects.toThrow('must be implemented');
  });
});

describe('InMemoryTaskRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryTaskRepository([
      new Task({ id: 1, title: 'Existing Task', priority: 'low' })
    ]);
  });

  test('findAll and findById work in memory', async () => {
    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe('Existing Task');

    const found = await repo.findById(1);
    expect(found).not.toBeNull();
    expect(found.id).toBe(1);

    expect(await repo.findById(999)).toBeNull();
  });

  test('adds and auto-increments IDs', async () => {
    const added = await repo.add({ title: 'New Task', priority: 'high' });
    expect(added.id).toBe(2);
    expect(added.title).toBe('New Task');
    expect(await repo.findAll()).toHaveLength(2);
  });

  test('updates tasks and preserves ID', async () => {
    const updated = await repo.update(1, { title: 'Renamed', status: 'completed' });
    expect(updated.title).toBe('Renamed');
    expect(updated.status).toBe('completed');
    expect(updated.id).toBe(1);

    expect(await repo.update(999, {})).toBeNull();
  });

  test('deletes tasks by ID', async () => {
    expect(await repo.delete(1)).toBe(true);
    expect(await repo.delete(999)).toBe(false);
    expect(await repo.findAll()).toHaveLength(0);
  });

  test('saveAll replaces tasks collection', async () => {
    await repo.saveAll([
      new Task({ id: 10, title: 'Batch Task' })
    ]);
    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(10);
  });
});

describe('JsonTaskRepository', () => {
  let tempDir;
  let tempFile;
  let repo;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'json-repo-test-'));
    tempFile = path.join(tempDir, 'tasks.json');
    repo = new JsonTaskRepository(tempFile);
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  test('returns empty array if file does not exist', async () => {
    expect(await repo.findAll()).toEqual([]);
  });

  test('adds, reads, updates, and deletes tasks to/from file', async () => {
    const task = await repo.add({ title: 'File Task', priority: 'high' });
    expect(task.id).toBe(1);

    const found = await repo.findById(1);
    expect(found).not.toBeNull();
    expect(found.title).toBe('File Task');

    const updated = await repo.update(1, { status: 'completed' });
    expect(updated.status).toBe('completed');

    expect(await repo.delete(1)).toBe(true);
    expect(await repo.findAll()).toHaveLength(0);
  });
});
