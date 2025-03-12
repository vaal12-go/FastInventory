import datetime
from sqlmodel import Field, SQLModel, Relationship, create_engine, TIMESTAMP
import uuid as uuid_lib
from typing import Optional
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func

from models.item_tag_link import ItemTagLink

from models.tag import TagRec

from pydantic import BaseModel, computed_field
from typing import List

# Great many to many ORM\SQLmodel explanation
# https://stackoverflow.com/questions/74273829/how-to-correctly-use-joins-with-sqlmodel


class ItemBase(SQLModel):
    name: str
    description: str = ""
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

    # Working from here: https://github.com/fastapi/sqlmodel/issues/370#issuecomment-1169665476
    created_datetime: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=False), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=False),
                         onupdate=func.now(), server_default=func.now())
    )
    # updated_datetime: Optional[datetime] = Field(sa_column=Column(
    #     TIMESTAMP(timezone=False),
    #     nullable=False,
    #     # server_default=text("CURRENT_TIMESTAMP"),
    #     # server_onupdate=text("CURRENT_TIMESTAMP"),
    # ))
