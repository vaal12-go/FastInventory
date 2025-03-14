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
        </div>
        <div class="row text-start">
          <div class="col-1"></div>
          <div class="col-10">
            UUID:{{item.uuid}} 
          </div>
        </div>
        <div class="row text-start">
          <div class="col-1"></div>
          <div class="col-10">
            Description: {{item.description}}
          </div>
        </div>
        {{#item.container_uuid}}
        <div class="row text-start">
          <div class="col-1"></div>
          <div class="col-10">
              Container: {{item.container_uuid}} | 
          </div>
        </div>
        {{/item.container_uuid}}
        <div class="row text-start">
          <div class="col-1"></div>
          <div class="col-10">
              Tags: {{#item.tags}} {{tag}}; {{/item.tags}}
          </div>
        </div>
      </div>
        </div>  
      </div>
    </div>
`;

const NO_TAG_NAME_ID = "no_tag";
const NO_TAG_TAG = {
  tag: NO_TAG_NAME_ID,
  uuid: NO_TAG_NAME_ID,
  description: NO_TAG_NAME_ID,
};

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
  // console.log("elem :>> ", elem);
  // console.log("tag_click elem.id :>> ", elem.id);
  let filtering_tag_uuid = elem.id;

  GLOBAL_STATE.items_selection_criteria.tags_selected.push(filtering_tag_uuid);
  console_debug(
    "index:62 tag_click GLOBAL_STATE.items_selection_criteria.tags_selected::",
    GLOBAL_STATE.items_selection_criteria.tags_selected
  );
  populate_tags();
  GLOBAL_STATE.items_selection_criteria.page = 0; //Page to be nulled as new tag is added
  let jsonObj = await get_items_from_server();
  console_debug("index:56 item_list:>>", jsonObj);
  reload_page(jsonObj);
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
    console_debug("index:96 item::", item);
    renderRes = Mustache.render(itemListTemplate, {
      item: item,
      image_rec: imageFileRec,
      BASE_URL: BASE_URL,
    });
    itemsHTML += renderRes;
  }
  document.getElementById("items_placeholder").innerHTML = itemsHTML;
}

async function remove_tag_from_selected(elem) {
  console_debug("index:99 elem::", elem);
  console_debug("index:100 elem.dataset.taguuid::", elem.dataset.taguuid);
  console_debug(
    "index:100 GLOBAL_STATE.items_selection_criteria.tags_selected::",
    GLOBAL_STATE.items_selection_criteria.tags_selected
  );
  let idx_to_remove =
    GLOBAL_STATE.items_selection_criteria.tags_selected.indexOf(
      elem.dataset.taguuid
    );
  console_debug("index:108 idx_to_remove::", idx_to_remove);

  GLOBAL_STATE.items_selection_criteria.tags_selected.splice(idx_to_remove, 1);
  console_debug(
    "index:100 GLOBAL_STATE.items_selection_criteria.tags_selected::",
    GLOBAL_STATE.items_selection_criteria.tags_selected
  );

  populate_tags();

  let jsonObj = await get_items_from_server();
  console_debug("index:56 item_list:>>", jsonObj);
  reload_page(jsonObj);
}

function populate_tags(visible_tag_filter = "") {
  // console_debug("index:94 populate_tags::", "");
  // console_debug("index:95 visible_tag_filter::", visible_tag_filter);
  // console_debug(
  //   "index:96 GLOBAL_STATE.items_selection_criteria.tags_selected::",
  //   GLOBAL_STATE.items_selection_criteria.tags_selected
  // );
  // TODO: move completely to global state management, or create separate object, which will manage tags selection
  let tags = GLOBAL_STATE.items_selection_criteria.tags;
  tagsHTML = "";
  tagsSelectedHTML = "";
  // if (add_no_tag)
  //   tagsHTML += `<a href="#" id="${NO_TAG_NAME_ID}" onclick="tag_click(this)">${NO_TAG_NAME_ID}</a>; `;

  for (tagIdx in tags) {
    let tag = tags[tagIdx];
    // console_debug("index:109 tag::", tag);
    if (
      GLOBAL_STATE.items_selection_criteria.tags_selected.includes(tag.uuid)
    ) {
      console.log("Adding to selected :>> ");
      tagsSelectedHTML += `<div class="row"><div class="col">${tag.tag}..<a href="#" data-taguuid="${tag.uuid}" onclick="remove_tag_from_selected(this)">[x]</a></div></div>`;
    } else {
      if (
        visible_tag_filter != "" &&
        !tag.tag.toLowerCase().includes(visible_tag_filter)
      )
        continue;
      tagsHTML += `<a href="#" id="${tag.uuid}" onclick="tag_click(this)">${tag.tag}</a>; `;
    }
  }
  document.getElementById("selected-tags-placeholder").innerHTML =
    tagsSelectedHTML;
  // console_debug("index:118 tagsSelectedHTML::", tagsSelectedHTML);
  document.getElementById("tags-holder").innerHTML = tagsHTML;
  // console_debug("index:128 tagsHTML::", tagsHTML);
} //function populate_tags(tags, add_no_tag = true) {

async function reload_page(server_json) {
  populate_items_list(server_json.items);
  generate_page_numbers(server_json);
}

async function next_page(el) {
  let served_json = await get_items_from_server(el.dataset.pageno);
  await reload_page(served_json);
}

async function get_items_from_server() {
  console_debug("index:169 get_items_from_server");
  console_debug(
    "index:169 GLOBAL_STATE.items_selection_criteria::",
    GLOBAL_STATE.items_selection_criteria
  );
  let page = GLOBAL_STATE.items_selection_criteria.page;
  let tags = GLOBAL_STATE.items_selection_criteria.tags_selected.join(";");
  let urlParams = `page=${
    GLOBAL_STATE.items_selection_criteria.page
  }&tags=${tags}&search_term=${encodeURI(
    GLOBAL_STATE.items_selection_criteria.search_phrase
  )}`;
  let fetchURL = `${BASE_URL}item/all?${urlParams}`;
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
  // console_debug("index:102 search_term:>>", search_term);
  populate_tags(search_term);
} //async function tag_search() {

async function item_search() {
  GLOBAL_STATE.items_selection_criteria.search_phrase =
    document.getElementById("item_search_input").value;
  console_debug(
    "index:213 GLOBAL_STATE.items_selection_criteria.search_phrase::",
    GLOBAL_STATE.items_selection_criteria.search_phrase
  );
  let jsonObj = await get_items_from_server();
  reload_page(jsonObj);
}

window.onload = async () => {
  GLOBAL_STATE.items_selection_criteria = {
    tags: [NO_TAG_TAG],
    tags_selected: [],
    page: 0,
    containing_words: [],
    search_phrase: "",
  };

  let jsonObj = await get_items_from_server(0);
  reload_page(jsonObj);

  //Populating tags
  let tagsURL = `${BASE_URL}tag`;
  let tagsResp = await fetchJSON2(tagsURL, null);
  GLOBAL_STATE.items_selection_criteria.tags.push(...tagsResp.tags);

  GLOBAL_STATE.items_selection_criteria.tags.sort((a, b) => {
    return a.tag.localeCompare(b.tag);
  });

  populate_tags();

  document
    .getElementById("tag_search_input")
    .addEventListener("input", tag_search);

  document
    .getElementById("item_search_input")
    .addEventListener("input", item_search);
}; //window.onload = () => {
