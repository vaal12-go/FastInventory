import {
  Uppy,
  Dashboard,
  XHRUpload,
  Webcam, //To check if webcam module may be useful
  // } from "https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs";
} from "./uppy_4.13.2.min.mjs";

export async function initImageControls() {
  console.log("editItemUUID :>> ", editItemUUID);
  if (editItemUUID === null) {
    // This is new item. No image
  } else {
    // This is editing item - load images
    console.log("Editing item image init :>> ");
    hideDivElement("new-item-image-message");
    showDivElement("image_gallery");
    await initUppy();
  }
}

export async function initUppy() {
  var slider = $("#vertical").lightSlider({
    gallery: true,
    item: 1,
    vertical: true,
    verticalHeight: 300,
    adaptiveHeight: true,
    adaptiveWidth: true,
    vThumbWidth: 50,
    thumbItem: 7,
    thumbMargin: 4,
    slideMargin: 0,
    onAfterSlide: function (el) {
      console.log("onAfterSlide :>> ", el);
      console.log("getCurrentSlideCount :>> ", el.getCurrentSlideCount());
    },
  });
  //   console.log("slider :>> ", slider);

  document.getElementById("vertical").innerHTML += `<li
                        data-thumb="/img/Rocket_small_24Feb2025.png"
                      >
                        <img  width="300px"
                          src="/img/Rocket_small_24Feb2025.png"
                        />
                      </li>`;
  // slider.refresh();
  slider.destroy();

  var slider = $("#vertical").lightSlider({
    gallery: true,
    item: 1,
    vertical: true,
    verticalHeight: 300,
    adaptiveHeight: true,
    adaptiveWidth: true,
    vThumbWidth: 50,
    thumbItem: 8,
    thumbMargin: 4,
    slideMargin: 0,
    onAfterSlide: function (el) {
      console.log("onAfterSlide :>> ", el);
    },
  });

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
          var responce = result.successful[0].response.body;
          var file_created = responce.file_created;
          console.log("file_created :>> ", file_created);
          if (responce.status == "success") {
            document
              .getElementById("item_preview_img")
              .setAttribute("src", `item_file/${file_created.uuid}`);
          }
        }); //uppy.upload().then((result) => {
      } //if (uppy.getFiles().length == 1) {
    }); //.addEventListener("click", async () => {
} //async function initUppy() {
