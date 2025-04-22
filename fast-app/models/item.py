from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, create_engine, TIMESTAMP
import uuid as uuid_lib
from typing import Optional
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
from pydantic import BaseModel, computed_field
from typing import List


from .item_tag_link import ItemTagLink
from .tag import TagRec



# Great many to many ORM\SQLmodel explanation
# https://stackoverflow.com/questions/74273829/how-to-correctly-use-joins-with-sqlmodel


class ItemBase(SQLModel):
    name: str
    description: str | None = ""
    container_uuid: uuid_lib.UUID | None = Field(
        default=None, foreign_key="item.uuid")


# Class which is needed for fastapi validation for creation and modification of an Item
class ItemCreate(ItemBase):
    tags_uuids: List[TagRec] = []
    pass


# Main class which is used for data storage in DB
class Item(ItemBase, table=True):
    class Config:
        arbitrary_types_allowed = True

    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)

    tags: list["Tag"] = Relationship(
        back_populates="items",
        link_model=ItemTagLink)

    files: list["SQLiteFile"] = Relationship(back_populates="item")

    search_tags_field: str | None = None

    # Working from here: https://github.com/fastapi/sqlmodel/issues/370#issuecomment-1169665476
    created_datetime: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=False), server_default=func.now())
    )
    # TODO: https://github.com/fastapi/sqlmodel/issues/52#issuecomment-1311987732
    # To avoid the error:
    # _generate_schema.py:502: UserWarning: <module 'datetime' from 'C:\\Users\\may13\\AGVDocs\\Dev\\1. DevTools\\5.Python\\python\\Lib\\datetime.py'> is not a Python type (it may be an instance of an object), Pydantic will allow any object with no validation since we cannot even enforce that the input is an instance of the given type. To get rid of this error wrap the type with `pydantic.SkipValidation`.

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=False),
                         onupdate=func.now(), server_default=func.now())
    )

    def update_search_tags_field(self):
        search_field = ""
        for tag in self.tags:
            search_field = search_field + f"{tag.uuid};"
        print('item:65 search_field:>>', search_field)
        self.search_tags_field = search_field
