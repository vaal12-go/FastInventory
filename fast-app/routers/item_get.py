import uuid
from typing import Final


from sqlmodel import Session, select, func, col, or_, and_
from fastapi import HTTPException

from db import db

from models.item import Item
from models.item_out import ItemOut

from .main_router import main_router

DEFAULT_ITEMS_PER_PAGE: Final = 4


@main_router.get("/item/{item_uuid}")
def item_get_handler(
    item_uuid: str = "all",
    page: int | None = 1,
    items_on_page: int | None = DEFAULT_ITEMS_PER_PAGE,
    tags: str | None = "",
    search_term: str | None = "",
):

    with Session(db.db_engine) as session:
        requested_uuid = None
        try:
            requested_uuid = uuid.UUID(item_uuid)
        except:
            if item_uuid != "all":
                raise HTTPException(
                    status_code=404, detail=f"'{item_uuid}' is not a valid item uuid"
                )

        if item_uuid == "all":
            # print("Will return all items")
            # TODO: add order_by parameter
            item_filters = {
                "page": page - 1,
                "items_on_page": items_on_page,
                "tags": tags,
                "search_term": search_term,
            }
            res = get_all_items(session, item_filters)
            res["status"] = "success"
            res["page"] = page
            return res
        else:
            # Here requested_uuid is valid UUID
            ret = session.get(Item, requested_uuid)
            if ret == None:
                raise HTTPException(
                    status_code=404, detail=f"Item with uuid:'{item_uuid}' was not found"
                )
            itmOut = ItemOut.parse_obj(ret)
            return itmOut
# END def item_get_handler(...


# TODO: when 2 tags are selected - no items are returned - probably AND operator is used
# To think if this is what we want or if we wait to make this OR
def get_all_items(session, item_filters):
    all_items = None

    # TODO: add correct no_of_items calculation from DB (without any limit)
    no_of_items = -1
    no_of_pages = -1

    select_stmt = select(Item)
    tags_clause = 1 == 1
    search_clause_name = 1 == 1

    # PROCESS TAGs clauses
    clausesList = [False]
    #         tags_clause = (Item.search_tags_field == "")

    # TODO: test with tags
    if item_filters["tags"] != "":
        tags_split = item_filters["tags"].split(",")
        for tag in tags_split:
            clausesList.append(col(Item.search_tags_field).contains(tag))
    tags_clause = or_(*clausesList)

    # TODO: test with search_term_clauses
    # PARSE and PROCESS search_term clauses
    if item_filters["search_term"] is not None and item_filters["search_term"] != "":
        search_clause_name = 1 == 0
        split_search_list = split_search_term(item_filters["search_term"])

        for term in split_search_list:
            search_clause_name = or_(
                search_clause_name, func.lower(col(Item.name)).contains(term.lower())
            )

    if item_filters["tags"] != "":
        where_clause = and_(tags_clause, search_clause_name)
    else:
        where_clause = search_clause_name

    select_stmt = select_stmt.where(where_clause)

    # Example how to see statment print("Statement:", select_stmt.compile())
    # print('item_handlers:134 select_stmt:>>', select_stmt)

    itm_offset = item_filters["items_on_page"] * item_filters["page"]


    count_select = select(func.count(Item.uuid)).where(where_clause)
    no_of_items = session.scalar(
        count_select
    )

    # print(f"no_of_items:{no_of_items}")

    all_items = session.exec(
        select_stmt.order_by(Item.created_datetime.desc())
        .offset(itm_offset)
        .limit(item_filters["items_on_page"])
    ).all()

    no_of_pages = no_of_items // DEFAULT_ITEMS_PER_PAGE
    if no_of_items % DEFAULT_ITEMS_PER_PAGE != 0:
        no_of_pages += 1

    # print(f"all_items:{all_items}")
    print(f"type of all_items:{type(all_items)}")

    outList = list(map(lambda itm: ItemOut.parse_obj(itm), all_items))
    print(f"len of outList:{len(outList)}")

    return {
        "items": outList,
        "total_items": no_of_items,
        "total_pages": no_of_pages,
    }
# def get_all_items(session, item_filters):


# TEST URL: http://127.0.0.1:8080/item/all?items_on_page=4&page=2
