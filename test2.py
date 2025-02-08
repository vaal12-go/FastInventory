from db import init_db, db_engine
import db
import os
import sqlite3
from sqlalchemy import text

# # global db_engine
init_db()
# # print(f"Eng:{eng}")
# # db_engine = eng
# print(f"Eng2:{db.db_engine}")


with db.db_engine.connect() as conn:
    with open("test.png", 'rb') as input_file:
        ablob = input_file.read()
        # base = os.path.basename(picture_file)
        # afile, ext = os.path.splitext(base)
        sql = '''INSERT INTO files
            (name, content)
            VALUES (:name, :content);'''
        conn.execute(text(sql), {"name": "some_file",
                     "content": sqlite3.Binary(ablob)})
        conn.commit()
