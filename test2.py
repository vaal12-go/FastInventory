from sqlmodel import Session, select

from db import init_db, db_engine
import db
import os
import sqlite3
from sqlalchemy import text

from models.file import SQLiteFile

# # global db_engine
init_db()


session = Session(db.db_engine)
fID = None
with open("test.png", 'rb') as input_file:
    ablob = input_file.read()
    new_file = SQLiteFile(
        name="test2.png",
        description="",
        content_bytes=ablob
    )

    session.add(new_file)
    session.commit()

    print(f"FileID:{new_file.uuid}")
    fID = new_file.uuid


with open("test3.png", "wb") as out_file:
    saved_file = session.exec(
        select(SQLiteFile).where(SQLiteFile.uuid == fID)).first()
    out_file.write(saved_file.content_bytes)

    # with open("test.png", 'rb') as input_file:
    #     ablob = input_file.read()
    #     # base = os.path.basename(picture_file)
    #     # afile, ext = os.path.splitext(base)
    #     sql = '''INSERT INTO files
    #         (name, content)
    #         VALUES (:name, :content);'''
    #     conn.execute(text(sql), {"name": "some_file",
    #                  "content": sqlite3.Binary(ablob)})
    #     conn.commit()
