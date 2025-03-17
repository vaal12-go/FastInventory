function highlight_string(
  str2highlight,
  positions_arr,
  highlight_start = '<span style="background:yellow;">',
  highlight_end = "</span>"
) {
  if (str2highlight.trim().length == 0) return str2highlight;

  reduced_positions = reduce_arrays(positions_arr);
  // console_debug("array_reducer:8 reduced_positions::", reduced_positions);

  str_pieces_arr = reduced_positions.reduce((accum, currVal, currIdx, arr) => {
    if (currIdx == 0 && currVal[0] > 0) {
      accum.push(str2highlight.substring(0, currVal[0]));
    }

    if (currIdx > 0) {
      prevVal = arr[currIdx - 1];
      inter_str = str2highlight.substring(prevVal[1], currVal[0]);
      accum.push(inter_str);
    }
    subLine = str2highlight.substring(currVal[0], currVal[1]);
    accum.push(`<span style="background:yellow;">${subLine}</span>`);
    if (currIdx == arr.length - 1 && currVal[1] < item.name.length) {
      accum.push(str2highlight.substring(currVal[1]));
    }
    return accum;
  }, []); //reduced_positions.reduce((accum, currVal, currIdx, arr) => {
  return str_pieces_arr.join("");
} //function highlight_string(str2highlight, positions_arr,

function reduce_arrays(arr_of_segments) {
  sorted_arr = arr_of_segments.sort((a, b) => {
    if (a[0] > b[0]) return 1;
    return a[1] < b[1] ? -1 : 1;
  });

  idx2Skip = -1;
  let reduced_arr = sorted_arr.reduce(
    (accum, currVal, currIdx, arr) => {
      if (currIdx <= idx2Skip) return accum;
      nextIdx = currIdx + 1;
      while (nextIdx < arr.length) {
        nextVal = arr[nextIdx];
        if (currVal[1] < nextVal[0]) {
          accum.push(currVal);
          return accum;
        } else {
          // Some kind of intersection exists
          if (currVal[1] < nextVal[1]) {
            currVal[1] = nextVal[1];
          }
          if (nextVal[0] < currVal[0]) {
            currVal[0] = nextVal[0];
          }
        }
        idx2Skip = nextIdx;
        nextIdx++;
      }
      accum.push(currVal);
      return accum;
    }, //(accum, currVal, currIdx, arr)=>{
    []
  );
  // console_debug("array_reducer:13 reduced_arr::", reduced_arr);
  return reduced_arr;
} //function reduce_arrays(arr_of_segments) {
