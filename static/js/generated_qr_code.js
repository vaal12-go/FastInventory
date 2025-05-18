var itemUUID = null;

window.onload = async () => {

  await initGlobalState();
  console.log('BASE_URL :>> ', BASE_URL);
  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  var itemUUID = urlParams.get("itemUUID");
  var img_url = `${BASE_URL}item-qr-code/${itemUUID}.png`;
  document.getElementById("qrcode_img").setAttribute("src", img_url);
};
