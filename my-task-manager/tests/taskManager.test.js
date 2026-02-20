import { TaskManager } from '../src/taskManager.js';
import fs from 'fs/promises';

async function runTests() {
  const testDb = 'test-tasks-extended.json';
  const taskManager = new TaskManager(testDb);

  try {
    console.log('Starting extended tests...');

    // Setup: Add multiple tasks
    console.log('Adding Alpha...');
    await taskManager.addTask('Alpha Task', 'Description A', '2026-12-01');
    console.log('Adding Beta...');
    await taskManager.addTask('Beta Task', 'Description B', '2026-01-01');
    console.log('Adding Gamma...');
    const taskC = await taskManager.addTask('Gamma Task', 'Searchable context', '2026-06-01');
    
    console.log('Updating Gamma to completed...');
    await taskManager.updateTask(taskC.id, { status: 'completed' });

    const allTasks = taskManager.listTasks();
    console.log('All tasks count:', allTasks.length);
    allTasks.forEach(t => console.log(` - ${t.id}: ${t.title} (${t.status})`));

    // 1. Test Filtering by status
    console.log('Testing Filter by status...');
    const completedTasks = taskManager.listTasks({ status: 'completed' });
    if (completedTasks.length !== 1 || completedTasks[0].title !== 'Gamma Task') {
      console.log('Completed tasks found:', completedTasks.length);
      completedTasks.forEach(t => console.log(` - Found: ${t.title}`));
      throw new Error('Filtering by status failed');
    }
    console.log('✓ Filter by status passed');

    // 2. Test Searching
    console.log('Testing Search...');
    const searchResults = taskManager.listTasks({ searchTerm: 'searchable' });
    if (searchResults.length !== 1 || searchResults[0].title !== 'Gamma Task') {
      throw new Error('Searching failed');
    }
    console.log('✓ Search passed');

    // 3. Test Sorting
    console.log('Testing Sort...');
    const sortedTasks = taskManager.listTasks({ sortBy: 'dueDate' });
    if (sortedTasks[0].title !== 'Beta Task' || sortedTasks[2].title !== 'Alpha Task') {
      console.log('Sorted order:', sortedTasks.map(t => t.title).join(', '));
      throw new Error('Sorting by due date failed');
    }
    console.log('✓ Sort by due date passed');

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
