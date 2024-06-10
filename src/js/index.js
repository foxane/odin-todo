import { Project, Task } from "./project";
import { DOM, domInterface, sortController } from "./dom";
import "../css/main.css";
import { getData, setData, setDefaultData } from "./local-storage";
import { defaultData } from "./default-data";
export { init };

// Init
const init = (() => {
  let allProject;
  if (getData() === "not found") {
    allProject = setDefaultData();
  } else {
    allProject = getData();
  }

  return allProject;
})();

sortController("all");

DOM.updateProjectList(init);
