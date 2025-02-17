import qrcode
from PIL import Image, ImageFont, ImageDraw

import db
from models.item import Item
from models.tag import Tag
from sqlmodel import Field, Session, select

import uuid


def testDB2():
    session = Session(db.db_engine)

    contItem = session.get(Item, uuid.UUID(
        "55a25addbe0849c2b98bad4c6d14315b"))

    tg = Tag(tag="test tag2", description="descr2")
    try:
        session.add(tg)
        session.commit()
    except Exception as e:
        print(f"DB Exception:{e}")
        return

    cnt = Item(name=f"Test item 1", description=f"To be placed in container")
    cnt.container_uuid = contItem.uuid
    cnt.tags.append(tg)
    session.add(cnt)
    session.commit()
    print(f"Container itemID:{cnt.uuid}")

    itm = session.exec(
        select(Item).where(Item.uuid == uuid.UUID(
            "55a25addbe0849c2b98bad4c6d14315b"))
    ).first()

    print(f"itm:{itm}")
    print(f"itm.tags:{itm.tags}")


def test_populate_db():
    session = Session(db.db_engine)

    cnt = Item(name=f"Container item", description=f"This is first container")
    session.add(cnt)
    session.commit()
    print(f"Container itemID:{cnt.uuid}")

    for i in range(10):
        itm = Item(
            name=f"Name#{i}", description=f"description #{i}",
            container_uuid=cnt.uuid
        )
        # print(itm)
        session.add(itm)
    # print(f"Session:{session}")
    session.commit()
