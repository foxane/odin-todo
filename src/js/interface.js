// Interface with localstorage
const data = (() => {
  const getData = () => {
    return JSON.parse(localStorage.getItem("fxn-todo"));
  };

  const setData = (dataObj) => {
    return localStorage.setItem("fxn-todo", JSON.stringify(dataObj));
  };

  const clearData = () => {
    localStorage.removeItem("fxn-todo");
  };

  return { getData, setData, clearData };
})();

export default data;
