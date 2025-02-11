from sqlmodel import Field, SQLModel, create_engine
import uuid as uuid_lib


class Item(SQLModel, table=True):
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)
    name: str
    description: str = ""
    container_id: uuid_lib.UUID | None = Field(
        default=None, foreign_key="item.uuid")
