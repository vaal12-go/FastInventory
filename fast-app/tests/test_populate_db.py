import os
import uuid
import random
import datetime

from dotenv import load_dotenv

from sqlmodel import Field, Session, select

# from models import Item
from models.item import Item
from models.tag import Tag
from models.file import SQLiteFile, SQLiteFileContent
import db
from db.db import init_db
from db import configuration

# DISK_BASE_PATH = r"c:\Users\may13\Desktop\Object photo disk"
DISK_BASE_PATH = '/home/mar25/raspberry_mount/TransferDirCommon/Object photo disk'
INFO_FNAME = DISK_BASE_PATH + r"/TEXTFILE/OBJECT06.TXT"
IMAGES_BASE_PATH = DISK_BASE_PATH+r"/PHOTOS/MED_RES"

TOTAL_NUM_OF_IMAGES = 120
NUM_OF_ITEMS_TO_ADD = 5

TAGS = [
    "container", "electronics", "materials", "usb cable", "HDMI cable",
    "cable", "Ethernet", "kitchen supplies", "medical supplies", "book",
    "test_auto_added_item"
]


def add_tags():
    with Session(db.db_engine) as session:
        for tag in TAGS:
            # print(f"Tag to add:{tag}")
            tag_in_db = session.exec(
                select(Tag).where(Tag.tag == tag)
            ).first()
            # print('test_populate_db:35 tag_in_db:>>', tag_in_db)
            if tag_in_db is None:
                new_tag = Tag(
                    tag=tag, description="test_populate added tag. Description.")
                session.add(new_tag)
                session.commit()


def internal_init_db(echo=True):
    load_dotenv()
    configuration.SQLITE_FILE_NAME = os.getenv(
        "SQLITE_FILE_NAME", configuration.SQLITE_FILE_NAME)
    print(f"configuration.SQLITE_FILE_NAME:{configuration.SQLITE_FILE_NAME}")
    db.db_engine = init_db(db_f_name= configuration.SQLITE_FILE_NAME, echo=echo)


def addImage(img_file_name, item_uuid, session):
    full_file_name = f"{IMAGES_BASE_PATH}{os.path.sep}{img_file_name}"
    print('test_populate_db:30 full_file_name:>>', full_file_name)
    img_f = open(
        full_file_name, "rb"
    )
    img_f_content = img_f.read()

    sqlFile = SQLiteFile(
        name=img_file_name,
        description=f"Description of file {img_file_name}. Autoadded file.",
        item_uuid=item_uuid
    )
    session.add(sqlFile)
    session.commit()
    # sqlFile = session.get(SQLiteFile, f_uuid)
    print('test_populate_db:44 sqlFile:>>', sqlFile)
    content = SQLiteFileContent(
        uuid=sqlFile.uuid,
        content_bytes=img_f_content
    )
    session.add(content)
    session.commit()

    return sqlFile.uuid


def add_item(itm_name, itm_img_fName):
    with Session(db.db_engine) as session:
        today = datetime.datetime.now()

        itm = Item(name=f"{itm_name} {today.strftime('%d%b%Y')} auto_add",
                   description=f"Autoadded item description #{itm_name}")
        print(f"Adding item:{itm}")
        session.add(itm)
        session.commit()

        test_autoadd_item = "test_auto_added_item"
        tag_obj = tag_in_db = session.exec(
            select(Tag).where(Tag.tag == test_autoadd_item)
        ).first()
        itm.tags.append(tag_obj)

        tag = TAGS[random.randint(0, len(TAGS)-1)]
        # print('test_populate_db:87 tag:>>', tag)
        tag_obj = tag_in_db = session.exec(
            select(Tag).where(Tag.tag == tag)
        ).first()
        itm.tags.append(tag_obj)
        itm.update_search_tags_field()

        session.add(itm)
        session.commit()

        if itm_img_fName is not None:
            addImage(itm_img_fName, itm.uuid, session)


def iterate_images():
    items_added = 0
    print(f"INFO_FNAME:{INFO_FNAME}")
    with open(INFO_FNAME, "r", encoding="cp1251") as f:
        for line in f:
            # print(f"Line:{line}")
            splitLines = line.split('\t')
            imgName = splitLines[0]
            if imgName == "Filename" or imgName == "...":
                continue
            if random.randint(0, 99) > (NUM_OF_ITEMS_TO_ADD*100)/TOTAL_NUM_OF_IMAGES:
                # print("Not proceeding with image")
                continue
            # print('test_populate_db:78 imgName:>>', imgName)
            imgName = imgName.replace(".TIF", ".JPG")
            objName = splitLines[1]

            print(f"\n\nObject:{objName}  Image:{imgName}")
            add_item(objName, imgName)

            items_added += 1

            if items_added >= NUM_OF_ITEMS_TO_ADD:
                break
    print('test_populate_db:95 items_added:>>', items_added)


if __name__ == "__main__":
    internal_init_db(echo=False)

    print("\n\n***********************************")
    print("***********************************")
    add_tags()
    iterate_images()


# To run (from fast-app directory):
#    uv run -m tests.test_populate_db
