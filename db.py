from sqlmodel import SQLModel, create_engine
from models.item import Item
from models.file import SQLiteFile
from models.tag import Tag
from models.item_tag_link import ItemTagLink


import config


db_engine = None


def init_db():
    sqlite_url = f"sqlite:///{config.SQLITE_FILE_NAME}"

    global db_engine
    # TODO: add dev/prod .env variable and make echo depend on those
    db_engine = create_engine(sqlite_url, echo=True)
    SQLModel.metadata.create_all(db_engine)
    return db_engine
