// import {
//   Uppy,
//   DragDrop,
//   Dashboard,
//   XHRUpload,
//   // ScreenCapture,
//   // Webcam,
// } from "./uppy_4.13.2.min.mjs";

import {
  Uppy,
  DragDrop,
  Dashboard,
  XHRUpload,
  Webcam,
  Tus,
} from "https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs";

var editItemUUID = null;

window.onload = () => {
  console.log("Creating uppy :>> ");
  const uppy = new Uppy({
    debug: true,
  }).use(Dashboard, {
    target: "#uppy_file_upload_element",
    inline: true,
  });
  // uppy.use(DragDrop, {
  //   target: "#uppy_file_upload_element",
  //   inline: true,
  //   // hideUploadButton: false,
  //   // singleFileFullScreen: true,
  //   // hideRetryButton: false,
  // });
  console.log("Uppy created :>> ", uppy);
  uppy.use(XHRUpload, {
    endpoint: "../upload_picture",
    method: "POST",
    fieldName: "file_uploaded",
    bundle: true,
  });

  document.getElementById("cancel_btn").addEventListener("click", () => {
    window.location.replace(window.location.origin);
  }); //document.getElementById("cancel_btn").addEventListener(

  document
    .getElementById("item_qr_code_generate_btn")
    .addEventListener("click", () => {
      console.log("generate code button pressed :>> ");
      uppy.upload();

      // window.open(
      //   window.location.origin +
      //     "/generated_qr_code.html?itemUUID=" +
      //     editItemUUID
      // );
    });

  document.getElementById("item_delete_btn").addEventListener("click", () => {
    console.log("Delete button pressed :>> ");
    console.log("editItemUUID :>> ", editItemUUID);
    fetchURL = `${window.location.origin}/item/${editItemUUID}`;
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

  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  editItemUUID = urlParams.get("itemUUID");

  console.log("itemUUID :>> ", editItemUUID);
  if (editItemUUID === null) {
    console.log("It is null :>> Creating new item");
  } else {
    console.log("Editing item :>> ");
    document.getElementById("item_uuid").innerHTML = editItemUUID;
    swapClassesOnElement("created_item_buttons", "invisible", null);
    document.getElementById("form_title").innerHTML = "Edit item";
    populateFieldsWithItem(editItemUUID);
  }

  $("#tags_select2_selector").select2({
    tags: true,
  });

  document
    .getElementById("new_item_submit_btn")
    .addEventListener("click", () => {
      console.log("Butt pressed :>> ");
      new_item_request = {
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
              window.location.toLocaleString() +
                "?itemUUID=" +
                jsonObj.item.uuid
            );
          }
        }
      );
    });
};

function populateFieldsWithItem(itemUUID) {
  var fetchURL = `${window.location.origin}/item/${itemUUID}`;
  console.log("fetchURL :>> ");
  fetchJSON(
    fetchURL,
    {
      method: "GET",
      // body: JSON.stringify(new_item_request),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
    (jsonObj) => {
      console.log("Have item responce :>> ", jsonObj);
      document.getElementById("item_name_input").value = jsonObj.name;
      document.getElementById("item_description_textarea").value =
        jsonObj.description;
    }
  );
} //function getItemByUUID(itemUUID) {
