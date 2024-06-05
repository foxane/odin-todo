class Project {
  static list = []; // Keeping track for each individual project
  name;
  tasks = []; // Tasks inside project instance

  constructor(name) {
    this.name = name;
  }

  // Task controller
  addTask(newTaskObj) {
    this.tasks.push(newTaskObj);
  }
  removeTask(toRemoveObj) {
    const index = this.tasks.indexOf(toRemoveObj);
    if (index !== -1) this.tasks.splice(index, 1);
  }
  assignIds() {
    this.tasks.forEach(function (obj, index) {
      obj.id = index + 1;
    });
  }

  // Static field method
  addToProjectList() {
    Project.list.push(this);
  }
  removeFromProjectList() {
    Project.list.splice(Project.list.indexOf(this), 1);
  }
}

export default Project;
