import uuid
from typing import Final

from sqlmodel import Session, select, func, col, or_, and_

from db import db

from models.item import Item
from models.item_out import ItemOutList

from .main_router import main_router

NO_TAG_UUID_NAME:Final = "no_tag"
DEFAULT_ITEMS_PER_PAGE:Final = 4

@main_router.get("/item/{item_uuid}")
def item_get_handler(item_uuid: str, 
                    page: int | None = 0,
                    items_on_page: int | None = DEFAULT_ITEMS_PER_PAGE,
                    tags: str | None = None, search_term: str | None = None):
    # print(f"item_uuid:{item_uuid}")
    print(f"tags:{tags}")
                    
    with Session(db.db_engine) as session:
        requested_uuid = None
        try:
            requested_uuid = uuid.UUID(item_uuid)
        except:
            if item_uuid != "all":
                print(f"item_uuid:{item_uuid} supplied is not valid uuid")
                raise HTTPException(status_code=404, 
                    detail=f"'{item_uuid}' is not a valid item uuid")

                
        
        if item_uuid == "all":
            print("Will return all items")
                # print(f"items_on_page:{items_on_page}")
            res = get_all_items(session, page-1, items_on_page, tags, search_term)
            
            print(f"type of res.items:{type(res["items"])}")
            print(f"len of res.items:{len(res["items"])}")
            # print(f"res:{len(list(res.items))}")
            # print(f"returning items #:{len(res.items)}")
            return res
        else:
            # Here requested_uuid is valid UUID
            ret = session.get(Item, requested_uuid)
            itmOut = ItemOut.parse_obj(ret)
            # TODO: add return of error if item is not found
            return itmOut

        # return {
        #     "item_uuid": item_uuid,
        #     "item_uuid_type": str(type(item_uuid))
        # }
# END def item_get_handler(item_uuid: str):

# def get_items_with_tags(session = None, page: int | None = 1, 
#             items_on_page: int | None = DEFAULT_ITEMS_PER_PAGE,
#             tags: str | None = None, search_term: str | None = None):
    
#     return all_items
# # def get_items_with_tags(session, page, tags):



# TODO: when 2 tags are selected - no items are returned - probably AND operator is used
    # To think if this is what we want or if we wait to make this OR
def get_all_items(session, page: int | None = 0,
                  items_on_page: int | None = DEFAULT_ITEMS_PER_PAGE, 
                  tags: str | None = None, 
                  search_term: str | None = None):
    all_items = None
    no_of_items = -1
    no_of_pages = -1

    
    select_stmt = select(Item)
    tags_clause = (1 == 1)
    search_clause_name = (1 == 1)

    # PROCESS TAGs clauses
    if tags == NO_TAG_UUID_NAME:
        tags_clause = (Item.search_tags_field == "")
    clausesList = [False]
    if tags != None:
        tags_split = tags.split(";")
        for tag in tags_split:
            if tag == NO_TAG_UUID_NAME:
                clausesList.append((Item.search_tags_field == ""))
            else:
                clausesList.append(
                    col(Item.search_tags_field).contains(tag)
                )
    tags_clause = or_(*clausesList)

    # PARSE and PROCESS search_term clauses
    if search_term is not None and search_term != "":
        search_clause_name = (1 == 0)
        split_search_list = split_search_term(search_term)

        for term in split_search_list:
            search_clause_name = or_(
                search_clause_name,
                func.lower(col(Item.name)).contains(term.lower())
            )

    if tags !=None :
        where_clause = and_(
            tags_clause,
            search_clause_name
        )
    else:
        where_clause = search_clause_name

    select_stmt = select_stmt.where(
        where_clause
    )

    # Example how to see statment print("Statement:", select_stmt.compile())
    # print('item_handlers:134 select_stmt:>>', select_stmt)

    all_items = session.exec(
        select_stmt.
        order_by(Item.created_datetime.desc()).
        limit(items_on_page)
    ).all()

    # all_items = get_items_with_tags(session, page, 
    #         items_on_page,tags, search_term)
    no_of_items = 5 #TEST!!

    no_of_pages = no_of_items // DEFAULT_ITEMS_PER_PAGE
    if no_of_items % DEFAULT_ITEMS_PER_PAGE != 0:
        no_of_pages += 1

    outList = ItemOutList.parse_obj({"lst": all_items})

    print(f"type of outList.lst:{type(outList.lst)}")

    # test_list = list(outList.lst)
    # print(f"test_list:{type(test_list)}")

    return {
        "status": "success",
        "items": outList.lst,
        "page": page+1,
        "total_items": no_of_items,
        "total_pages": no_of_pages
    }
# def get_all_items(session, page: int | None = 0, tags: str | None = None):