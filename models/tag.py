from sqlmodel import Field, SQLModel, Relationship, create_engine
import uuid as uuid_lib

from models.item_tag_link import ItemTagLink


class Tag(SQLModel, table=True):
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)
    tag: str
    description: str = ""

    items: list["Item"] = Relationship(
        back_populates="tags", link_model=ItemTagLink,
        sa_relationship_kwargs=dict(lazy="selectin"))
