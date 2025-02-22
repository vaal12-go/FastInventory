from sqlmodel import Field, SQLModel, Relationship, create_engine
import uuid as uuid_lib

from models.item_tag_link import ItemTagLink

from pydantic import BaseModel, computed_field
from typing import List

# Great many to many ORM\SQLmodel explanation
# https://stackoverflow.com/questions/74273829/how-to-correctly-use-joins-with-sqlmodel


class ItemBase(SQLModel):
    name: str
    description: str = ""
    container_uuid: uuid_lib.UUID | None = Field(
        default=None, foreign_key="item.uuid")


# This is needed for transmission of tags between item creation page and fastapi backend
class TagRec(BaseModel):
    tag: str
    uuid: str


# Class which is needed for fastapi validation for creation and modification of an Item
class ItemCreate(ItemBase):
    tags_uuids: List[TagRec] = []
    pass


# Main class which is used for data storage in DB
class Item(ItemBase, table=True):
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)

    tags: list["Tag"] = Relationship(
        back_populates="items",
        link_model=ItemTagLink)

    files: list["SQLiteFile"] = Relationship(back_populates="item")
