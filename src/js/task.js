class Task {
  completed = false;

  constructor(title, desc, dueDate, priority = "low") {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  markAsCompleted() {
    if (this.completed) return; // Check if task is already completed

    this.completedOn = new Date();
    this.completed = true;
  }

  setPriority(newPriority) {
    const valid = ["low", "medium", "high"];
    if (valid.includes(newPriority)) {
      this.priority = newPriority;
    }
  }
}

export default Task;
