function swapClassesOnElement(elID, classToRemove, classToAdd) {
  el = document.getElementById(elID);
  if (el === null) {
    console.log("swapClassesOnElement Have NULL ELEMENT");
    console.log("elID :>> ", elID);
    console.log("el :>> ", el);
    //   TODO: throw exception here
  }
  if (classToRemove != "") el.classList.remove(classToRemove);
  if (classToAdd != "") el.classList.add(classToAdd);
} //function swapClassesOnElement(elID, classToRemove, classToAdd) {

async function fetchJSON(url, options, jsonFunction) {
  try {
    const response = await fetch(url, options);
    // if (!response.ok) {
    //   updateServerStatus({ serverStatus: "offline" });
    //   // throw new Error(`Response status: ${response.status}`);
    // }
    const json = await response.json();
    jsonFunction(json);
  } catch (err) {
    // updateServerStatus({ serverStatus: "offline" });
    console.log("Catched exception:", err);
  }
} //async function fetchJSON(url, options, jsonFunction) {
