window.onload = () => {
  console.log("Hello :>> ");

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
        container_uuids: "none now",
      };

      selected_tags = $("#tags_select2_selector").select2("data");
      console.log("selected_tags :>> ", selected_tags);

      console.log("new_item_request :>> ", new_item_request);

      fetchURL = `${window.location.origin}/item`;
      console.log("fetchURL :>> ");
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
        }
      );
    });
};
