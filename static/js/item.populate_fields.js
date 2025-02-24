function populateTags() {
  // console.log("Tag populate started :>> ");
  // if (serverItemJsonToEdit != null) {
  //   console.log("serverItemJsonToEdit :>> ", serverItemJsonToEdit);
  // }

  var fetchURL = `${window.location.origin}/tag`;
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
      // console.log("Have tag responce :>> ", jsonObj);
      opt_array = [];
      for (tagIdx in jsonObj.tags) {
        tag = jsonObj.tags[tagIdx];
        // console.log("tag.uuid :>> ", tag.uuid);

        slctd = false;
        if (serverItemJsonToEdit != null) {
          for (tagIdx in serverItemJsonToEdit.tags) {
            if (serverItemJsonToEdit.tags[tagIdx].uuid == tag.uuid) {
              slctd = true;
              break;
            }
          }
        }

        newOpt = {
          id: tag.uuid,
          text: tag.tag,
          selected: slctd,
        };
        opt_array.push(newOpt);
      }
      // console.log("opt_array :>> ", opt_array);
      $("#tags_select2_selector").select2({
        tags: true,
        data: opt_array,
      });
    } //(jsonObj) => {
  ); //fetchJSON(
} //function populateTags(itemUUID) {

function populateFieldsWithItem(itemUUID) {
  // console.log("itemUUID :>> ", itemUUID);
  new ItemGetter(itemUUID).then((jsonObj) => {
    // console.log("Have item responce :>> ", jsonObj);
    document.getElementById("item_name_input").value = jsonObj.name;
    document.getElementById("item_description_textarea").value =
      jsonObj.description;
    serverItemJsonToEdit = jsonObj;
    populateContainerSelect(jsonObj.container_uuid);
  });
} //function getItemByUUID(itemUUID) {

function populateContainerSelect(selectedContainerUUID) {
  var fetchURL = `${window.location.origin}/item/containers`;
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
      // console.log("Have containers :>> ", jsonObj);
      noContainerSelected = selectedContainerUUID === null ? true : false;
      // console.log("noContainerSelected :>> ", noContainerSelected);
      addOptionToSelect(
        "container_select",
        "Select container from the list",
        -1,
        noContainerSelected
      );
      // console.log("selectedContainerUUID :>> ", selectedContainerUUID);

      for (contIdx in jsonObj.items) {
        container = jsonObj.items[contIdx];
        // console.log("container :>> ", container);
        selected = false;
        if (
          selectedContainerUUID != null &&
          selectedContainerUUID == container.uuid
        ) {
          selected = true;
        }
        // console.log("selected :>> ", selected);
        if (
          serverItemJsonToEdit === null ||
          serverItemJsonToEdit.uuid != container.uuid
        ) {
          //This is needed so this item cannot be selected as container of itself
          addOptionToSelect(
            "container_select",
            container.name,
            container.uuid,
            selected
          );
        }
      }
      populateTags();
    } //(jsonObj) => {
  ); //fetchJSON(
} //function populateContainerSelect(selectedContainerUUID) {
