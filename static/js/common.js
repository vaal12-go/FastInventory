let GLOBAL_STATE = {
  BASE_URL: "",
  DEBUG_FETCH: true,
  DEBUG: true,
};

var BASE_URL = "";

function calculateBaseURL() {
  // console.log("window.location :>> ", window.location);
  // console.log("window.location.href :>> ", window.location.href);
  var lastIdx = window.location.href.lastIndexOf("html/");
  // console.log("lastIdx :>> ", lastIdx);
  var baseurl = window.location.href.substring(0, lastIdx);
  // console.log(" baseurl :>> ", baseurl);
  BASE_URL = window.location.href.substring(0, lastIdx);
}

function initGlobalState() {
  calculateBaseURL();
  GLOBAL_STATE.BASE_URL = BASE_URL;
}

initGlobalState();
