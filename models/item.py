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


class TagRec(BaseModel):
    tag: str
    uuid: str


class ItemCreate(ItemBase):
    tags_uuids: List[TagRec] = []
    pass


class Item(ItemBase, table=True):
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)
    # name: str
    # description: str = ""

    tags: list["Tag"] = Relationship(
        back_populates="items",
        link_model=ItemTagLink)

    # class Config:
    #     arbitrary_types_allowed = True

    # tags = relationship("Tag", secondary="itemtaglink", back_populates='items')
