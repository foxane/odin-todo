export { Project, Task };
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// Project
class Project {
  static projectList = [];
  task = [];

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
    this.task.push(newTask);
    newTask.index = this.task.indexOf(newTask);
  }
  removeTask(toRemove) {
    this.task.splice(toRemove.index, 1);
  }
}

class Task {
  constructor(title, desc, dueDate, priority = 1) {
    this.title = title;
    this.desc = desc;
    this.dueDate = format(new Date(dueDate), "E',' d MMM uuuu");
    this.priority = priority;
    this.id = uuidv4();
  }
}
