from sqlmodel import SQLModel, create_engine, Session, select

from ..models.item import Item
from .configuration import SQLITE_FILE_NAME
from ..models.item_tag_link import ItemTagLink
from ..models.file import SQLiteFile
from ..models.tag import Tag


db_engine = None


def init_db(db_f_name=SQLITE_FILE_NAME, echo=False):
    sqlite_url = f"sqlite:///{db_f_name}"
    print(f"sqliteURL:{sqlite_url}")

    global db_engine
    # TODO: add dev/prod .env variable and make echo depend on those
    db_engine = create_engine(sqlite_url, echo=echo)
    SQLModel.metadata.create_all(db_engine)

    with Session(db_engine) as session:
        containerTag = session.exec(
            select(Tag).where(Tag.tag == "container")
        ).first()
        if containerTag is None:
            containerTag = Tag(tag="container",
                               description="Automatically created description for 'container' tag.")
            session.add(containerTag)
            session.commit()

    return db_engine
