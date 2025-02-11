from sqlmodel import Field, SQLModel, LargeBinary, Column
import uuid as uuid_lib

from models.item import Item

# SQLAlchemy
# https://stackoverflow.com/questions/1779701/example-using-blob-in-sqlalchemy
# SQLModel
# https://github.com/fastapi/sqlmodel/discussions/609#discussioncomment-11361961


class SQLiteFile(SQLModel, table=True):
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)
    name: str
    description: str
    content_bytes: bytes = Field(sa_column=Column(LargeBinary))

    item_uuid: uuid_lib.UUID | None = Field(
        default=None, foreign_key="item.uuid")
