from fastapi import File, UploadFile
from fastapi.staticfiles import StaticFiles
import uuid
from sqlmodel import Session, select, text

import db
from models.item import Item, ItemCreate, TagRec
from models.tag import Tag

from sqlalchemy.orm import joinedload


from pydantic import BaseModel, computed_field

from app import app
import helpers
from typing import Annotated, List

import logging


import traceback


@app.get("/tag")
async def tag_list_handler():
    session = Session(db.db_engine)
    ret = session.exec(
        select(Tag)
    ).all()
    print('handlers.py: ret=', ret)
    return {
        "status": "success",
        "tags": ret
    }


@app.post("/upload_picture")
# async def upload_picture_handler(file_uploaded: Annotated[bytes, File()]):
async def upload_picture_handler(file_uploaded: UploadFile):
    print('have picture upload')
    try:
        print("have picture upload")
        # print(f"file len:{len(file)}")
        # print(f"filename {file.filename}")
        print(f'have picture upload:{type(file_uploaded)}')
        print(f'have picture upload:{file_uploaded.filename}')
        fUploadedSave = open(f"uploaded.{file_uploaded.filename}", "wb")
        fUploadedSave.write(file_uploaded.file.read())
        fUploadedSave.close()
    except Exception as e:
        print(f"Have exception:{e}")
        print(f"Have exception:{e}")
    return {
        "error": "Not implemented4"
    }


@app.get("/upload_picture")
def up_test():
    print("Logger is working")
    # logger.info('have picture upload2')
    print("Have get handler working")
    return {
        "error": "Not implemented3"
    }


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
