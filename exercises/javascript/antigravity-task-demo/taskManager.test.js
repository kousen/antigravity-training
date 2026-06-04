const TaskManager = require('./taskManager');
const fs = require('fs').promises;
const path = require('path');
const Task = require('./task');

const TEST_FILE = path.join(__dirname, 'test_tasks.json');

describe('TaskManager', () => {
  let taskManager;

  beforeEach(async () => {
    // Initialize TaskManager with a test file
    taskManager = new TaskManager(TEST_FILE);
    // Ensure we start with a clean state
    try {
      await fs.unlink(TEST_FILE);
    } catch (e) {
      // Ignore if file doesn't exist
    }
  });

  afterEach(async () => {
    // Cleanup test file
    try {
      await fs.unlink(TEST_FILE);
    } catch (e) {
      // Ignore
    }
  });

  describe('Task Management', () => {
    test('should add a task correctly', async () => {
      const task = await taskManager.addTask('Buy Milk', 'Go to store', '2023-12-25');
      
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Buy Milk');
      expect(task.status).toBe('pending');
      expect(taskManager.listTasks()).toHaveLength(1);
    });

    test('should remove a task', async () => {
      const task = await taskManager.addTask('Delete Me', 'Desc', null);
      expect(taskManager.listTasks()).toHaveLength(1);
      
      const result = await taskManager.removeTask(task.id);
      expect(result).toBe(true);
      expect(taskManager.listTasks()).toHaveLength(0);
    });

    test('should return false when removing non-existent task', async () => {
      const result = await taskManager.removeTask('non-existent-id');
      expect(result).toBe(false);
    });

    test('should update a task', async () => {
      const task = await taskManager.addTask('Update Me', 'Original', null);
      
      const updatedTask = await taskManager.updateTask(task.id, { 
        title: 'Updated', 
        status: 'in-progress' 
      });

      expect(updatedTask.title).toBe('Updated');
      expect(updatedTask.description).toBe('Original'); // Should remain unchanged
      expect(updatedTask.status).toBe('in-progress');
      
      const retrieved = taskManager.getTask(task.id);
      expect(retrieved.title).toBe('Updated');
    });

    test('should return null when updating non-existent task', async () => {
      const result = await taskManager.updateTask('fake-id', { title: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('Filtering and Searching', () => {
    let t1, t2, t3;

    beforeEach(async () => {
      t1 = await taskManager.addTask('Alpha Task', 'Description One', '2023-12-01');
      t2 = await taskManager.addTask('Beta Task', 'Description Two', '2023-11-01');
      t3 = await taskManager.addTask('Charlie Task', 'Description Three', null);
      
      await taskManager.updateTask(t1.id, { status: 'completed' });
      await taskManager.updateTask(t2.id, { status: 'in-progress' });
    });

    test('should filter tasks by status', () => {
      const completed = taskManager.getTasksByStatus('completed');
      expect(completed).toHaveLength(1);
      expect(completed[0].id).toBe(t1.id);

      const pending = taskManager.getTasksByStatus('pending');
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe(t3.id);
    });

    test('should sort tasks by due date', () => {
      const sorted = taskManager.getTasksSortedByDueDate();
      // t2 (Nov) -> t1 (Dec) -> t3 (null)
      expect(sorted[0].id).toBe(t2.id);
      expect(sorted[1].id).toBe(t1.id);
      expect(sorted[2].id).toBe(t3.id);
    });

    test('should search tasks by title', () => {
      const results = taskManager.searchTasks('Alpha');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(t1.id);
    });

    test('should search tasks by description (case insensitive)', () => {
      const results = taskManager.searchTasks('two');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(t2.id);
    });

    test('should return empty array if search matches nothing', () => {
      const results = taskManager.searchTasks('xyz');
      expect(results).toHaveLength(0);
    });
  });

  describe('Persistence', () => {
    test('should save and load tasks from file', async () => {
      await taskManager.addTask('Persistent Task', 'Saved to file', null);
      
      // Create a new instance pointing to the same file
      const newManager = new TaskManager(TEST_FILE);
      await newManager.loadTasks();
      
      const tasks = newManager.listTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Persistent Task');
      expect(tasks[0]).toBeInstanceOf(Task);
    });

    test('should handle empty file/new file gracefully', async () => {
      // File deleted in beforeEach
      const newManager = new TaskManager(TEST_FILE);
      await newManager.loadTasks();
      expect(newManager.listTasks()).toHaveLength(0);
    });
  });
});
