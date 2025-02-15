import uuid
from sqlmodel import Session, select

import db
from models.item import Item


def item_get_handler(item_uuid: str):
    print(f"Have itemUUID:{item_uuid}")
    requested_uuid = None
    try:
        requested_uuid = uuid.UUID(item_uuid)
    except:
        print(f"item_uuid:{item_uuid} supplied is not valid uuid")
    if requested_uuid is not None:
        print("Will return single item")
    else:
        if item_uuid == "all":
            print("Will return all items")
            session = Session(db.db_engine)
            all_items = session.exec(
                select(Item)
            ).all()
            return all_items

    return {
        "item_uuid": item_uuid,
        "item_uuid_type": str(type(item_uuid))
    }
