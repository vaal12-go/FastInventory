import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TagSelect } from '../components/index/TagSelect';
import { InventoryItems } from '../components/index/InventoryItems'
import { ItemTextFilter } from '../components/index/ItemTextFilter';


export function IndexPage() {

  const [searchParams, setSearchParams] = useSearchParams()

  // console.log('searchParams :>> ', searchParams);

  const debugParam = searchParams.get("debug")
  // console.log('debugParam  :>> ', debugParam);

  useEffect(() => {
    if (debugParam) {
      setSearchParams((params) => {
        params.set("debug", "false")
        return params
      });
    };
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
              {/* <div className="row">
              <div className="col">
                <div id="tags-holder" className="mt-1 ms-2 tags-holder"></div>
              </div>
            </div> */}
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
                  Pagination may not work properly in this update
                </div>
                <div className="col-9 fs-4" id="pagination-holder">
                  &#x226A; 1 2 ... | 3 | <span className="fs-2 fw-bold">4</span> | 5 |
                  ... 6 7 &#x226B;
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