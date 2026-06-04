class Task {
  constructor(id, title, description, status = 'pending', dueDate = null) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
  }
}

module.exports = Task;
