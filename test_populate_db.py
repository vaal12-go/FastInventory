import os
import uuid
import random

from dotenv import load_dotenv

from sqlmodel import Field, Session


from models.item import Item
from models.file import SQLiteFile, SQLiteFileContent
import db
import configuration

DISK_BASE_PATH = r"c:\Users\may13\Desktop\Object photo disk"
INFO_FNAME = DISK_BASE_PATH + r"\TEXTFILE\OBJECT06.TXT"
IMAGES_BASE_PATH = DISK_BASE_PATH+r"\PHOTOS\MED_RES"

TOTAL_NUM_OF_IMAGES = 120
NUM_OF_ITEMS_TO_ADD = 5


def init_db():
    load_dotenv()
    configuration.SQLITE_FILE_NAME = os.getenv(
        "SQLITE_FILE_NAME", configuration.SQLITE_FILE_NAME)
    db.db_engine = db.init_db()


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
        itm = Item(name=f"{itm_name} auto_add",
                   description=f"Autoadded item description #{itm_name}")
        print(f"Adding item:{itm}")
        session.add(itm)
        session.commit()
        print(f"Item added:{itm}")

        if itm_img_fName is not None:
            addImage(itm_img_fName, itm.uuid, session)


def iterate_images():
    items_added = 0
    with open(INFO_FNAME, "r") as f:
        for line in f:
            print(f"Line:{line}")
            splitLines = line.split('\t')

            imgName = splitLines[0]
            print('test_populate_db:78 imgName:>>', imgName)
            if imgName == "Filename" or imgName == "...":
                continue

            if random.randint(0, 99) > (NUM_OF_ITEMS_TO_ADD*100)/TOTAL_NUM_OF_IMAGES:
                print("Not proceeding with image")
                continue

            imgName = imgName.replace(".TIF", ".JPG")
            objName = splitLines[1]
            print(f"Object:{objName}  Image:{imgName}")
            add_item(objName, imgName)

            items_added += 1

            if items_added >= NUM_OF_ITEMS_TO_ADD:
                break
    print('test_populate_db:95 items_added:>>', items_added)


if __name__ == "__main__":
    print("I am main program")
    init_db()
    iterate_images()
