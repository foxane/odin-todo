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
  }

  // Add and remove task from task arr
  // Both of this must be called from project instance they are on
  addTask(newTask) {
    this.tasks.push(newTask);
  }
  addCompletedTask(task) {
    this.completedTasks.push(task);
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
    taskToComplete.completed = true;
    this.removeTask(taskToComplete);
    this.completedTasks.push(taskToComplete);
  }
}

class Task {
  completed = false;
  constructor(
    title,
    desc = "Why didn't you give us description? Am i that worthless like our creator?",
    dueDate,
    priority = 1,
    completed = false
  ) {
    this.title = title;
    this.desc = desc;
    this.dueDate = format(new Date(dueDate), "E',' d MMM uuuu");
    this._date = new Date(dueDate).toISOString().split("T")[0]; // Convert date object to 'yyyy-mm-dd'
    this.priority = priority;
    this.completed = completed;
    this.id = uuidv4();
  }
}
