import { TaskManager } from '../src/taskManager.js';
import fs from 'fs/promises';
import path from 'path';

async function runTests() {
  const testDb = 'test-tasks.json';
  const taskManager = new TaskManager(testDb);

  try {
    // Test Adding
    const task = await taskManager.addTask('Test Task', 'Description', '2023-12-31');
    if (taskManager.listTasks().length !== 1) throw new Error('Add task failed');
    console.log('✓ Add task passed');

    // Test Updating
    await taskManager.updateTask(task.id, { status: 'completed' });
    if (taskManager.listTasks()[0].status !== 'completed') throw new Error('Update task failed');
    console.log('✓ Update task passed');

    // Test Removing
    await taskManager.removeTask(task.id);
    if (taskManager.listTasks().length !== 0) throw new Error('Remove task failed');
    console.log('✓ Remove task passed');

  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    try {
      await fs.unlink(testDb);
    } catch (e) {}
  }
}

runTests();
