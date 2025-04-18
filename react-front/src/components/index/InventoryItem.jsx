

export function InventoryItem({ item }) {
    return (
        <div>
            {/* <!-- ITEM --> */}
            <div className="card inventory-card me-1 mb-1">
                <h6 className="card-header"><a href="#">{item.name}</a></h6>
                <div className="card-body">
                    <img src="img/toolbox.jpg" alt="" className="inventory-card-img border" />
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