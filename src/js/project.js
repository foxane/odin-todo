export { Project, Task };
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// Project
class Project {
  static projectList = [];
  tasks = [];
  completedTasks = [];

  constructor(name) {
    this.name = name;
    this.id = uuidv4();
    Project.projectList.push(this); // Push to project for each new instances
  }

  // Self delete project from static
  deleteSelf() {
    const index = Project.projectList.indexOf(this);
    Project.projectList.splice(index, 1);
    console.log("Deleteing project: ", this.name);
  }

  // Add and remove task from task arr
  // Both of this must be called from project instance they are on
  addTask(newTask) {
    this.tasks.push(newTask);
    newTask.index = this.tasks.indexOf(newTask);
  }
  removeTask(toRemove) {
    const index = this.tasks.findIndex((task) => task.id === toRemove.id);
    const completedIndex = this.completedTasks.findIndex(
      (completedTask) => completedTask.id === toRemove.id
    );
    if (index !== -1) {
      this.tasks.splice(index, 1);
    } else if (completedIndex !== -1) {
      this.completedTasks.splice(completedIndex, 1);
    }
  }
  completeTask(taskToComplete) {
    taskToComplete._completed = true;
    this.removeTask(taskToComplete);
    this.completedTasks.push(taskToComplete);
  }

  // Serialize project instance
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      tasks: this.tasks.map((task) => task.toJSON()),
    };
  }
}

class Task {
  constructor(title, desc, dueDate, priority = 1) {
    this.title = title;
    this.desc = desc;
    this.dueDate = format(new Date(dueDate), "E',' d MMM uuuu");
    this._date = new Date(dueDate).toISOString().split("T")[0]; // Convert date object to 'yyyy-mm-dd'
    this.priority = priority;
    this.id = uuidv4();
  }

  // Serialize task instance
  toJSON() {
    return {
      title: this.title,
      desc: this.desc,
      dueDate: this.dueDate,
      priority: this.priority,
      id: this.id,
    };
  }
}
