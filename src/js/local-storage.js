import { defaultData } from "./default-data";
import { Project, Task } from "./project";
export { refreshInstance, updateLocalStorage };

// Retrive updated data
const refreshInstance = () => {
  Project.projectList.length = 0;

  // Deserialize json into instances
  const projectArr = JSON.parse(localStorage.getItem("data"));
  for (const project of projectArr) {
    const deserializedProject = new Project(project.name);
    // Turn all element inside task to TAsk instances
    deserializedProject.tasks.map(
      (el) => new Task(el.title, el.desc, el.dueDate, el.priority, el.completed)
    );
    // For completed tasks
    deserializedProject.completedTasks.map(
      (el) => new Task(el.title, el.desc, el.dueDate, el.priority, el.completed)
    );
  }
};

// Save updated data after each changes
const updateLocalStorage = () => {
  localStorage.setItem("data", JSON.stringify(Project.projectList));
};
