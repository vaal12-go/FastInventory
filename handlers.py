from fastapi import File, UploadFile
import uuid
from sqlmodel import Session, select, text

import db
from models.item import Item, ItemCreate, TagRec
from models.tag import Tag

from sqlalchemy.orm import joinedload


from pydantic import BaseModel, computed_field

from app import app
import helpers
from typing import Annotated, List

import logging


import traceback


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
async def upload_picture_handler(file_uploaded: UploadFile):
    print('have picture upload')
    fUploadedSave = open(f"uploaded.{file_uploaded.filename}", "wb")
    fUploadedSave.write(file_uploaded.file.read())
    fUploadedSave.close()
    return {
        "error": "Not implemented4"
    }
