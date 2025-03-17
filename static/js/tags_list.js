window.onload = async () => {
  console.log("GLOBAL_STATE.BASE_URL :>> ", GLOBAL_STATE.BASE_URL);
  console_debug("Loaded", GLOBAL_STATE.BASE_URL);
  let tag_url = BASE_URL + "tag";
  //   console_debug("tags_list:5 tag_url:>>", tag_url);
  let tags_list = await fetchJSON2(tag_url, null);
  //   console_debug("tags_list:7 tags_list:>>", tags_list);
  console_debug("tags_list:8 tags_list.tags:>>", tags_list.tags);
  document.getElementById("tags_placeholder").innerHTML = render_obj_as_html(
    tags_list.tags
  );
};
