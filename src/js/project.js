class Project {
  task = [];
}

// Project Handler
const createProject = (projectName, projectContainer) => {
  projectContainer[projectName] = new Project();
};
// Project container must be initialized for each execution
const deleteProject = (projectName, projectContainer) => {
  delete projectContainer[projectName];
};

// Task handler
class Task {
  constructor(title, desc = "Undefined", dueDate, priority = 1) {
    this.title = title;
    this.desc = desc;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
  }
}
// Create task need project to functions !
const createTask = (project, taskProperties) => {
  const task = new Task(...taskProperties);
  project.task.push(task);
};

// Which project the task in, and the task itself
const deleteTask = (project, taskToDelete) => {
  project.task.splice(project.task.indexOf(taskToDelete), 1);
};

export { createProject, deleteProject, createTask, deleteTask };
