import sys
import uuid
from sqlmodel import Session, select
from typing import List, Optional, Any
from pydantic import BaseModel

from app import app
from models.tag import Tag, TagRec
from models.item import Item, ItemCreate
from models.file import SQLiteFile

import db


class ItemOut(BaseModel):
    uuid: uuid.UUID
    name: str
    description: str
    container_uuid: uuid.UUID | None = None
    tags: Optional[List[Tag]] = []
    files: Optional[List[SQLiteFile]] = []

    class Config:
        from_attributes = True


class ItemOutList(BaseModel):
    lst: List[ItemOut] = []

    class Config:
        from_attributes = True


@app.get("/item/containers")
async def containers_list_handler():
    session = Session(db.db_engine)
    container_tag = session.exec(
        select(Tag).where(Tag.tag == "container")
    ).first()
    if container_tag == None:
        return {
            "status": "success",
            "items": []
        }
    containerTagUUID = container_tag.uuid
    print(f"containerTagUUID:{containerTagUUID}")
    print('item_handlers.py: containerTagUUID=', containerTagUUID)
    print('item_handlers.py: type(containerTagUUID)=', type(containerTagUUID))

    stmt = select(Item). \
        join(Item.tags). \
        where(Tag.uuid == containerTagUUID)
    res = session.exec(stmt).all()

    outList = ItemOutList.parse_obj({"lst": res})

    return {
        "status": "success",
        "items": outList.lst
    }


@app.get("/item/{item_uuid}")
def item_get_handler(item_uuid: str):
    session = Session(db.db_engine)
    print(f"Have itemUUID:{item_uuid}")
    requested_uuid = None
    try:
        requested_uuid = uuid.UUID(item_uuid)
    except:
        print(f"item_uuid:{item_uuid} supplied is not valid uuid")
    if requested_uuid is not None:
        print("Will return single item")
        ret = session.get(Item, requested_uuid)
        print('item_handlers:69 ret.files:>>', ret.files)
        itmOut = ItemOut.parse_obj(ret)
        print('\n\nitem_handlers.py: itmOut=', itmOut)
        return itmOut
    else:
        if item_uuid == "all":
            print("Will return all items")

            all_items = session.exec(
                select(Item)
            ).all()

            outList = ItemOutList.parse_obj({"lst": all_items})
            # print(f"outList:{outList}")

            # print(f"all_items:{all_items}")
            # print(f"all_items:{list(all_items)}")

            # ret_itms = []
            # for itm in all_items:
            #     pass
            # print(f"itm supplied:{itm}")
            # print(f"itm.tags:{itm.tags}")
            # print(f"itm.model_dump():{itm.model_dump()}")

            # itm_out2 = ItemOut.from_orm(itm)
            # print(f"itm_out2:{itm_out2}")

            # # itm_out = ItemOut.model_validate(
            # #     itm.model_dump(), from_attributes=True)
            # # itm_out = itm.model_copy(update={"tags": itm.tags})
            # itm_out = ItemOut.model_validate(itm.model_dump())
            # print(f"itm_out before tags:{itm_out}")
            # itm_out.tags = itm.tags
            # # print(f"itm_out:{itm_out}")
            # ret_itms.append(itm_out)
            # # itm_tags = session.exec(
            # #     select(Tag, ItemTagLink).join(ItemTagLink.tag_uuid).where(ItemTagLink.itemuud == itm.uuid)
            # # ).all
            # # for tag in itm_tags:

            # print(f"all_items:{all_items}")
            # itms_list = []
            # for itm in all_items:
            #     print(f"itm:{itm}")
            #     print(f"itm tags:{itm.tags}")
            #     itms_list.append(itm)
            return outList.lst

    return {
        "item_uuid": item_uuid,
        "item_uuid_type": str(type(item_uuid))
    }
# END def item_get_handler(item_uuid: str):


@app.patch("/item/{item_uuid}")
async def patch_item_handler(item_uuid: uuid.UUID, item_changed: ItemCreate):
    print(f"patch request for item:{item_uuid}")
    print(f"Patched item:{item_changed}")
    session = Session(db.db_engine)
    item_to_patch = session.get(Item, item_uuid)
    item_to_patch.name = item_changed.name
    item_to_patch.description = item_changed.description
    item_to_patch.container_uuid = item_changed.container_uuid
    print('handlers.py: item_to_patch=', item_to_patch)

    session.add(item_to_patch)
    session.commit()

    print('handlers:83 item_to_patch BEFORE SYNC:>>', item_to_patch)
    synchronizeItemTags(session, item_to_patch, item_changed.tags_uuids)
    print('handlers:83 item_to_patch AFTER SYNC:>>', item_to_patch)

    # item_to_patch.name = session.commit()
    return {
        "status": "success",
        "item": item_to_patch
    }


@app.delete("/item/{item_uuid}")
async def delete_item_handler(item_uuid: uuid.UUID):
    # TODO: when item-container is deleted set container in items which has it to null
    try:
        print(f"request to delete item {item_uuid} received")
        session = Session(db.db_engine)
        item_to_delete = session.get(Item, item_uuid)
        session.delete(item_to_delete)
        session.commit()
        return {
            "status": "success",
        }
    except Exception as e:
        print(f"Error in @app.delete(itemitem_uuid): {e}")
        print(traceback.format_exc())


def synchronizeItemTags(session, item: Item, tags: List[TagRec]):
    print('handlers:107 item.tags before clear:>>', item.tags)
    item.tags.clear()
    session.add(item)
    session.commit()
    print('handlers:111 item.tags after clear:>>', item.tags)

    for tg in tags:
        print('handlers:112 tg:>>', tg)
        sql_tg = None
        if tg.tag == tg.uuid:
            print('handlers.py: "This is new tag=')
            sql_tg = Tag(tag=tg.tag, description="NA (automatically created)")
            session.add(sql_tg)
            session.commit()
        else:
            print('handlers.py: "This is old tag will add"=')
            sql_tg = session.get(Tag, uuid.UUID(tg.uuid))
        print('handlers.py: sql_tg=', sql_tg)
        item.tags.append(sql_tg)

    session.add(item)
    session.commit()
    print('handlers:129 item.tags after repopulate:>>', item.tags)


@app.post("/item/")
async def new_item_handler(newItem: ItemCreate):
    print(f"Have item:{newItem}")
    session = Session(db.db_engine)
    sqlItem = Item()
    sqlItem = Item.model_validate(
        newItem
    )
    print(f"SQItem after construct:{sqlItem}")
    newUUID = sqlItem.uuid
    session.add(sqlItem)
    session.commit()
    print(f"Item after saving:{sqlItem}")
    createdItem = session.exec(
        select(Item).where(Item.uuid == newUUID)
    ).first()
    print(f"createdItem:{createdItem}")

    synchronizeItemTags(session, createdItem, newItem.tags_uuids)

    return {
        "status": "success",
        "item": createdItem
    }
