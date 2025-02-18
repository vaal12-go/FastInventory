function populateTags() {
  console.log("Tag populate started :>> ");
  console.log("serverItemJsonToEdit :>> ", serverItemJsonToEdit);
  var fetchURL = `${window.location.origin}/tag`;
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
      console.log("Have tag responce :>> ", jsonObj);
      opt_array = [];
      for (tagIdx in jsonObj.tags) {
        tag = jsonObj.tags[tagIdx];

        slctd = false;
        for (tagIdx in serverItemJsonToEdit.tags) {
          if (serverItemJsonToEdit.tags[tagIdx].uuid == tag.uuid) {
            slctd = true;
            break;
          }
        }

        newOpt = {
          id: tag.uuid,
          text: tag.tag,
          selected: slctd,
        };
        opt_array.push(newOpt);
      }
      console.log("opt_array :>> ", opt_array);
      $("#tags_select2_selector").select2({
        tags: true,
        data: opt_array,
      });
    } //(jsonObj) => {
  ); //fetchJSON(
} //function populateTags(itemUUID) {

function populateFieldsWithItem(itemUUID) {
  console.log("itemUUID :>> ", itemUUID);
  var fetchURL = `${window.location.origin}/item/${itemUUID}`;
  // console.log("fetchURL :>> ");
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
      serverItemJsonToEdit = jsonObj;
      populateContainerSelect(jsonObj.container_uuid);
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
      console.log("selectedContainerUUID :>> ", selectedContainerUUID);

      for (contIdx in jsonObj.items) {
        container = jsonObj.items[contIdx];
        console.log("container :>> ", container);
        selected = false;
        if (
          selectedContainerUUID != null &&
          selectedContainerUUID == container.uuid
        ) {
          selected = true;
        }
        console.log("selected :>> ", selected);
        addOptionToSelect(
          "container_select",
          container.name,
          container.uuid,
          selected
        );
      }
      populateTags();
    } //(jsonObj) => {
  ); //fetchJSON(
} //function populateContainerSelect(selectedContainerUUID) {
