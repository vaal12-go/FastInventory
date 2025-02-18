// Main interactivity file for index.html root page of the application

itemListTemplate = `
    <div>
    {{uuid}} | {{name}} |
    {{description}} | <br>
    {{#container_uuid}}
    Container:{{container_uuid}} | 
    {{/container_uuid}}
    {{#tags}}
        >> {{tag}}
    {{/tags}}

    <a href="/item.html?itemUUID={{uuid}}">Edit<a>

    <br>--------------------------------
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
