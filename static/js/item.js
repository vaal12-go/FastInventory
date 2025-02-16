window.onload = () => {
  console.log("Hello :>> ");

  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  const itemUUID = urlParams.get("itemUUID");

  console.log("itemUUID :>> ", itemUUID);
  if (itemUUID === null) {
    console.log("It is null :>> Creating new item");
  } else {
    console.log("Editing item :>> ");
    document.getElementById("form_title").innerHTML = "Edit item";
    populateFieldsWithItem(itemUUID);
  }

  $("#tags_select2_selector").select2({
    tags: true,
  });

  document
    .getElementById("new_item_submit_btn")
    .addEventListener("click", () => {
      console.log("Butt pressed :>> ");
      new_item_request = {
        name: document.getElementById("item_name_input").value,
        description: document.getElementById("item_description_textarea").value,
        container_uuid: null,
      };

      selected_tags = $("#tags_select2_selector").select2("data");
      console.log("selected_tags :>> ", selected_tags);

      console.log("new_item_request :>> ", new_item_request);

      fetchURL = `${window.location.origin}/item/`;
      console.log("fetchURL :>> ", fetchURL);
      fetchJSON(
        fetchURL,
        {
          method: "POST",
          body: JSON.stringify(new_item_request),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        },
        (jsonObj) => {
          console.log("Have responce :>> ", jsonObj);
          if ((jsonObj.status = "success")) {
            window.location.replace(
              window.location.toLocaleString() +
                "?itemUUID=" +
                jsonObj.item.uuid
            );
          }
        }
      );
    });
};

function populateFieldsWithItem(itemUUID) {
  fetchURL = `${window.location.origin}/item/${itemUUID}`;
  console.log("fetchURL :>> ");
  fetchJSON(
    fetchURL,
    {
      method: "GET",
      // body: JSON.stringify(new_item_request),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
    (jsonObj) => {
      console.log("Have item responce :>> ", jsonObj);
      document.getElementById("item_name_input").value = jsonObj.name;
      document.getElementById("item_description_textarea").value =
        jsonObj.description;
    }
  );
} //function getItemByUUID(itemUUID) {
