import {
  DEFAULT_ITEMS_ON_PAGE,
  ITEM_CARD_HEIGHT,
  ITEM_CARD_WIDTH,
} from "./constants.js";

export function fileIsImage(fName) {
  let last_dot_idx = fName.lastIndexOf(".");
  let fExt = fName.substring(last_dot_idx + 1);
  let imgExtArray = ["png", "jpg", "jpeg"];
  if (imgExtArray.includes(fExt.toLowerCase())) return true;
  else return false;
}

export function findImageFileOfItem(item) {
  for (let fileIdx in item.files) {
    let fileRec = item.files[fileIdx];
    if (fileIsImage(fileRec.name)) return fileRec;
  }
  return null;
}

export function getItemsOnPage() {
  // console.log('window.innerWidth :>> ', window.innerWidth);
  // console.log('window.innerHeight :>> ', window.innerHeight);
  const itmContainerEl = document.getElementById("items-container");
  let itmsOnPage = DEFAULT_ITEMS_ON_PAGE;
  if (itmContainerEl) {
    // console.log('itmContainerEl.offsetLeft :>> ', itmContainerEl.offsetLeft);
    // console.log('itmContainerEl.offsetTop :>> ', itmContainerEl.offsetTop);
    // console.log('itmContainerEl.offsetWidth :>> ', itmContainerEl.offsetWidth);
    const itmsInRow = Math.floor(
      (itmContainerEl.offsetWidth - 20) / ITEM_CARD_WIDTH
    );
    // console.log('itmsInRow :>> ', itmsInRow);
    const rowsOnPage = Math.floor(
      (window.innerHeight - itmContainerEl.offsetTop - 50) / ITEM_CARD_HEIGHT
    );
    // console.log('rowsOnPage :>> ', rowsOnPage);
    itmsOnPage = itmsInRow * rowsOnPage;
    // console.log(' itmsOnPage :>> ',  itmsOnPage);
  } else {
    // console.log('itmContainerEl :>> ', itmContainerEl);
  }
  return itmsOnPage;
} //export function getItemsOnPage() {

export function getFilterParams(searchParams) {
  return {
    search_term: searchParams.get("itemFilter")
      ? searchParams.get("itemFilter")
      : "",
    tags: searchParams.get("tags") ? searchParams.get("tags") : "",
    page: searchParams.get("page") ? searchParams.get("page") : 1,
    items_on_page: searchParams.get("items_on_page")
      ? searchParams.get("items_on_page")
      : getItemsOnPage(),
  };
}

async function getHeader() {
  // This is a sample implementation
  await fetch(url, {
    method: "HEAD",
  });
  var extURLHeader = headResponce.headers.get("X-app-ext-url");
  console.log("headers [X-app-ext-url] :>> ", extURLHeader);
  setBaseAPIURLInternal(extURLHeader);
  setBaseAPIURL(extURLHeader + "/api");
}
