import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { TagSelect } from "../components/index/TagSelect";
import { InventoryItems } from "../components/index/InventoryItems";
import { BASE_API_URL, setBaseAPIURL } from "../lib/constants";
import useCookieConfig from "../hooks/useCookieConfig";

export function IndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [configValue] = useCookieConfig("api_url")
  // const [baseAPIURLInternal, setBaseAPIURLInternal] = useState('');

  // const debugParam = searchParams.get("debug");

  // console.log('configValue :>> ', configValue);
  // console.log('BASE_API_URL :>> ', BASE_API_URL);

  return (
    <>
      {/* <!-- Main page container --> */}
      <div className="container-fluid text-center ps-3 pe-3">
        <div className="row text-start">
          {/* <!-- TAGS left section --> */}
          <div className="col-2">
            <div className="container border-end mt-3">
              <div className="row">
                <div className="col">
                  <h3>Tags</h3>
                </div>
              </div>
              <TagSelect></TagSelect>
            </div>
          </div>
          {/* <!-- END TAGS left section --> */}

          {/* <!-- Items main section --> */}
          <div className="col-10 mt-3">
            <div className="container-fluid text-center" id="items-container">
              <InventoryItems />
            </div>
          </div>
          {/* <!-- END Items main section --> */}
        </div>
      </div>
      {/* <!-- END Main page container --> */}
    </>
  );
}
