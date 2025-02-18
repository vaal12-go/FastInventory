from sqlmodel import SQLModel, create_engine
from models.item import Item
from models.file import SQLiteFile
from models.tag import Tag
from models.item_tag_link import ItemTagLink


db_engine = "qwe2"


def init_db():
    sqlite_file_name = "database.sqlite3"
    sqlite_url = f"sqlite:///{sqlite_file_name}"

    global db_engine
    # TODO: add dev/prod .env variable and make echo depend on those
    db_engine = create_engine(sqlite_url, echo=True)
    SQLModel.metadata.create_all(db_engine)
    return db_engine
