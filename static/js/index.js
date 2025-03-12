// Main interactivity file for index.html root page of the application

// TODO: move helper libraries to /libs directory
// TODO: create subfolder js files of each page to increase modularity
// TODO: manage global state with global class, not individual variables

itemListTemplate = `
    <div class="row border mb-1">
      <div class="row">
        <div class="col-1 justify-content-center text-center">
        {{#image_rec}}
            <img src="{{BASE_URL}}item_file/{{image_rec.uuid}}" width="70" height="70">
        {{/image_rec}}
        {{^image_rec}}
          <img src="{{BASE_URL}}img/no-photo-svgrepo-com.svg" width="50px" height="50">
        {{/image_rec}}
        </div>  
        <div class="col-10 text-start">
          <h5>{{item.name}}</h5>
          <a href="./item.html?itemUUID={{item.uuid}}">Edit</a>
          <div class="row">
        <div class="col-10">
          {{item.uuid}} | | {{item.description}} | {{#item.container_uuid}}
          Container:{{item.container_uuid}} | {{/item.container_uuid}} {{#item.tags}} >>
          {{item.tag}} {{/item.tags}}
        </div>
        <div class="col-2"></div>
      </div>
        </div>  
      </div>
    </div>
`;

const NO_TAG_NAME_ID = "no_tag";

function fileIsImage(fName) {
  let last_dot_idx = fName.lastIndexOf(".");
  let fExt = fName.substring(last_dot_idx + 1);
  // console.log("fExt :>> ", fExt);
  let imgExtArray = ["png", "jpg", "jpeg"];
  if (imgExtArray.includes(fExt.toLowerCase())) return true;
  else return false;
}

function findImageFileOfItem(item) {
  // console.log("item :>> ", item);
  for (let fileIdx in item.files) {
    let fileRec = item.files[fileIdx];
    // console.log("file :>> ", fileRec);
    if (fileIsImage(fileRec.name)) return fileRec;
  }
  return null;
}

async function tag_click(elem) {
  console.log("Have tag click. This :>> ", this);
  console.log("elem :>> ", elem);
  console.log("elem.id :>> ", elem.id);
  let filtering_tag_uuid = elem.id;

  // let fetchURL = `${BASE_URL}item/all`;
  // let jsonObj = await fetchJSON2(fetchURL, null);
  // console_debug("index:60 jsonObj:>>", jsonObj);

  let jsonObj = await get_items_from_server(0, filtering_tag_uuid);
  // console_debug("index:56 item_list:>>", jsonObj);
  reload_page(jsonObj);

  // let filtered_items = jsonObj.items.filter((item) => {
  //   // console.log("item :>> ", item);
  //   if (filtering_tag_uuid == "no_tag" && item.tags.length == 0) return true;
  //   if (item.tags.length == 0) return false;
  //   console_debug("index:66 item:>>", item);
  //   let filtered_tags = item.tags.filter((tag) => {
  //     // console.log("tag.uuid :>> ", tag.uuid);
  //     // console_debug("index:69 filtering_tag_uuid:>>", filtering_tag_uuid);
  //     // console_debug(
  //     //   "index:70 tag.uuid==filtering_tag_uuid:>>",
  //     //   tag.uuid == filtering_tag_uuid
  //     // );
  //     return tag.uuid == filtering_tag_uuid ? true : false;
  //   }); //let filtered_tags = item.tags.filter((tag)=>{
  //   // console.log("filtered_tags :>> ", filtered_tags);
  //   if (filtered_tags.length == 0) return false;
  //   return true;
  // }); //let filtered_items = jsonObj.map((item)=>{
  // // console.log("filtered_items :>> ", filtered_items);
  // populate_items_list(filtered_items);
} //async function tag_click(elem) {

function populate_items_list(items) {
  itemsHTML = "";
  if (items.length == 0) {
    document.getElementById("items_placeholder").innerHTML =
      "<h5>No items in selection</h5>";
    return;
  }
  for (itemIdx in items) {
    item = items[itemIdx];
    let imageFileRec = findImageFileOfItem(item);
    renderRes = Mustache.render(itemListTemplate, {
      item: item,
      image_rec: imageFileRec,
      BASE_URL: BASE_URL,
    });
    itemsHTML += renderRes;
  }
  document.getElementById("items_placeholder").innerHTML = itemsHTML;
}

