import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TagSelect } from '../components/index/TagSelect';
import { getFilterParams, InventoryItems } from '../components/index/InventoryItems'
import { ItemTextFilter } from '../components/index/ItemTextFilter';
import { Pagination } from '../components/index/Pagination';
import { BASE_API_URL ,setBaseAPIURL } from '../lib/constants';


export function IndexPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const debugParam = searchParams.get("debug")
  useEffect(() => {
    if (debugParam) {
      // BASE_API_URL = "http://127.0.0.1:8080"
      setBaseAPIURL("http://127.0.0.1:8080")
      // setSearchParams((params) => {
      //   params.set("debug", "false")
      //   return params
      // });
    } else {//if (debugParam) {
      // BASE_API_URL = window.location.origin;
      setBaseAPIURL(window.location.origin)
    }
    console.log('BASE_API_URL :>> ', BASE_API_URL);
  }, []);

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
          <div className="col-10  mt-3">
            <div className="container-fluid">
              <InventoryItems />
              {/* <!-- Pagination --> */}
              <div className="row">
                <div className="col-3 fs-6">
                  {/* Pagination may not work properly in this update */}
                </div>
                <div className="col-9 fs-4" id="pagination-holder">
                  <Pagination total_pages={5} />
                </div>
              </div>
              {/* <!-- END Pagination --> */}
            </div>
          </div>
          {/* <!-- END Items main section --> */}
        </div>
      </div>
      {/* <!-- END Main page container --> */}

    </>
  )
}