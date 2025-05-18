import {useState, useEffect} from 'react'

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
//   console.log("ca :>> ", ca);
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    // console.log('c :>> ', c);
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
    //   console.log('c.substring(name.length, c.length); :>> ', c.substring(name.length, c.length));
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default function useCookieConfig(cookieName) {
    const [configValue, setCookieVal] = useState(getCookie(cookieName));
    useEffect(()=>{
        setCookieVal(getCookie(cookieName))
    }, [])

    return [configValue]
}
