import {BASE_API_URL} from "../../lib/constants.js"
import { findImageFileOfItem } from "../../lib/utils.js"

export function InventoryItem({ item }) {
    if(!item.image_file) {
        item.image_file = findImageFileOfItem(item)
    }


    return (
        <div>
            {/* <!-- ITEM --> */}
            <div className="card inventory-card me-1 mb-1">
                <h6 className="card-header">
                    <a href={`${BASE_API_URL}/html/item.html?itemUUID=${item.uuid}`}>
                        {item.name}
                    </a>
                </h6>
                <div className="card-body">
                    {/* TODO: make default 'not existing' image not a toolbox, but one in /static directory */}
                    <img src={
                            item.image_file ?  
                                `${BASE_API_URL}/item_file/${item.image_file.uuid}` : "img/toolbox.jpg"
                            } 
                            alt="" 
                            className="inventory-card-img border" />
                    <p className="card-title inventory-card-title">
                        {item.description}</p>
                    <div className="rounded-1 inventory-card-tag"> book</div>
                    <div className="rounded-1 inventory-card-tag">test_auto_added_item</div>

                    <p className="card-text inventory-card-body">
                        UUID: <span
                            className="inventory-card-uuid">{item.uuid}</span>
                    </p>

                </div>
            </div>
            {/* <!-- ITEM END --> */}
        </div>
    )
}