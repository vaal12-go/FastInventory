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

    img = qrcode.make(cnt.uuid)
    # type(img)  # qrcode.image.pil.PilImage
    qr_code_width, qr_code_height = img.size

    bigImgWidth = 600 if (qr_code_width + 100) < 500 else (qr_code_width + 100)
    biggerImg = Image.new("RGBA", (bigImgWidth,
                          qr_code_height+50), color=(255, 255, 255, 255))
    widthMargin = (bigImgWidth-qr_code_width)//2
    biggerImg.paste(img.convert("RGBA"), box=(
        widthMargin, 20, qr_code_width+widthMargin, qr_code_height+20))

    draw = ImageDraw.Draw(biggerImg)

    font = ImageFont.truetype(r'C:\Users\System-Pc\Desktop\arial.ttf', 30)

    textLen = draw.textlength(str(cnt.uuid), font=font)
    textMargin = (bigImgWidth-textLen)//2
    draw.text((textMargin, qr_code_height+5),
              str(cnt.uuid), fill="black", font=font)
    print(f"Image dimensions:{biggerImg.size}")

    biggerImg.show()

    biggerImg.save("container_UUID.png")

    for i in range(10):
        itm = Item(
            name=f"Name#{i}", description=f"description #{i}",
            container_uuid=cnt.uuid
        )
        # print(itm)
        session.add(itm)
    # print(f"Session:{session}")
    session.commit()
