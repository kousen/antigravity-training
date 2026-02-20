export class Task {
  constructor(id, title, description, status = 'pending', dueDate = null) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
  }

  static fromJSON(json) {
    return new Task(json.id, json.title, json.description, json.status, json.dueDate);
  }
}
