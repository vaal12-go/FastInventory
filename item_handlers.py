import sys
import uuid
from sqlmodel import Session, select
from typing import List, Optional, Any
from pydantic import BaseModel

from app import app
from models.tag import Tag
from models.item import Item
import db


class ItemOut(BaseModel):
    uuid: uuid.UUID
    name: str
    description: str
    container_uuid: uuid.UUID | None = None
    # tags: Optional[List[Tag]]
    tags: Optional[List[Tag]] = []

    class Config:
        from_attributes = True


class ItemOutList(BaseModel):
    lst: List[ItemOut] = []

    class Config:
        from_attributes = True


@app.get("/item/containers")
async def containers_list_handler():
    print("print at last")
    session = Session(db.db_engine)
    container_tag = session.exec(
        select(Tag).where(Tag.tag == "container")
    ).first()
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
        itmOut = ItemOut.parse_obj(ret)
        print('item_handlers.py: itmOut=', itmOut)
        return itmOut
    else:
        if item_uuid == "all":
            print("Will return all items")

            # item1 = session.get(Item, uuid.UUID(
            #     "55a25add-be08-49c2-b98b-ad4c6d14315b"))

            # return item1

            # print(f"item1:{item1}")

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
