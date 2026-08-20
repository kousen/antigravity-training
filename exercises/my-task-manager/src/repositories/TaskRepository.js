/**
 * Abstract Base Class defining the contract for Task data persistence.
 * @abstract
 */
export class TaskRepository {
  /**
   * Retrieves all tasks from storage.
   * @abstract
   * @returns {Promise<import('../Task.js').Task[]>}
   */
  async findAll() {
    throw new Error('TaskRepository#findAll must be implemented by subclass.');
  }

  /**
   * Finds a single task by ID.
   * @abstract
   * @param {string|number} id
   * @returns {Promise<import('../Task.js').Task|null>}
   */
  async findById(id) {
    throw new Error('TaskRepository#findById must be implemented by subclass.');
  }

  /**
   * Saves a new task to storage and assigns a unique ID.
   * @abstract
   * @param {Object} taskData
   * @returns {Promise<import('../Task.js').Task>}
   */
  async add(taskData) {
    throw new Error('TaskRepository#add must be implemented by subclass.');
  }

  /**
   * Updates an existing task by ID.
   * @abstract
   * @param {string|number} id
   * @param {Object} updates
   * @returns {Promise<import('../Task.js').Task|null>}
   */
  async update(id, updates) {
    throw new Error('TaskRepository#update must be implemented by subclass.');
  }

  /**
   * Deletes a task by ID.
   * @abstract
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('TaskRepository#delete must be implemented by subclass.');
  }

  /**
   * Persists the entire array of tasks.
   * @abstract
   * @param {import('../Task.js').Task[]} tasks
   * @returns {Promise<void>}
   */
  async saveAll(tasks) {
    throw new Error('TaskRepository#saveAll must be implemented by subclass.');
  }
}
