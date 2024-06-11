import { defaultData } from "./default-data";
import { Project, Task } from "./project";
export { refreshInstance, updateLocalStorage };

// Retrive updated data
// This only need to be called once when the page load
const refreshInstance = () => {
  Project.projectList.length = 0;

  // Deserialize json into instances
  const projectArr = JSON.parse(localStorage.getItem("data"));
  for (const project of projectArr) {
    const deserializedProject = new Project(project.name);
    // Turn all element inside task to Task instances
    for (const task of project.tasks) {
      const refreshedTask = new Task(
        task.title,
        task.desc,
        task.dueDate,
        task.priority,
        task.completed
      );
      // Append task into taskArr
      deserializedProject.addTask(refreshedTask);
    }

    // For completed tasks
    for (const task of project.completedTasks) {
      const refreshedTask = new Task(
        task.title,
        task.desc,
        task.dueDate,
        task.priority,
        task.completed
      );
      deserializedProject.addCompletedTask(refreshedTask);
    }
  }
};

// Save updated data after each changes
const updateLocalStorage = () => {
  localStorage.setItem("data", JSON.stringify(Project.projectList));
};
