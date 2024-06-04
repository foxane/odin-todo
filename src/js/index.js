import "../css/main.css";

class Project {
  static projects = [];
  name;
  todos = [];

  constructor(name) {
    this.name = name;
  }

  // Get set
  set name(newName) {
    this.name = newName;
  }
  get name() {
    return this.name;
  }

  // Methods
  addTodo(newTodoObj) {
    this.todos.push(newTodoObj);
  }
  removeTodo(toRemoveObj) {
    this.todos.splice(this.todos.indexOf(toRemoveObj), 1);
  }

  addToStatic() {
    Project.projects.push(this);
  }
  removeFromStatic() {
    Project.projects.splice(Project.projects.indexOf(this), 1);
  }
}

class Todo {
  constructor(title, desc, dueDate, project, importance) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.project = project;
    this.importance = importance;
  }
}

for (let i = 0; i < 5; i++) {
  const project = new Project(i);
  project.addToStatic();
  for (let j = 0; j < 5; j++) {
    project.addTodo(new Todo(i + j));
  }
}
console.log(Project.projects); // return the array correctly

localStorage.setItem("todo-projects", JSON.stringify(Project.projects));
console.log(JSON.parse(localStorage.getItem("todo-projects")));
