class Task {
  _completed = false;
  _completedOn = null;

  constructor(title, desc, dueDate) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
  }

  markAsCompleted() {
    if (this._completed) return; // Check if task is already completed

    this._completedOn = new Date();
    this._completed = true;
  }
  get completedOn() {
    return this._completedOn;
  }
}

export default Task;
