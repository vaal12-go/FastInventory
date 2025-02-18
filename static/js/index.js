// Main interactivity file for index.html root page of the application

itemListTemplate = `
    <div class="row border">
      <div class="row">
        <h5>{{name}}</h5>
        <a href="/item.html?itemUUID={{uuid}}">Edit</a>
      </div>
      <div class="row">
        <div class="col-10">
          {{uuid}} | | {{description}} | {{#container_uuid}}
          Container:{{container_uuid}} | {{/container_uuid}} {{#tags}} >>
          {{tag}} {{/tags}}
        </div>
        <div class="col-2"></div>
      </div>
    </div>
`;

window.onload = () => {
  fetchURL = `${window.location.origin}/item/all`;
  fetchJSON(
    fetchURL,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
    (jsonObj) => {
      itemsHTML = "";
      for (itemIdx in jsonObj) {
        item = jsonObj[itemIdx];
        renderRes = Mustache.render(itemListTemplate, item);
        itemsHTML += renderRes;
      }
      document.getElementById("items_placeholder").innerHTML = itemsHTML;
    } //(jsonObj) => {
  ); //fetchJSON(
}; //window.onload = () => {
