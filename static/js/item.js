// Main interactivity file for item.html (creation and editing of items)

import { initUppy, initImageControls } from "./item.item_images.js";

window.onload = async () => {
  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  editItemUUID = urlParams.get("itemUUID");

  await initImageControls();

  document.getElementById("cancel_btn").addEventListener("click", () => {
    window.location.replace(window.location.origin);
  }); //document.getElementById("cancel_btn").addEventListener(

  document
    .getElementById("item_qr_code_generate_btn")
    .addEventListener("click", () => {
      window.open(
        window.location.origin +
          "/generated_qr_code.html?itemUUID=" +
          editItemUUID
      );
    });

  document.getElementById("item_delete_btn").addEventListener("click", () => {
    console.log("Delete button pressed :>> ");
    var fetchURL = `${window.location.origin}/item/${editItemUUID}`;
    // console.log("fetchURL :>> ", fetchURL);
    fetchJSON(
      fetchURL,
      {
        method: "DELETE",
        // body: JSON.stringify(new_item_request),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
      (jsonObj) => {
        console.log("Have responce :>> ", jsonObj);
        if (jsonObj.status == "success") {
          window.location.replace(window.location.origin);
        }
      }
    );
  }); //document.getElementById("item_delete_btn").addEventListener("click", () => {

  // console.log("itemUUID :>> ", editItemUUID);
  if (editItemUUID === null) {
    console.log("It is null :>> Creating new item");
    populateContainerSelect(null);
  } else {
    console.log("Editing item :>> ");
    document.getElementById("item_uuid").innerHTML = editItemUUID;
    swapClassesOnElement("created_item_buttons", "invisible", null);
    document.getElementById("form_title").innerHTML = "Edit item";
    populateFieldsWithItem(editItemUUID);
  }

  document
    .getElementById("new_item_submit_btn")
    .addEventListener("click", () => {
      console.log("Submit Butt pressed :>> ");
      send_data(editItemUUID);
    }); //addEventListener("click", () => {
}; //window.onload = () => {
