from sqlmodel import Field, SQLModel, Relationship, create_engine
import uuid as uuid_lib

from sqlalchemy import UniqueConstraint
from pydantic import BaseModel

from .item_tag_link import ItemTagLink


class Tag(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("tag"),)
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)
    tag: str
    description: str = ""

    items: list["Item"] = Relationship(
        back_populates="tags", link_model=ItemTagLink
    )

# This is needed for transmission of tags between item creation page and fastapi backend


class TagRec(BaseModel):
    tag: str
    uuid: str
