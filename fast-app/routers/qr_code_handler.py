from sqlmodel import Session
import uuid
import qrcode
from PIL import Image, ImageFont, ImageDraw

import io
from fastapi.responses import StreamingResponse

from .main_router import main_router
# from app import app
import db
from models.item import Item


@main_router.get("/item-qr-code/{item_uuid}.png")
async def item_qr_code_handler(item_uuid: uuid.UUID):
    print(f"Have request for QR code for item:{item_uuid}")
    session = Session(db.db_engine)
    item = session.get(Item, item_uuid)

    img = qrcode.make(item_uuid)
    qr_code_width, qr_code_height = img.size

    bigImgWidth = 600 if (qr_code_width + 100) < 500 else (qr_code_width + 100)
    biggerImg = Image.new("RGBA", (bigImgWidth,
                          qr_code_height+50), color=(255, 255, 255, 255))
    widthMargin = (bigImgWidth-qr_code_width)//2
    biggerImg.paste(img.convert("RGBA"), box=(
        widthMargin, 40, qr_code_width+widthMargin, qr_code_height+40))
    draw = ImageDraw.Draw(biggerImg)
    font = ImageFont.truetype(r'font/MonospaceTypewriter.ttf', 22)
    textLen = draw.textlength(str(item_uuid), font=font)
    textMargin = (bigImgWidth-textLen)//2
    draw.text((textMargin, qr_code_height+15),
              str(item_uuid), fill="black", font=font)
    font = ImageFont.truetype(r'font/whitrabt.ttf', 30)
    draw.text((20, 10),
              item.name, fill="black", font=font)

    # biggerImg.show()
    # biggerImg.save(f"item_{item_uuid}_qrCode.png")

    # https://dnmtechs.com/how-to-send-pil-generated-image-to-browser-in-python-3/
    buffer = io.BytesIO()
    biggerImg.save(buffer, format='PNG')
    buffer.seek(0)

    # https://github.com/fastapi/fastapi/discussions/12983
    return StreamingResponse(
        buffer,
        media_type="image/png",
        # headers={"metadata": json.dumps(metadata)}
    )
# END async def item_qr_code_handler(item_uuid: uuid.UUID):
