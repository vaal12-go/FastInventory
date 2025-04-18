# This is a link table for Item and Tag model

from sqlmodel import Field, SQLModel, Relationship, Session, SQLModel
import uuid as uuid_lib


class ItemTagLink(SQLModel, table=True):
    item_uuid: uuid_lib.UUID = Field(
        default=None, foreign_key="item.uuid", primary_key=True)
    tag_uuid: uuid_lib.UUID = Field(
        default=None, foreign_key="tag.uuid", primary_key=True)
