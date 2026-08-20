import { JsonTaskRepository, DEFAULT_JSON_PATH } from './repositories/JsonTaskRepository.js';
import {
  TaskService,
  filterByStatus,
  filterByPriority,
  filterByTag,
  sortByDueDate,
  sortByPriority,
  searchByQuery,
  exportToMarkdown
} from './services/TaskService.js';

export {
  JsonTaskRepository,
  DEFAULT_JSON_PATH,
  DEFAULT_JSON_PATH as DEFAULT_STORAGE_PATH,
  TaskService,
  filterByStatus,
  filterByPriority,
  filterByTag,
  sortByDueDate,
  sortByPriority,
  searchByQuery,
  exportToMarkdown
};

export { normalizeStatus } from './services/TaskService.js';

/**
 * Factory helper to instantiate a configured TaskService with a JsonTaskRepository.
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {TaskService}
 */
export function createTaskService(storagePath = DEFAULT_JSON_PATH) {
  const repository = new JsonTaskRepository(storagePath);
  return new TaskService(repository);
}

// Default singleton service instance for standard CLI / scripts
const defaultService = createTaskService();

/**
 * Loads tasks from storage.
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<import('./Task.js').Task[]>}
 */
export async function loadTasks(storagePath = DEFAULT_JSON_PATH) {
  const repo = storagePath === DEFAULT_JSON_PATH ? defaultService.repository : new JsonTaskRepository(storagePath);
  return await repo.findAll();
}

/**
 * Saves tasks to storage.
 * @param {import('./Task.js').Task[]} tasks
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<void>}
 */
export async function saveTasks(tasks, storagePath = DEFAULT_JSON_PATH) {
  const repo = storagePath === DEFAULT_JSON_PATH ? defaultService.repository : new JsonTaskRepository(storagePath);
  await repo.saveAll(tasks);
}

/**
 * Adds a new task.
 * @param {Object} taskData
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<import('./Task.js').Task>}
 */
export async function addTask(taskData, storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.addTask(taskData);
}

/**
 * Lists tasks with optional filtering and sorting.
 * @param {Object} [options={}]
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<import('./Task.js').Task[]>}
 */
export async function listTasks(options = {}, storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.listTasks(options);
}

/**
 * Filters tasks by status.
 * @param {string} status
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<import('./Task.js').Task[]>}
 */
export async function filterTasksByStatus(status, storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.listTasks({ status });
}

/**
 * Sorts tasks by due date.
 * @param {'asc'|'desc'} [order='asc']
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<import('./Task.js').Task[]>}
 */
export async function sortTasksByDueDate(order = 'asc', storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.listTasks({ sortByDueDate: order });
}

/**
 * Searches tasks by query matching title, description, or tags.
 * @param {string} query
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<import('./Task.js').Task[]>}
 */
export async function searchTasks(query, storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.listTasks({ search: query });
}

/**
 * Updates an existing task by ID.
 * @param {string|number} id
 * @param {Object} updates
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<import('./Task.js').Task|null>}
 */
export async function updateTask(id, updates, storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.updateTask(id, updates);
}

/**
 * Removes a task by ID.
 * @param {string|number} id
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<boolean>}
 */
export async function removeTask(id, storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.removeTask(id);
}

/**
 * Exports tasks to a Markdown file.
 * @param {string} [exportPath='TODO.md']
 * @param {string} [storagePath=DEFAULT_JSON_PATH]
 * @returns {Promise<string>}
 */
export async function exportTasksToFile(exportPath = 'TODO.md', storagePath = DEFAULT_JSON_PATH) {
  const service = storagePath === DEFAULT_JSON_PATH ? defaultService : createTaskService(storagePath);
  return await service.exportToFile(exportPath);
}
