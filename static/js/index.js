window.onload = () => {
  console.log("Hello :>> ");

  fetchURL = `${window.location.origin}/item/all`;
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
}; //window.onload = () => {
