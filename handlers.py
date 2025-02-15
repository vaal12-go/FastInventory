import uuid
from sqlmodel import Session, select, text

import db
from models.item import Item
from models.tag import Tag

from sqlalchemy.orm import joinedload

from typing import List, Optional, Any

from pydantic import BaseModel, computed_field


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


# class ItemWithTags(Item):
#     @computed_field
#     @property
#     def slug(self) -> Any:
#         return self.tags


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

            # item1 = session.get(Item, uuid.UUID(
            #     "55a25add-be08-49c2-b98b-ad4c6d14315b"))

            # return item1

            # print(f"item1:{item1}")

            all_items = session.exec(
                select(Item)
            ).all()

            outList = ItemOutList.parse_obj({"lst": all_items})
            print(f"outList:{outList}")

            # print(f"all_items:{all_items}")
            # print(f"all_items:{list(all_items)}")

            ret_itms = []
            for itm in all_items:
                pass
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
            return outList

    return {
        "item_uuid": item_uuid,
        "item_uuid_type": str(type(item_uuid))
    }
