from sqlmodel import SQLModel, create_engine
from models.item import Item
from models.container import Container
from models.file import SQLiteFile


db_engine = "qwe2"


def init_db():
    sqlite_file_name = "database.sqlite3"
    sqlite_url = f"sqlite:///{sqlite_file_name}"

    global db_engine
    db_engine = create_engine(sqlite_url, echo=True)
    print(f"db_engine in INIT:{db_engine}")
    SQLModel.metadata.create_all(db_engine)
    return db_engine
