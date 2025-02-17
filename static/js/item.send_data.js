function send_data(item_uuid) {
  console.log("Send data started :>> ");
  if (item_uuid === null) {
    new_item_request = {
      // uuid: item_uuid,
      name: document.getElementById("item_name_input").value,
      description: document.getElementById("item_description_textarea").value,
      container_uuid: null,
    };

    selected_tags = $("#tags_select2_selector").select2("data");
    console.log("selected_tags :>> ", selected_tags);

    console.log("new_item_request :>> ", new_item_request);

    fetchURL = `${window.location.origin}/item/`;
    console.log("fetchURL :>> ", fetchURL);
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
    new_item_request = {
      uuid: item_uuid,
      name: document.getElementById("item_name_input").value,
      description: document.getElementById("item_description_textarea").value,
      container_uuid: null,
    };
    console.log("updated_item_request :>> ", new_item_request);
  } //else { //if (item_uuid === null) {
} //function send_data(save_new_item) {
