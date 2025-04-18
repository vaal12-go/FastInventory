import { useSearchParams } from 'react-router-dom';

import { InventoryItems } from '../components/index/InventoryItems'
import { useEffect } from 'react';

export function IndexPage() {

    const [searchParams, setSearchParams] = useSearchParams()

  console.log('searchParams :>> ', searchParams);

    const debugParam = searchParams.get("debug")
    console.log('debugParam  :>> ', debugParam );

    useEffect(()=>{
        if(debugParam) {
            setSearchParams((params)=>{
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

            <div className="row">
              <div className="col">
                <div className="rounded-1 tag-selected">Book</div>
                <div className="rounded-1 tag-selected">Pen</div>

              </div>
            </div>

            <div className="row">
              <div className="col">
                <div id="tags-holder" className="mt-1 ms-2 tags-holder"></div>
              </div>
            </div>



            <div className="row mb-1">
              <div className="col">
                <div id="tags-search-div">
                  <input type="text" className="form-control" id="tag_search_input"
                    placeholder="Search tags" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="rounded-1 tag-unselected">USB</div>
                <div className="rounded-1 tag-unselected">Cable</div>
                <div className="rounded-1 tag-unselected">Display</div>

              </div>
            </div>

          </div>
        </div>
        {/* <!-- END TAGS left section --> */}

        {/* <!-- Items main section --> */}
        <div className="col-10  mt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-2">
                <h3>List of items</h3>
              </div>
              <div className="col-6">
                <input type="text" className="form-control" id="item_search_input" placeholder="Search items" />
              </div>
            </div>

            {/* <!-- Filters and selections --> */}
            <div className="row pe-4 mb-3">
              {/* <!-- TODO: add selection checkboxes to items, 'select all' checkbox and delete button for mass deletion of items --> */}
              {/* <!-- <div className="col-1"><span className="align-middle">[x] all</span></div> --> */}
              <div className="col-4">

              </div>
              {/* <!-- <div className="col border">filter/selection gadgets</div> --> */}
            </div>
            {/* <!-- END Filters and selections --> */}

            {/* <!-- Items --> */}
            <div className="row">
              <div className="col">
                {/* <!-- ITEMS start --> */}
                <InventoryItems />

                {/* <!-- ITEMS END --> */}

              </div>
            </div>
            {/* <!-- END Items --> */}

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