let GLOBAL_STATE = {
  BASE_URL: "",
  DEBUG_FETCH: true,
  DEBUG: true,
};

var BASE_URL = "";

async function getApplicationExternalURLHeader() {
  const url = window.location.href;
  const headResponce = await fetch(url, {
    method: "HEAD",
  });
  var extURLHeader = headResponce.headers.get("X-app-ext-url");
  console.log("headers [X-app-ext-url] :>> ", extURLHeader);
  return extURLHeader;
}


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  console.log('ca :>> ', ca);
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

function calculateBaseURL() {
  console.log("calculateBaseURL window.location :>> ", window.location);
  var lastIdx = window.location.href.lastIndexOf("html/");
  var baseurl = window.location.href.substring(0, lastIdx);
  BASE_URL = (getCookie("api_url"));
  console.log('BASE_URL :>> ', BASE_URL);
}

function initGlobalState() {
  calculateBaseURL();
  GLOBAL_STATE.BASE_URL = BASE_URL;
}

initGlobalState();


