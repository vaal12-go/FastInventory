// Main interactivity file for index.html root page of the application

// TODO: move helper libraries to /libs directory
// TODO: create subfolder js files of each page to increase modularity
// TODO: manage global state with global class, not individual variables

itemListTemplate = ``;

TAG_SELECTED_TEMPLATE = ``;

TAG_UNSELECTED_TEMPLATE = ``;

const NO_TAG_NAME_ID = "no_tag";
const NO_TAG_TAG = {
  tag: NO_TAG_NAME_ID,
  uuid: NO_TAG_NAME_ID,
  description: NO_TAG_NAME_ID,
};

function findImageFileOfItem(item) {
  for (let fileIdx in item.files) {
    let fileRec = item.files[fileIdx];
    if (fileIsImage(fileRec.name)) return fileRec;
  }
  return null;
}

async function tag_click(elem) {
  let filtering_tag_uuid = elem.dataset.taguuid;
  GLOBAL_STATE.items_selection_criteria.tags_selected.push(filtering_tag_uuid);
  // console_debug(
  //   "index:62 tag_click GLOBAL_STATE.items_selection_criteria.tags_selected::",
  //   GLOBAL_STATE.items_selection_criteria.tags_selected
  // );
  populate_tags();
  GLOBAL_STATE.items_selection_criteria.page = 0; //Page to be nulled as new tag is added
  let jsonObj = await get_items_from_server();
  reload_page(jsonObj);
} //async function tag_click(elem) {

function populate_items_list(items) {
  itemsHTML = "";
  if (items.length == 0) {
    document.getElementById("items_placeholder").innerHTML =
      "<h5>No items in selection</h5>";
    return;
  }
  let parsed_search_terms = parse_search_term();
  for (itemIdx in items) {
    item = items[itemIdx];
    // console_debug("index:177 item.name::", item.name);
    let imageFileRec = findImageFileOfItem(item);
    if (parsed_search_terms.length > 0) {
      // console_debug("index:182 parsed_search_terms::", parsed_search_terms);
      positions_arr = find_search_terms_in_string(
        item.name,
        parsed_search_terms
      );
      // console_debug("index:188 positions_arr::", positions_arr);

      // console_debug("index:210 highlighted_str::", highlighted_str);
      item.name = highlight_string(item.name, positions_arr);
      // console_debug("index:189 item.description::", item.description);

      descr_postitions = find_search_terms_in_string(
        item.description,
        parsed_search_terms
      );
      item.description = highlight_string(item.description, descr_postitions);
    } //if(parsed_search_terms.length>0) {

    renderRes = Mustache.render(itemListTemplate, {
      item: item,
      image_rec: imageFileRec,
      BASE_URL: BASE_URL,
    });
    itemsHTML += renderRes;
  }
  document.getElementById("items_placeholder").innerHTML = itemsHTML;
} //function populate_items_list(items) {

async function remove_tag_from_selected(elem) {
  // console_debug("index:99 elem::", elem);
  // console_debug("index:100 elem.dataset.taguuid::", elem.dataset.taguuid);
  // console_debug(
  //   "index:100 GLOBAL_STATE.items_selection_criteria.tags_selected::",
  //   GLOBAL_STATE.items_selection_criteria.tags_selected
  // );
  let idx_to_remove =
    GLOBAL_STATE.items_selection_criteria.tags_selected.indexOf(
      elem.dataset.taguuid
    );
  // console_debug("index:108 idx_to_remove::", idx_to_remove);

  GLOBAL_STATE.items_selection_criteria.tags_selected.splice(idx_to_remove, 1);
  // console_debug(
  //   "index:100 GLOBAL_STATE.items_selection_criteria.tags_selected::",
  //   GLOBAL_STATE.items_selection_criteria.tags_selected
  // );

  populate_tags();

  let jsonObj = await get_items_from_server();
  console_debug("index:56 item_list:>>", jsonObj);
  reload_page(jsonObj);
}

function populate_tags(visible_tag_filter = "") {
  // TODO: move completely to global state management, or create separate object, which will manage tags selection
  let tags = GLOBAL_STATE.items_selection_criteria.tags;
  tagsHTML = "";
  tagsSelectedHTML = "";

  for (tagIdx in tags) {
    let tag = tags[tagIdx];
    if (
      GLOBAL_STATE.items_selection_criteria.tags_selected.includes(tag.uuid)
    ) {
      // console.log("Adding to selected :>> ");
      tagsSelectedHTML += Mustache.render(TAG_SELECTED_TEMPLATE, { tag: tag });
    } else {
      if (
        visible_tag_filter != "" &&
        !tag.tag.toLowerCase().includes(visible_tag_filter)
      )
        continue;
      tagsHTML += Mustache.render(TAG_UNSELECTED_TEMPLATE, { tag: tag });
    }
  }
  document.getElementById("selected-tags-placeholder").innerHTML =
    tagsSelectedHTML;
  document.getElementById("tags-holder").innerHTML = tagsHTML;
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
  let page = GLOBAL_STATE.items_selection_criteria.page;
  let tags = GLOBAL_STATE.items_selection_criteria.tags_selected.join(";");
  let urlParams = `page=${
    GLOBAL_STATE.items_selection_criteria.page
  }&tags=${tags}&search_term=${encodeURI(
    GLOBAL_STATE.items_selection_criteria.search_phrase
  )}`;
  let fetchURL = `${BASE_URL}item/all?${urlParams}`;
  let serverRes = await fetchJSON2(fetchURL, null);
  return serverRes;
}

function generate_page_numbers(served_json) {
  let pagesHTML = "";
  if (served_json.page > 0) pagesHTML = "&#x226A; ";
  // TODO: this will work for pages < 10, but have to be better in cases of more than 10
  pages_arr = get_num_array(served_json.total_pages);
  for (let pageNoIdx in pages_arr) {
    let pageNo = pages_arr[pageNoIdx];
    visible_page_no = pageNo + 1;
    if (pageNo == served_json.page) {
      pagesHTML += `<span class="fs-2 fw-bold">${visible_page_no}</span> | `;
    } else {
      pagesHTML += `<a href="#" data-pageno="${pageNo}" onclick="next_page(this)">${visible_page_no}</a> | `;
    }
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
  console_debug("index:316 window.location::", window.location);

  // URL replacement without reloading window
  window.history.replaceState(
    {},
    "Same old same old",
    `${window.location.origin}${
      window.location.pathname
    }?search_terms=${encodeURI(
      GLOBAL_STATE.items_selection_criteria.search_phrase
    )}`
  );
  let jsonObj = await get_items_from_server();
  reload_page(jsonObj);
}

window.onload = async () => {
  // TODO: populate URL parameters from tags selected and search term and parse those here for reloading
  console_debug("index:316 window.location::", window.location);

  // TODO: move templates to external HTML files for better management
  itemListTemplate = await fetchHTML(
    `${BASE_URL}html/templates/item_list_template.html`
  );

  TAG_SELECTED_TEMPLATE = await fetchHTML(
    `${BASE_URL}html/templates/tag_selected_template.html`
  );

  TAG_UNSELECTED_TEMPLATE = await fetchHTML(
    `${BASE_URL}html/templates/tag_unselected_template.html`
  );

  GLOBAL_STATE.items_selection_criteria = {
    tags: [NO_TAG_TAG],
    tags_selected: [],
    page: 0,
    containing_words: [],
    search_phrase: "",
  };

  let jsonObj = await get_items_from_server();
  console_debug("index:359 jsonObj::", jsonObj);
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
