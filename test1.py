import db
from models.item import Item
from sqlmodel import Field, Session


def test_populate_db():
    session = Session(db.db_engine)

    cnt = Item(name=f"Container item", description=f"This is first container")
    session.add(cnt)
    session.commit()
    print(f"Container itemID:{cnt.uuid}")

    for i in range(10):
        itm = Item(
            name=f"Name#{i}", description=f"description #{i}",
            container_id=cnt.uuid
        )

        print(itm)
        session.add(itm)
    print(f"Session:{session}")
    session.commit()
