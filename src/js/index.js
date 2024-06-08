import { Project, Task } from "./project";
import { defaultData } from "./default-data";
import { DOM, domInterface } from "./dom";
import "../css/main.css";
export { allProject };

const allProject = defaultData;
DOM.updateProjectList(allProject);
DOM.updateAllTask(allProject);
console.log(allProject);
