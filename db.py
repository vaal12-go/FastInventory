from sqlmodel import SQLModel, create_engine, Session, select
from models.item import Item
import configuration
from models.item_tag_link import ItemTagLink
from models.file import SQLiteFile
from models.tag import Tag


db_engine = None


def init_db(echo=False):
    sqlite_url = f"sqlite:///{configuration.SQLITE_FILE_NAME}"

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
