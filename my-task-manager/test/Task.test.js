import { Task } from '../src/Task.js';

describe('Task Class', () => {
  test('creates a task with required title and default fields', () => {
    const task = new Task({ title: 'Finish homework' });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Finish homework');
    expect(task.description).toBe('');
    expect(task.status).toBe('pending');
    expect(task.dueDate).toBeNull();
  });

  test('creates a task with all custom fields', () => {
    const task = new Task({
      id: 'custom-id-123',
      title: 'Prepare demo',
      description: 'Slidev presentation on Agentic AI',
      status: 'in-progress',
      dueDate: '2026-09-10'
    });

    expect(task.id).toBe('custom-id-123');
    expect(task.title).toBe('Prepare demo');
    expect(task.description).toBe('Slidev presentation on Agentic AI');
    expect(task.status).toBe('in-progress');
    expect(task.dueDate).toBe('2026-09-10');
  });

  test('throws an error if title is empty or invalid', () => {
    expect(() => new Task({ title: '' })).toThrow('Task title is required');
    expect(() => new Task({ title: '   ' })).toThrow('Task title is required');
    expect(() => new Task({})).toThrow('Task title is required');
  });

  test('throws an error if status is invalid', () => {
    expect(() => new Task({ title: 'Buy milk', status: 'unknown-status' })).toThrow(
      'Invalid status "unknown-status"'
    );
  });

  test('serializes to and deserializes from JSON', () => {
    const original = new Task({
      id: 'task-456',
      title: 'Write docs',
      description: 'API reference',
      status: 'completed',
      dueDate: '2026-10-01'
    });

    const json = original.toJSON();
    const revived = Task.fromJSON(json);

    expect(revived).toBeInstanceOf(Task);
    expect(revived).toEqual(original);
  });
});