function populate_tags(tags, add_no_tag = true) {
  tagsHTML = "";
  if (add_no_tag)
    tagsHTML += `<a href="#" id="${NO_TAG_NAME_ID}" onclick="tag_click(this)">${NO_TAG_NAME_ID}</a>; `;
  // console_debug("index:106 tags presort:>>", tags);
  tags.sort((a, b) => {
    return a.tag.localeCompare(b.tag);
  });
  // console_debug("index:107 tags after sort:>>", tags);
  for (tagIdx in tags) {
    let tag = tags[tagIdx];
    tagsHTML += `<a href="#" id="${tag.uuid}" onclick="tag_click(this)">${tag.tag}</a>; `;
  }
  document.getElementById("tags-holder").innerHTML = tagsHTML;
}

async function reload_page(server_json) {
  populate_items_list(server_json.items);
  generate_page_numbers(server_json);
}

async function next_page(el) {
  // console_debug("index:126 el::", el);
  // console_debug("index:125 el.dataset.pageno:>>", el.dataset.pageno);
  let served_json = await get_items_from_server(el.dataset.pageno);
  await reload_page(served_json);
}

async function get_items_from_server(page = 0, tags = "") {
  let fetchURL = `${BASE_URL}item/all?page=${page}&tags=${tags}`;
  console_debug("index:130 fetchURL:>>", fetchURL);
  let serverRes = await fetchJSON2(fetchURL, null);
  console_debug("index:132 serverRes:>>", serverRes);
  return serverRes;
}

function generate_page_numbers(served_json) {
  // console_debug("index:125 served_json:>>", served_json);
  let pagesHTML = "";
  if (served_json.page > 0) pagesHTML = "&#x226A; ";
  // console_debug("index:128 pagesHTML:>>", pagesHTML);
  // console_debug(
  //   "index:133 get_num_array(served_json.total_pages):>>",
  //   get_num_array(served_json.total_pages)
  // );
  // TODO: this will work for pages < 10, but have to be better in cases of more than 10
  pages_arr = get_num_array(served_json.total_pages);
  for (let pageNoIdx in pages_arr) {
    let pageNo = pages_arr[pageNoIdx];
    // console_debug("index:138 get_obj_type(pageNo):>>", get_obj_type(pageNo));
    visible_page_no = pageNo + 1;
    if (pageNo == served_json.page) {
      pagesHTML += `<span class="fs-2 fw-bold">${visible_page_no}</span> | `;
    } else {
      pagesHTML += `<a href="#" data-pageno="${pageNo}" onclick="next_page(this)">${visible_page_no}</a> | `;
    }
    // console_debug("index:131 pagesHTML:>>", pagesHTML);
  }
  document.getElementById("pagination-holder").innerHTML = pagesHTML;
} //function generate_page_numbers(served_json) {

async function tag_search() {
  let search_term = document
    .getElementById("tag_search_input")
    .value.toLowerCase();
  console_debug("index:102 search_term:>>", search_term);

  let tagsURL = `${BASE_URL}tag`;
  let tagsResp = await fetchJSON2(tagsURL, null);
  // console_debug("index:74 tagsResp:>>", tagsResp);
  let tags_filtered = tagsResp.tags.filter((tag) => {
    return tag.tag.toLowerCase().includes(search_term);
  });

  let include_no_tag = NO_TAG_NAME_ID.toLowerCase().includes(search_term)
    ? true
    : false;
  populate_tags(tags_filtered, include_no_tag);
} //async function tag_search() {

window.onload = async () => {
  let jsonObj = await get_items_from_server(0);
  // console_debug("index:56 item_list:>>", jsonObj);
  reload_page(jsonObj);
  // populate_items_list(jsonObj.items);
  // generate_page_numbers(jsonObj);

  //Populating tags
  let tagsURL = `${BASE_URL}tag`;
  let tagsResp = await fetchJSON2(tagsURL, null);
  // console_debug("index:74 tagsResp:>>", tagsResp);
  populate_tags(tagsResp.tags);

  document
    .getElementById("tag_search_input")
    .addEventListener("input", tag_search);
}; //window.onload = () => {
