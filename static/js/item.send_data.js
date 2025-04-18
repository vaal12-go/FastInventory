function collect_item_data() {
  container_select_el = document.getElementById("container_select");
  container_selected =
    container_select_el.options[container_select_el.selectedIndex];
  console.log("container_selected :>> ", container_selected);
  console.log("container_selected value :>> ", container_selected.value);
  cont_uuid = container_selected.value == -1 ? null : container_selected.value;

  tgUUIDs = [];
  selectData = $("#tags_select2_selector").select2("data");
  console.log("selectData :>> ", selectData);
  for (tagIdx in selectData) {
    tag = selectData[tagIdx];
    console.log("tag :>> ", tag);
    newTagToSend = {
      tag: tag.text,
      uuid: tag.id,
    };
    tgUUIDs.push(newTagToSend);
  }

  console.log("tgUUIDs :>> ", tgUUIDs);

  new_item_request = {
    // uuid: item_uuid,
    name: document.getElementById("item_name_input").value,
    description: document.getElementById("item_description_textarea").value,
    container_uuid: cont_uuid,
    tags_uuids: tgUUIDs,
  };
  console.log("new_item_request :>> ", new_item_request);
  return new_item_request;
} //function collect_item_data() {

function send_data(item_uuid) {
  console.log("Send data started :>> ");
  if (item_uuid === null) {
    console.log("Will send NEW item :>> ");
    selected_tags = $("#tags_select2_selector").select2("data");
    console.log("selected_tags :>> ", selected_tags);
    new_item_request = collect_item_data();
    fetchURL = `${BASE_URL}item/`;
    // console.log("fetchURL :>> ", fetchURL);
    fetchJSON(
      fetchURL,
      {
        method: "POST",
        body: JSON.stringify(new_item_request),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
      (jsonObj) => {
        console.log("Have responce :>> ", jsonObj);
        if ((jsonObj.status = "success")) {
          window.location.replace(
            window.location.toLocaleString() + "?itemUUID=" + jsonObj.item.uuid
          );
        }
      }
    );
  } //if (item_uuid === null) {
  else {
    console.log("Will update object :>> ");
    new_item_request = collect_item_data();
    new_item_request.uuid = item_uuid;
    fetchURL = `${BASE_URL}item/` + item_uuid;
    // console.log("fetchURL :>> ", fetchURL);
    fetchJSON(
      fetchURL,
      {
        method: "PATCH",
        body: JSON.stringify(new_item_request),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
      (jsonObj) => {
        console.log("Have responce :>> ", jsonObj);
        if ((jsonObj.status = "success")) {
          console.log("Success patching objkect :>> ");
        }
      } //(jsonObj) => {
    ); //fetchJSON(
  } //else { //if (item_uuid === null) {
} //function send_data(save_new_item) {
