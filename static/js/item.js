// Main interactivity file for item.html (creation and editing of items)

import {
  Uppy,
  Dashboard,
  XHRUpload,
  Webcam, //To check if webcam module may be useful
  // } from "https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs";
} from "./uppy_4.13.2.min.mjs";

window.onload = async () => {
  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  editItemUUID = urlParams.get("itemUUID");

  await initUppy();

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
    console.log("editItemUUID :>> ", editItemUUID);
    var fetchURL = `${window.location.origin}/item/${editItemUUID}`;
    console.log("fetchURL :>> ", fetchURL);
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

  console.log("itemUUID :>> ", editItemUUID);
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

async function initUppy() {
  const uppy = new Uppy({
    debug: true,
  }).use(Dashboard, {
    target: "#uppy_file_upload_element",
    singleFileFullScreen: true,
    inline: true,
    hideUploadButton: true,
    hideRetryButton: true,
  });
  uppy.use(XHRUpload, {
    endpoint: "../upload_item_file",
    method: "POST",
    fieldName: "file_uploaded",
    // bundle: true,
    formData: true,
  });

  document
    .getElementById("upload_pic_button")
    .addEventListener("click", async () => {
      console.log("Save pic clicked :>> ");
      if (uppy.getFiles().length == 1) {
        uppy.setMeta({
          uuid_str: editItemUUID,
        });
        console.log("There is a file to be uploaded :>> ");
        uppy.upload().then((result) => {
          console.log("Have upload result :>> ", result);
          if (result.failed.length > 0) {
            console.error("Errors:");
            result.failed.forEach((file) => {
              console.error(file.error);
            });
          }
          var file_created = result.successful[0].response.body;
          console.log("file_created :>> ", file_created);
        });
      }
    });
}
