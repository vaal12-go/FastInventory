import logging
import traceback
import uuid

from fastapi import File, UploadFile, Form, Response
from sqlmodel import Session, select, text

import db
from models.item import Item, ItemCreate, TagRec
from models.tag import Tag
from models.file import SQLiteFile, SQLiteFileContent

from sqlalchemy.orm import joinedload


from pydantic import BaseModel, computed_field

from app import app
import helpers
from typing import Annotated, List


@app.get("/tag")
async def tag_list_handler():
    session = Session(db.db_engine)
    ret = session.exec(
        select(Tag)
    ).all()
    print('handlers.py: ret=', ret)
    return {
        "status": "success",
        "tags": ret
    }


@app.get("/item_file/{file_uuid}")
async def get_file_handler(file_uuid: uuid.UUID):
    # print("Hello")
    # print('handlers:38 file_uuid:>>', file_uuid)
    session = Session(db.db_engine)
    fContent = session.exec(
        select(SQLiteFileContent).where(SQLiteFileContent.uuid == file_uuid)
    ).first()
    return Response(content=fContent.content_bytes)


@app.post("/upload_item_file")
async def upload_picture_handler(
        file_uploaded: Annotated[UploadFile, File()],
        uuid_str: Annotated[str, Form()]):
    # print('have picture upload 5')
    # print('handlers:42 uuid:>>', uuid_str)
    f_content = file_uploaded.file.read()
    # fUploadedSave = open(f"uploaded.{uuid_str}_{file_uploaded.filename}", "wb")
    # fUploadedSave.write(f_content)
    # fUploadedSave.close()

    with Session(db.db_engine) as session:
        sqlFile = SQLiteFile(
            name=file_uploaded.filename,
            description=f"Description of file {file_uploaded.filename}",
            item_uuid=uuid.UUID(uuid_str)
        )
        print('handlers:56 sqlFile:>>', sqlFile)
        f_uuid = sqlFile.uuid
        session.add(sqlFile)
        session.commit()

        sqlFile = session.get(SQLiteFile, f_uuid)
        print('handlers:59 sqlFile:>>', type(sqlFile))
        print('handlers:59 sqlFile:>>', sqlFile.uuid)
        content = SQLiteFileContent(
            uuid=sqlFile.uuid,
            content_bytes=f_content
        )
        session.add(content)
        session.commit()

        # for some reason (session overload with blob?) sqlFile does not work neither in print nor in return.
        # Have to reload variable from DB
        # Most probably this is due to sessions not returned back to pool. Have to move all session requests to 'with' context management.
        sqlFile = session.get(SQLiteFile, f_uuid)

        return {
            "status": "success",
            "file_created": sqlFile
        }
