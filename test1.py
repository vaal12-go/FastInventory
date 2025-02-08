import db
from models.item import Item
from sqlmodel import Field, Session


def test_populate_db():
    session = Session(db.db_engine)
    for i in range(10):
        itm = Item(name=f"Name#{i}", description=f"description #{i}")
        print(itm)
        session.add(itm)
    print(f"Session:{session}")
    session.commit()
