import { defaultData } from "./default-data";
import { Project, Task } from "./project";
export { getData, setData, setDefaultData };

// Retrieve data
const getData = () => {
  // Deserialize JSON in localStorage
  const storedProjects = JSON.parse(localStorage.getItem("todo"));
  if (!storedProjects) return "not found"; // Return an empty array if no data found

  const deserializedProjects = storedProjects.map((project) => {
    const deserializedProject = new Project(project.name);
    project.tasks.forEach((task) => {
      const deserializedTask = new Task(
        task.title,
        task.desc,
        task.dueDate,
        task.priority
      );
      deserializedProject.addTask(deserializedTask);
    });
    return deserializedProject;
  });
  console.log(deserializedProjects);
  return deserializedProjects;
};

// Sotoring data
// User data
const setData = () => {
  const serializedProjects = Project.projectList.map((project) =>
    project.toJSON()
  );
  localStorage.setItem("todo", JSON.stringify(serializedProjects));
};

// Default data
const setDefaultData = () => {
  const serializedDefault = defaultData.map((project) => project.toJSON());
  localStorage.setItem("todo", JSON.stringify(serializedDefault));
};
