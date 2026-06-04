const TaskManager = require('./taskManager');
const assert = require('assert');
const fs = require('fs').promises;

(async () => {
  console.log('Running tests...');

  // Cleanup existing tasks.json
  try {
    await fs.unlink('./tasks.json');
  } catch (e) {}

  const tm = new TaskManager();
  await tm.loadTasks();

  // Test Add
  const task1 = await tm.addTask('Test Task', 'Description', '2023-12-31');
  assert.strictEqual(tm.listTasks().length, 1);
  assert.strictEqual(task1.title, 'Test Task');

  // Test Persistence (create new instance)
  const tm2 = new TaskManager();
  await tm2.loadTasks();
  assert.strictEqual(tm2.listTasks().length, 1);
  assert.strictEqual(tm2.listTasks()[0].title, 'Test Task');

  // Test Update
  await tm2.updateTask(task1.id, { status: 'completed' });
  assert.strictEqual(tm2.listTasks()[0].status, 'completed');

  // Test Remove
  await tm2.removeTask(task1.id);
  assert.strictEqual(tm2.listTasks().length, 0);

  // Test New Features
  const t1 = await tm2.addTask('Alpha', 'First task', '2023-12-01');
  const t2 = await tm2.addTask('Beta', 'Second task', '2023-11-01');
  const t3 = await tm2.addTask('Charlie', 'Third task', null);
  await tm2.updateTask(t1.id, { status: 'completed' });
  await tm2.updateTask(t2.id, { status: 'in-progress' });

  // Test Filter
  assert.strictEqual(tm2.getTasksByStatus('completed').length, 1);
  assert.strictEqual(tm2.getTasksByStatus('completed')[0].id, t1.id);

  // Test Sort
  const sorted = tm2.getTasksSortedByDueDate();
  assert.strictEqual(sorted[0].id, t2.id); // Earliest date first
  assert.strictEqual(sorted[1].id, t1.id);
  assert.strictEqual(sorted[2].id, t3.id); // Null date last

  // Test Search
  const searchResults = tm2.searchTasks('second');
  assert.strictEqual(searchResults.length, 1);
  assert.strictEqual(searchResults[0].id, t2.id);

  console.log('All tests passed!');
  
  // Cleanup
  try {
    await fs.unlink('./tasks.json');
  } catch (e) {}
})();
