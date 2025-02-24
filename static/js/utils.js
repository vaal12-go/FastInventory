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

function addOptionToSelect(
  selectElId,
  text = "No text",
  value = -1,
  selected = false
) {
  selectorElem = document.getElementById(selectElId);
  newOpt = document.createElement("option");
  newOpt.value = value;
  newOpt.text = text;
  if (selected) {
    newOpt.selected = true;
  }
  selectorElem.options.add(newOpt);
} //function addOptionToSelect(selectElId,

function hideDivElement(elName) {
  document.getElementById(elName).classList.add("hiddenDiv");
} //function hideDivElement(elName) {

function showDivElement(elName) {
  document.getElementById(elName).classList.add("visibleDiv");
} //function hideDivElement(elName) {

class ItemGetter {
  item_uuid = null;

  constructor(item_uuid) {
    this.item_uuid = item_uuid;
  }

  static getItem(item_uuid) {
    return {
      then(onFulfilled, onRejected) {
        var fetchURL = `${window.location.origin}/item/${item_uuid}`;
        fetchJSON(
          fetchURL,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          },
          (jsonObj) => {
            onFulfilled(jsonObj);
          } //(jsonObj) => {
        ); //fetchJSON(
      },
    };
  }
} //class ItemGetter {
