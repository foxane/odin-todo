import { createProject, createTask } from "./project";
import { add } from "./utils";

const projectList = {};

// Projects
createProject("School", projectList);
createProject("Coding", projectList);
createProject("Home", projectList);

// Task
const today = add(new Date(), { hours: 5 });
const thisWeek = add(new Date(), { days: 2 });
const thisMonth = add(new Date(), { days: 10 });

createTask(projectList.School, [
  "Homework",
  "Purge homework files before anyone sees it",
  today,
  "high",
]);
createTask(projectList.School, [
  "Homework",
  "Ask mom to help with biology homework",
  thisWeek,
  "low",
]);
createTask(projectList.School, [
  "Final",
  "Dont kare if i pass or not",
  thisMonth,
  "medium",
]);

// Coding
createTask(projectList.Coding, [
  "Calculator",
  "Fix Your broken calculator project",
  thisMonth,
  "low",
]);
createTask(projectList.Coding, [
  "Todo Project",
  "Start working on this project you are using",
  thisWeek,
  "medium",
]);
createTask(projectList.Coding, [
  "Delete unused GH ssh keys",
  "Start working on this project you are using",
  thisWeek,
  "high",
]);

// Home
createTask(projectList.Home, [
  "Coup de Grass",
  "Your lawn is becomig forest...",
  thisWeek,
  "low",
]);
createTask(projectList.Home, [
  "Get Sum milf",
  "Run out of milk, dont forget to get it when you're out",
  today,
  "high",
]);

export default projectList;
