// Main interactivity file for index.html root page of the application

itemListTemplate = `
    <div class="row border">
      <div class="row">
        <div class="col-1 justify-content-center text-center">
        {{#image_rec}}
            <img src="http://127.0.0.1:8080/item_file/{{image_rec.uuid}}" width="100" height="100">
        {{/image_rec}}
        {{^image_rec}}
          <img src="http://127.0.0.1:8080/img/no-photo-svgrepo-com.svg" width="50" height="50">
        {{/image_rec}}
          
        </div>  
        <div class="col-10">
          <h5>{{item.name}}</h5>
          <a href="./item.html?itemUUID={{item.uuid}}">Edit</a>
        </div>  
      </div>
      
      <div class="row">
        <div class="col-10">
          {{item.uuid}} | | {{item.description}} | {{#item.container_uuid}}
          Container:{{item.container_uuid}} | {{/item.container_uuid}} {{#item.tags}} >>
          {{item.tag}} {{/item.tags}}
        </div>
        <div class="col-2"></div>
      </div>
    </div>
`;

function fileIsImage(fName) {
  let last_dot_idx = fName.lastIndexOf(".");
  let fExt = fName.substring(last_dot_idx + 1);
  console.log("fExt :>> ", fExt);
  let imgExtArray = ["png", "jpg", "jpeg"];
  if (imgExtArray.includes(fExt)) return true;
  else return false;
}

function findImageFileOfItem(item) {
  console.log("item :>> ", item);
  for (let fileIdx in item.files) {
    let fileRec = item.files[fileIdx];
    console.log("file :>> ", fileRec);
    if (fileIsImage(fileRec.name)) return fileRec;
  }
  return null;
}

window.onload = () => {
  fetchURL = `${BASE_URL}item/all`;
  console.log("fetchURL :>> ", fetchURL);
  fetchJSON(
    fetchURL,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
    (jsonObj) => {
      console.log("jsonObj :>> ", jsonObj);
      itemsHTML = "";
      for (itemIdx in jsonObj) {
        item = jsonObj[itemIdx];
        let imageFileRec = findImageFileOfItem(item);
        console.log("imageFileRec :>> ", imageFileRec);
        renderRes = Mustache.render(itemListTemplate, {
          item: item,
          image_rec: imageFileRec,
        });
        itemsHTML += renderRes;
      }
      document.getElementById("items_placeholder").innerHTML = itemsHTML;
    } //(jsonObj) => {
  ); //fetchJSON(
}; //window.onload = () => {
