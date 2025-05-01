

export function fileIsImage(fName) {
    let last_dot_idx = fName.lastIndexOf(".");
    let fExt = fName.substring(last_dot_idx + 1);
    let imgExtArray = ["png", "jpg", "jpeg"];
    if (imgExtArray.includes(fExt.toLowerCase())) return true;
    else return false;
}

export function findImageFileOfItem(item) {
    for (let fileIdx in item.files) {
      let fileRec = item.files[fileIdx];
      if (fileIsImage(fileRec.name)) return fileRec;
    }
    return null;
  }