import sys
import uuid
import datetime

from fastapi import HTTPException

from sqlmodel import Session, select, func, col, or_, and_
from typing import List, Optional, Any
from pydantic import BaseModel

from .main_router import main_router
# from app import app
from models.tag import Tag, TagRec
from models.item import Item, ItemCreate
from models.file import SQLiteFile

from db import db






@main_router.get("/item/containers")
async def containers_list_handler():
    with Session(db.db_engine) as session:
        container_tag = session.exec(
            select(Tag).where(Tag.tag == "container")
        ).first()
        if container_tag == None:
            return {
                "status": "success",
                "items": []
            }
        containerTagUUID = container_tag.uuid
        # print(f"containerTagUUID:{containerTagUUID}")
        # print('item_handlers.py: containerTagUUID=', containerTagUUID)
        # print('item_handlers.py: type(containerTagUUID)=', type(containerTagUUID))

        stmt = select(Item). \
            join(Item.tags). \
            where(Tag.uuid == containerTagUUID)
        res = session.exec(stmt).all()

        outList = ItemOutList.parse_obj({"lst": res})

        return {
            "status": "success",
            "items": outList.lst
        }
# END async def containers_list_handler():




def split_search_term(search_term):
    # print('item_handlers:72 search_term:>>', search_term)
    quotes_split = search_term.split('"')
    # print('item_handlers:74 quotes_split:>>', quotes_split)
    i = 0
    ret_list = []
    while i < len(quotes_split):
        if i % 2 == 0:
            ret_list = ret_list + quotes_split[i].split(" ")
        else:
            ret_list.append(quotes_split[i])
        i += 1
    return [x for x in ret_list if x != ""]


@main_router.patch("/item/{item_uuid}")
async def patch_item_handler(item_uuid: uuid.UUID, item_changed: ItemCreate):
    print(f"patch request for item:{item_uuid}")
    print(f"Patched item:{item_changed}")
    with Session(db.db_engine) as session:
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
        item_to_patch.update_search_tags_field()
        session.add(item_to_patch)
        session.commit()

        # item_to_patch.name = session.commit()
        return {
            "status": "success",
            "item": item_to_patch
        }
# END async def patch_item_handler(item_uuid: uuid.UUID, item_changed: ItemCreate):


@main_router.delete("/item/{item_uuid}")
async def delete_item_handler(item_uuid: uuid.UUID):
    # TODO: when item-container is deleted set container in items which has it to null
    # HIGH: remove linked files and content of such files
    try:
        print(f"request to delete item {item_uuid} received")
        with Session(db.db_engine) as session:
            item_to_delete = session.get(Item, item_uuid)
            session.delete(item_to_delete)
            session.commit()
            return {
                "status": "success",
            }
    except Exception as e:
        print(f"Error in @app.delete(itemitem_uuid): {e}")
        print(traceback.format_exc())
# END async def delete_item_handler(item_uuid: uuid.UUID):


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
# END def synchronizeItemTags(session, item: Item, tags: List[TagRec]):


@main_router.post("/item/")
async def new_item_handler(newItem: ItemCreate):
    print(f"Have item:{newItem}")
    with Session(db.db_engine) as session:
        sqlItem = Item()
        sqlItem.name = newItem.name
        session.add(sqlItem)
        session.commit()

        # sqlItem = Item.model_validate(
        #     newItem
        # )
        sqlItem.copy(update=newItem.dict())
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
# END async def new_item_handler(newItem: ItemCreate):
