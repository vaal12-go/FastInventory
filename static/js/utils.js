// TODO: add utils.FETCH_DEBUG variable to control if fetch URLs and responces are logged to console

// TODO: add debug=false parameter to fetch URL function
// TODO: make fetch function awaitable

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
  console.log("fetchJSON url:>> ", url);
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

function console_debug(title_str, debug_var, debugOverride = false) {
  // console.log("debug_var :>> ", debug_var);
  if (GLOBAL_STATE.DEBUG) {
    console.log(title_str + ":>>>", debug_var);
  }
}

// From https://stackoverflow.com/a/11231664
// var type = (function (global) {
//   var cache = {};
//   return function (obj) {
//     var key;
//     return obj === null
//       ? "null" // null
//       : obj === global
//       ? "global" // window in browser or global in nodejs
//       : (key = typeof obj) !== "object"
//       ? key // basic: string, boolean, number, undefined, function
//       : obj.nodeType
//       ? "object" // DOM element
//       : cache[(key = {}.toString.call(obj))] || // cached. date, regexp, error, object, array, math
//         (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
//   };
// })(this);

function get_obj_type(obj) {
  var key;
  let internal_type =
    obj === null
      ? "null" // null
      : // : // : obj === global  //TODO: check if window can be detected somehow else. In initial version (https://stackoverflow.com/a/11231664) this was a parameter
      // ? "global" // window in browser or global in nodejs
      (key = typeof obj) !== "object"
      ? key // basic: string, boolean, number, undefined, function
      : obj.nodeType
      ? "object" // DOM element
      : Object.prototype.toString.call(obj);
  // : cache[(key = {}.toString.call(obj))] || // cached. date, regexp, error, object, array, math
  //   (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
  // console_debug("utils:72 internal_type:>>", internal_type);
  switch (internal_type) {
    case "[object Null]":
      return "null";
    case "string":
      return "string";
    case "[object Object]":
      return "object";
    case "[object Array]":
      return "array";
    case "[object Boolean]":
      return "boolean";
    case "number":
      return "number";
    case "[object Date]":
      return "date";
    default:
      return (
        "unknown type. Object.prototype.toString.call(obj)=>" + internal_type
      );
  }
}

function get_num_array(max_num) {
  return [...Array(max_num).keys()];
}

function render_single_obj(obj, template = null) {
  let keys = Object.keys(obj);
  console_debug("utils:98 keys:>>", keys);
  let defaultTemplate = `
      {{#vals}}
      <p> 
        <b>{{key}}</b>: {{field}}
      </p>
      {{/vals}}
  `;

  let key_map = keys.map((k) => ({ key: k, field: obj[k] }));
  console_debug("utils:110 key_map:>>", key_map);
  let render_res = Mustache.render(defaultTemplate, {
    vals: key_map,
  });
  console_debug("utils:111 render_res:>>", render_res);
  // for (let keyIdx in keys) {
  // }
  return render_res;
}

function render_obj_as_html(obj, template = null) {
  console_debug("utils:74 get_obj_type(obj):>>", get_obj_type(obj));
  let defaultArrayTemplate = `
    {{#elements}}
      <div>
        {{& .}}
      </div>
      ---------------------------------------
    {{/elements}}
  `;
  switch (get_obj_type(obj)) {
    case "array":
      console_debug("we have array of objects. will iterate");
      let renderedArr = obj.map((arrObj) => render_single_obj(arrObj));
      console_debug("utils:130 renderedArr:>>", renderedArr);
      let render_res = Mustache.render(defaultArrayTemplate, {
        elements: renderedArr,
      });
      console_debug("utils:135 render_res:>>", render_res);
      return render_res;
  }
  return "not implemented";
}

async function fetchJSON2(url, options, debugOverride = false) {
  // TODO: will be fully awaitable and honoring Debug parameters
  // console_debug("utils:43 url:>>", url);

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    // console_debug("utils:48 json:>>", json);
    return json;
  } catch (err) {
    // console_debug("utils:51.fetchJSON2 err:>>", err);
    throw err;
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
  console.log("Hiding element :>> ", elName);
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
        var fetchURL = `${BASE_URL}item/${item_uuid}`;
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
