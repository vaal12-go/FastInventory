function populateFieldsWithItem(itemUUID) {
  var fetchURL = `${window.location.origin}/item/${itemUUID}`;
  console.log("fetchURL :>> ");
  fetchJSON(
    fetchURL,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
    (jsonObj) => {
      console.log("Have item responce :>> ", jsonObj);
      document.getElementById("item_name_input").value = jsonObj.name;
      document.getElementById("item_description_textarea").value =
        jsonObj.description;
      populateContainerSelect(null);
    } //(jsonObj) => {
  ); //fetchJSON(
} //function getItemByUUID(itemUUID) {

function populateContainerSelect(selectedContainerUUID) {
  var fetchURL = `${window.location.origin}/item/containers`;
  console.log("fetchURL :>> ");
  fetchJSON(
    fetchURL,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
    (jsonObj) => {
      console.log("Have containers :>> ", jsonObj);
      noContainerSelected = selectedContainerUUID === null ? true : false;
      console.log("noContainerSelected :>> ", noContainerSelected);
      addOptionToSelect(
        "container_select",
        "Select container from the list",
        -1,
        noContainerSelected
      );
      for (contIdx in jsonObj.items) {
        container = jsonObj.items[contIdx];
        console.log("container :>> ", container);
        selected = false;
        if (
          selectedContainerUUID != null &&
          selectedContainerUUID.container_uuid == container.uuid
        ) {
          selected = true;
        }
        addOptionToSelect(
          "container_select",
          container.name,
          container.uuid,
          selected
        );
      }
      //   document.getElementById("item_name_input").value = jsonObj.name;
      //   document.getElementById("item_description_textarea").value =
      //     jsonObj.description;
    } //(jsonObj) => {
  ); //fetchJSON(
} //function populateContainerSelect(selectedContainerUUID) {
