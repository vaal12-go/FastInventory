function reduce_arrays(arr_of_segments) {
  sorted_arr = arr_of_segments.sort((a, b) => {
    return a[1] < b[1] ? -1 : 1;
  });

  console_debug("array_reducer:6 sorted_arr::", sorted_arr);
  // arr_of_segments.reduce(
  //   (accum, currVal, currIdx, arr) => {
  //     while(currIdx<arr.length) {

  //     }
  //   }, //(accum, currVal, currIdx, arr)=>{
  //   []
  // );
} //function reduce_arrays(arr_of_segments) {

function reduce_two_arrays(arr1, arr2) {
  //   console_debug("array_reducer:2 arr1::", arr1);
  //   console_debug("array_reducer:3 arr2::", arr2);
  //shuffle arrays, so arr1[1]<=arr2[1]
  // This will remove a lot of duplicating logic in checks below
  if (arr1[1] > arr2[1]) {
    // console_debug("rearranging arrays");
    [arr2, arr1] = [arr1, arr2];
    // console_debug("array_reducer:2 arr1::", arr1);
    // console_debug("array_reducer:3 arr2::", arr2);
  }

  if (arr1[1] < arr2[0]) {
    // Non-overlapping arrays, returning both
    return {
      result: "non-overlapping arrays",
      arr1: arr1,
      arr2: arr2,
    };
  }

  if (arr1[0] >= arr2[0] && arr1[1] <= arr2[1]) {
    // arr2 encircles or equal to arr1
    return {
      result: "one array encircle or equal to other",
      arr1: arr2,
    };
  } else {
    // arr2 is continuation of arr1
    return {
      result: "one array is a continuation of the other",
      arr1: [arr1[0], arr2[1]],
    };
  }
} //function reduce_two_arrays(arr1, arr2) {

function reduce_array_actual(array_of_overlapping_arrays) {
  res = array_of_overlapping_arrays.reduce((accum, currVal, idx, array) => {
    // console_debug("array_reducer:28 idx::", idx);
    // console_debug("array_reducer:7 currVal::", currVal);

    currIdx = 0;
    currArray = currVal;
    //First will check accumulated arrays if they have been reduced with this
    while (currIdx < idx) {
      //   console_debug("array_reducer:46 currIdx::", currIdx);
      res = reduce_two_arrays(currVal, array[currIdx]);
      //   console_debug("array_reducer:48 BEFORE VALUES res::", res);
      switch (res.result) {
        case "non-overlapping arrays":
          // will do nothing - other array already in accum, this one will be added to accum
          break;
        case "one array encircle or equal to other":
          accum.splice(currIdx, 1);
          currArray = res.arr1;
          break;
        case "one array is a continuation of the other":
          accum.splice(currIdx, 1);
          currArray = res.arr1;
          break;
      }
      currIdx++;
    }

    //Second will reduce everything after this idx
    if (idx == array.length - 1) {
      //Last element - nothing to reduceanymore
      accum.push(currArray);
      return accum;
    }

    currIdx = idx + 1;
    //   currArray = currVal;
    while (currIdx < array.length) {
      //   console_debug("array_reducer:46 currIdx::", currIdx);
      res = reduce_two_arrays(currArray, array[currIdx]);
      //   console_debug("array_reducer:48 AFTER VALUES res::", res);
      switch (res.result) {
        case "non-overlapping arrays":
          // will do nothing - will be handled later when this non-overlapping array is being analyzed
          break;
        case "one array encircle or equal to other":
          currArray = res.arr1;
          break;
        case "one array is a continuation of the other":
          currArray = res.arr1;
          break;
      }

      currIdx++;
    }
    accum.push(currArray);
    // console_debug("array_reducer:93 accum::", accum);
    return accum;
  }, []); //reduced_arr = array_of_overlapping_arrays.reduce(
  return res;
}

function reduce_overlapping_arrays(array_of_overlapping_arrays) {
  console_debug("array_reducer:2 INITIAL array::", array_of_overlapping_arrays);

  currArr = array_of_overlapping_arrays;
  //   currLen = currArr.length;
  prevLen = currArr.length + 1;
  while (currArr.length < prevLen) {
    prevLen = currArr.length;
    currArr = reduce_array_actual(currArr);
    // break;
  }
  //   console_debug("array_reducer:109 currArr AFTER BREAK::", currArr);

  return currArr;
} //function reduce_overlapping_arrays(array_of_overlapping_arrays) {
