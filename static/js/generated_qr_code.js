var itemUUID = null;

window.onload = () => {
  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  var itemUUID = urlParams.get("itemUUID");
  // console.log("itemUUID :>> ", itemUUID);
  var img_url = `${BASE_URL}item-qr-code/${itemUUID}.png`;
  // console.log("img_url :>> ", img_url);
  document.getElementById("qrcode_img").setAttribute("src", img_url);
};
