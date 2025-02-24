import {
  Uppy,
  Dashboard,
  XHRUpload,
  Webcam, //To check if webcam module may be useful
  // } from "https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs";
} from "./uppy_4.13.2.min.mjs";

var gallery_slider = null;

export async function initImageControls() {
  document.getElementById("test-li").addEventListener("click", (evt, elem) => {
    console.log(" test-li evt :>> ", evt);
    console.log("elem :>> ", elem);
  });

  document.getElementById("test-img").addEventListener("click", (evt, elem) => {
    console.log(" test-img evt :>> ", evt);
    console.log("elem :>> ", elem);
  });

  document
    .getElementById("vertical")
    .addEventListener("dblclick", (evt, elem) => {
      console.log(" vertical evt :>> ", evt);
      console.log("elem :>> ", elem);
      console.log(
        "gallery_slider.getCurrentSlideCount() :>> ",
        gallery_slider.getCurrentSlideCount()
      );
      console.log(
        'evt.target.dataset["file-uuid"] :>> ',
        evt.target.dataset["file-uuid"]
      );
      console.log("evt.target.dataset :>> ", evt.target.dataset.fileUuid);
      window.open(BASE_URL + "img/clock.png");
    });

  console.log("editItemUUID :>> ", editItemUUID);
  if (editItemUUID === null) {
    // This is new item. No image
  } else {
    //if (editItemUUID === null) {
    // This is editing item - load images
    console.log("Editing item image init :>> ");
    hideDivElement("new-item-image-message");
    showDivElement("image_gallery");

    await updateImageGallery();
    await initUppy();
  } //} else {//if (editItemUUID === null) {
} //export async function initImageControls() {

async function updateImageGallery() {
  var itemJSON = await ItemGetter.getItem(editItemUUID);

  console.log("itemJSON2 :>> ", itemJSON);
  for (var fileIdx in itemJSON.files) {
    var file = itemJSON.files[fileIdx];
    console.log("file :>> ", file);
    addImageToGallery(file.uuid);
  }
  initSlider();

  //   new ItemGetter(editItemUUID).then(async (itemJSON) => {
  //     console.log("itemJSON :>> ", itemJSON);
  //     for (var fileIdx in itemJSON.files) {
  //       var file = itemJSON.files[fileIdx];
  //       console.log("file :>> ", file);
  //       addImageToGallery(file.uuid);
  //     }
  //     initSlider();
  //   }); //new ItemGetter(itemUUID).then((itemJSON)=>{
} //async function updateImageGallery() {

function initSlider() {
  gallery_slider = $("#vertical").lightSlider({
    gallery: true,
    item: 1,
    vertical: true,
    verticalHeight: 250,
    adaptiveHeight: true,
    adaptiveWidth: true,
    vThumbWidth: 70,
    thumbItem: 5,
    thumbMargin: 5,
    slideMargin: 0,
    onAfterSlide: function (el) {
      console.log("onAfterSlide :>> ", el);
      console.log("getCurrentSlideCount :>> ", el.getCurrentSlideCount());
    },
  });
}

function addImageToGallery(img_file_uuid) {
  document.getElementById("vertical").innerHTML += `
    <li data-thumb="/item_file/${img_file_uuid}">
        <img width="250px"
            src="/item_file/${img_file_uuid}"
        />
    </li>
    `;
} //function addImageToGallery(img_file_uuid) {

export async function initUppy() {
  //   console.log("slider :>> ", slider);

  // slider.refresh();
  //   slider.destroy();

  //   var slider = $("#vertical").lightSlider({
  //     gallery: true,
  //     item: 1,
  //     vertical: true,
  //     verticalHeight: 300,
  //     adaptiveHeight: true,
  //     adaptiveWidth: true,
  //     vThumbWidth: 50,
  //     thumbItem: 8,
  //     thumbMargin: 4,
  //     slideMargin: 0,
  //     onAfterSlide: function (el) {
  //       console.log("onAfterSlide :>> ", el);
  //     },
  //   });

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
            gallery_slider.destroy();
            addImageToGallery(file_created.uuid);
            console.log("1 :>> ");
            initSlider();
          }
        }); //uppy.upload().then((result) => {
      } //if (uppy.getFiles().length == 1) {
    }); //.addEventListener("click", async () => {
} //async function initUppy() {
