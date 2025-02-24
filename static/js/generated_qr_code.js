var itemUUID = null;

window.onload = () => {
  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  itemUUID = urlParams.get("itemUUID");
  document
    .getElementById("qrcode_img")
    .setAttribute("src", `../item-qr-code/${itemUUID}.png`);
};
