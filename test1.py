import qrcode
from PIL import Image, ImageFont, ImageDraw

import db
from models.item import Item
from sqlmodel import Field, Session


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
