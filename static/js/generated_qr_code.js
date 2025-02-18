var itemUUID = null;

window.onload = () => {
  console.log("Hello :>> ");
  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  itemUUID = urlParams.get("itemUUID");
  console.log("itemUUID :>> ", itemUUID);
  document
    .getElementById("qrcode_img")
    .setAttribute("src", `../item-qr-code/${itemUUID}.png`);
};
