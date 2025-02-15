from sqlmodel import Field, SQLModel, Relationship, create_engine
import uuid as uuid_lib

from models.item_tag_link import ItemTagLink

from pydantic import computed_field

# Great many to many ORM\SQLmodel explanation
# https://stackoverflow.com/questions/74273829/how-to-correctly-use-joins-with-sqlmodel


class Item(SQLModel, table=True):
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)
    name: str
    description: str = ""

    container_uuid: uuid_lib.UUID | None = Field(
        default=None, foreign_key="item.uuid")

    tags: list["Tag"] = Relationship(
        back_populates="items",
        link_model=ItemTagLink)

    # class Config:
    #     arbitrary_types_allowed = True

    # tags = relationship("Tag", secondary="itemtaglink", back_populates='items')
