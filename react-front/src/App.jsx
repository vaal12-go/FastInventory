import { useState } from 'react'
import './App.css'



import { InventoryItems } from './components/index/InventoryItems'

function App() {
  

  return (
    <>
      <InventoryItems />

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
                            
                            {/* <!-- ITEMS BE HERE --> */}
                            {/* <!-- ITEMS start --> */}

                            {/* <!-- ITEM --> */}
                            <div className="card inventory-card me-1 mb-1">
                                <h6 className="card-header"><a href="#">Title</a></h6>
                                <div className="card-body">
                                    <img src="img/toolbox.jpg" alt="" className="inventory-card-img border" />
                                    <p className="card-title inventory-card-title">
                                        Autoadded item description #Piggy Bank-Rear EndAutoadded item
                                        description #Piggy Bank-Rear EndAutoadded item description #Piggy Bank-Rear
                                        End</p>
                                    <div className="rounded-1 inventory-card-tag"> book</div>
                                    <div className="rounded-1 inventory-card-tag">test_auto_added_item</div>

                                    <p className="card-text inventory-card-body">
                                        UUID: <span
                                            className="inventory-card-uuid">2f584eb4-f864-4564-9e2c-c9e0bcd1d8f6</span>
                                    </p>

                                </div>
                            </div>
                            {/* <!-- ITEM END --> */}
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
} //function App() {

export default App
