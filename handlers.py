import logging
import traceback
import uuid

from fastapi import File, UploadFile, Form
from sqlmodel import Session, select, text

import db
from models.item import Item, ItemCreate, TagRec
from models.tag import Tag
from models.file import SQLiteFile

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

# This handler is not fully functional


@app.post("/upload_picture")
async def upload_picture_handler(
        file_uploaded: Annotated[UploadFile, File()],
        uuid_str: Annotated[str, Form()]):
    print('have picture upload 5')
    print('handlers:42 uuid:>>', uuid_str)
    f_content = file_uploaded.file.read()
    fUploadedSave = open(f"uploaded.{uuid_str}_{file_uploaded.filename}", "wb")
    fUploadedSave.write(f_content)
    fUploadedSave.close()

    session = Session(db.db_engine)

    sqlFile = SQLiteFile(
        name=file_uploaded.filename,
        description=f"Description of file {file_uploaded.filename}",
        item_uuid=uuid.UUID(uuid_str),
        content_bytes=f_content
    )
    session.add(sqlFile)
    session.commit()

    return {
        "error": "Not implemented4"
    }
