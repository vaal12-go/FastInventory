# This is an example model which can be used to store files.
# This will be used to store pictures and other files in sqlite database

from sqlmodel import Field, SQLModel, LargeBinary, Column, Relationship
import uuid as uuid_lib

from models.item import Item

# SQLAlchemy
# https://stackoverflow.com/questions/1779701/example-using-blob-in-sqlalchemy
# SQLModel
# https://github.com/fastapi/sqlmodel/discussions/609#discussioncomment-11361961


class SQLiteFile(SQLModel, table=True):
    uuid: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True)
    name: str = "SAMPLE_FILE_NAME"
    description: str = ""

    item_uuid: uuid_lib.UUID | None = Field(
        default=None, foreign_key="item.uuid")

    item: Item | None = Relationship(back_populates="files")


# In order to prevent file content appearing in queries by ORM (which retrieves all fields, esp. for connected modesl). Separate table just with file content (tied by SQLiteFile uuid to it's file) will be created. Table will not be connected to SQLiteFile, so all inserts/retrievals will be done by hand by backend.
class SQLiteFileContent(SQLModel, table=True):
    id: int = Field(primary_key=True)
    uuid: uuid_lib.UUID  # This will be the uuid of SQLiteFile, to which this content belongs to
    content_bytes: bytes = Field(sa_column=Column(LargeBinary))
