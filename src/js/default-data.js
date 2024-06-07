import { Project, Task } from "./project"; // Importing Project and Task classes from your module
// Create deafult projects

// Function to generate a random date within a range
function generateRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Function to create a new project with 5 tasks
function createProjectWithTasks(projectName, taskNames) {
  const project = new Project(projectName); // Create a new project

  // Create 5 tasks with specified names and add them to the project
  taskNames.forEach((taskName) => {
    const priorityOptions = [1, 2, 3];
    const priority =
      priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    const dueDate = generateRandomDate(
      new Date(),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ); // Generating a random due date within 30 days from now
    const task = new Task(
      taskName,
      `Description for looawgur uaegu aeug aei uvu va ${taskName}`,
      dueDate,
      priority
    );
    project.addTask(task);
  });
}

// Create 3 projects, each with 5 tasks
const projects = [
  {
    name: "School",
    tasks: [
      "Complete Math Homework",
      "Study for Science Test",
      "Write History Essay",
      "Prepare for Presentation",
      "Read Literature Book",
    ],
  },
  {
    name: "Home",
    tasks: [
      "Clean Room",
      "Do Laundry",
      "Cook Dinner",
      "Water Plants",
      "Walk the Dog",
    ],
  },
  {
    name: "Work",
    tasks: [
      "Finish Project Proposal",
      "Attend Team Meeting",
      "Review Code",
      "Send Report to Manager",
      "Schedule Client Meeting",
    ],
  },
];

projects.forEach((project) => {
  createProjectWithTasks(project.name, project.tasks);
});
const defaultData = Project.projectList;

export { defaultData };
