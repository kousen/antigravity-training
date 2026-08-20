import { TaskService } from '../src/services/TaskService.js';
import { InMemoryTaskRepository } from '../src/repositories/InMemoryTaskRepository.js';
import { Task } from '../src/Task.js';

describe('TaskService with InMemoryTaskRepository (Dependency Injection)', () => {
  let service;
  let repo;

  beforeEach(() => {
    repo = new InMemoryTaskRepository([
      new Task({ id: 1, title: 'Task 1', priority: 'low', status: 'pending', dueDate: '2026-08-30', tags: ['dev'] }),
      new Task({ id: 2, title: 'Task 2', priority: 'high', status: 'in_progress', dueDate: '2026-08-20', tags: ['urgent', 'dev'] }),
      new Task({ id: 3, title: 'Task 3', priority: 'medium', status: 'completed', dueDate: '2026-08-10', tags: ['ops'] })
    ]);
    service = new TaskService(repo);
  });

  test('throws if instantiated without a repository', () => {
    expect(() => new TaskService(null)).toThrow('TaskService requires a valid TaskRepository');
  });

  test('adds and retrieves a task', async () => {
    const task = await service.addTask({ title: 'New task', priority: 'high' });
    expect(task.id).toBe(4);

    const retrieved = await service.getTask(4);
    expect(retrieved.title).toBe('New task');
  });

  test('filters by status, priority, and tag', async () => {
    const pending = await service.listTasks({ status: 'pending' });
    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe(1);

    const highPrio = await service.listTasks({ priority: 'high' });
    expect(highPrio).toHaveLength(1);
    expect(highPrio[0].id).toBe(2);

    const devTasks = await service.listTasks({ tag: 'dev' });
    expect(devTasks).toHaveLength(2);
  });

  test('sorts by due date and priority', async () => {
    const sortedDue = await service.listTasks({ sortByDueDate: 'asc' });
    expect(sortedDue.map(t => t.id)).toEqual([3, 2, 1]);

    const sortedPrio = await service.listTasks({ sortByPriority: 'desc' });
    expect(sortedPrio.map(t => t.priority)).toEqual(['high', 'medium', 'low']);
  });

  test('completes and removes tasks', async () => {
    const completed = await service.completeTask(1);
    expect(completed.status).toBe('completed');

    const removed = await service.removeTask(1);
    expect(removed).toBe(true);
    expect(await service.getTask(1)).toBeNull();
  });
});
