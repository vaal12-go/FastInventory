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
  console.log("Hello :>> ");

  fetchURL = `${window.location.origin}/item/all`;
  console.log("fetchURL :>> ");
  fetchJSON(
    fetchURL,
    {
      method: "GET",
      //   body: JSON.stringify(new_item_request),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
    (jsonObj) => {
      console.log("Have responce :>> ", jsonObj);
      itemsHTML = "";
      for (itemIdx in jsonObj) {
        item = jsonObj[itemIdx];
        console.log("item :>> ", item);
        renderRes = Mustache.render(itemListTemplate, item);
        console.log("renderRes :>> ", renderRes);
        itemsHTML += renderRes;
      }
      document.getElementById("items_placeholder").innerHTML = itemsHTML;
    }
  );
}; //window.onload = () => {
