import sys
import uuid
import datetime
from sqlmodel import Session, select, func, col, or_, and_
from typing import List, Optional, Any
from pydantic import BaseModel

from app import app
from models.tag import Tag, TagRec
from models.item import Item, ItemCreate
from models.file import SQLiteFile

import db

NO_TAG_UUID_NAME = "no_tag"


class ItemOut(BaseModel):
    uuid: uuid.UUID
    name: str
    description: str
    container_uuid: uuid.UUID | None = None
    tags: Optional[List[Tag]] = []
    files: Optional[List[SQLiteFile]] = []
    created_datetime: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


class ItemOutList(BaseModel):
    lst: List[ItemOut] = []

    class Config:
        from_attributes = True


@app.get("/item/containers")
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

MAX_ITEMS_PER_PAGE = 4


def split_search_term(search_term):
    print('item_handlers:72 search_term:>>', search_term)
    quotes_split = search_term.split('"')
    print('item_handlers:74 quotes_split:>>', quotes_split)
    i = 0
    ret_list = []
    while i < len(quotes_split):
        if i % 2 == 0:
            ret_list = ret_list + quotes_split[i].split(" ")
        else:
            ret_list.append(quotes_split[i])
        i += 1

    return [x for x in ret_list if x != ""]


def get_items_with_tags(session, page, tags, search_term: str | None = None):
    all_items = None
    print('item_handlers:74 search_term:>>', search_term)

    select_stmt = select(Item)
    tags_clause = (1 == 1)
    search_clause_name = (1 == 1)

    if tags == NO_TAG_UUID_NAME:
        tags_clause = (Item.search_tags_field == "")
        # all_items = session.exec(
        #     select(Item).where(
        #         Item.search_tags_field == ""
        #     ).
        #     order_by(Item.created_datetime.desc())
        # ).all()

    clausesList = []

    tags_split = tags.split(";")

    for tag in tags_split:
        if tag == NO_TAG_UUID_NAME:
            clausesList.append((Item.search_tags_field == ""))
        else:
            clausesList.append(
                col(Item.search_tags_field).contains(tag)
            )
    tags_clause = or_(*clausesList)

    # else: #if tags == NO_TAG_UUID_NAME:

    if search_term is not None and search_term != "":
        search_clause_name = (1 == 0)
        split_search_list = split_search_term(search_term)
        print('item_handlers:82 split_search_list:>>', split_search_list)

        for term in split_search_list:
            print('item_handlers:84 term:>>', term)
            search_clause_name = or_(
                search_clause_name,
                func.lower(col(Item.name)).contains(term.lower())
            )

    # print('item_handlers:108 search_clause_name:>>', search_clause_name)
    print('item_handlers:131 tags_clause:>>', tags_clause)
    where_clause = and_(
        tags_clause,
        search_clause_name
    )

    select_stmt = select_stmt.where(
        where_clause
    )

    all_items = session.exec(
        select_stmt.
        order_by(Item.created_datetime.desc())
    ).all()

    print('item_handlers:122 all_items:>>', all_items)

    return all_items
# def get_items_with_tags(session, page, tags):


def get_all_items(session, page: int | None = 0,
                  tags: str | None = None, search_term: str | None = None):
    print('item_handlers:73 page:>>', page)
    print('item_handlers:74 tags:>>', tags)
    all_items = None
    no_of_items = -1
    no_of_pages = -1

    all_items = get_items_with_tags(session, page, tags, search_term)
    no_of_items = len(all_items)

    # print('item_handlers:173 all_items:>>', all_items)

    # if tags is not None and tags != "":
    #     all_items = get_items_with_tags(session, page, tags, search_term)
    #     no_of_items = len(all_items)
    # else:  # This will just return all items (honoring page)
    #     print('item_handlers:107', 'Returning items only with page honored ')
    #     no_of_items = session.exec(
    #         select(func.count(col(Item.uuid)))
    #     ).one()

    #     if (page*MAX_ITEMS_PER_PAGE > no_of_items):
    #         return {
    #             "status": "error",
    #             "description": f"Page requested [{page}] is out of range"
    #         }

    #     all_items = session.exec(
    #         select(Item).offset(page*MAX_ITEMS_PER_PAGE).
    #         limit(MAX_ITEMS_PER_PAGE).
    #         order_by(Item.created_datetime.desc())
    #     ).all()

    no_of_pages = no_of_items // MAX_ITEMS_PER_PAGE
    if no_of_items % MAX_ITEMS_PER_PAGE != 0:
        no_of_pages += 1

    print('item_handlers:92 no_of_items:>>', no_of_items)
    print('item_handlers:97 MAX_ITEMS_PER_PAGE:>>',
          MAX_ITEMS_PER_PAGE)
    print('item_handlers:97 no_of_pages:>>', no_of_pages)
    for itm in all_items:
        print('item_handlers:113 itm:>>', itm)

    outList = ItemOutList.parse_obj({"lst": all_items})

    return {
        "status": "success",
        "items": outList.lst,
        "page": page,
        "total_items": no_of_items,
        "total_pages": no_of_pages
    }
# def get_all_items(session, page: int | None = 0, tags: str | None = None):


@app.get("/item/{item_uuid}")
def item_get_handler(item_uuid: str, page: int | None = 0,
                     tags: str | None = None, search_term: str | None = None):
    with Session(db.db_engine) as session:
        requested_uuid = None
        try:
            requested_uuid = uuid.UUID(item_uuid)
        except:
            print(f"item_uuid:{item_uuid} supplied is not valid uuid")
        if requested_uuid is not None:
            ret = session.get(Item, requested_uuid)
            itmOut = ItemOut.parse_obj(ret)
            return itmOut
        else:
            if item_uuid == "all":
                print("Will return all items")
                print('item_handlers:85 tags:>>', tags)
                print('item_handlers:191 search_term:>>', search_term)
                res = get_all_items(session, page, tags, search_term)
                # print('item_handlers:153 res:>>', res)
                return res

        return {
            "item_uuid": item_uuid,
            "item_uuid_type": str(type(item_uuid))
        }
# END def item_get_handler(item_uuid: str):


@app.patch("/item/{item_uuid}")
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


@app.delete("/item/{item_uuid}")
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


@app.post("/item/")
async def new_item_handler(newItem: ItemCreate):
    print(f"Have item:{newItem}")
    with Session(db.db_engine) as session:
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
# END async def new_item_handler(newItem: ItemCreate):
