import logging
import traceback
import uuid
from typing import Annotated, List

from fastapi import File, UploadFile, Form, Response
from sqlmodel import Session, select, text
from sqlalchemy.orm import joinedload
from pydantic import BaseModel, computed_field



from ..db import db
from ..models.item import Item, ItemCreate, TagRec
from ..models.tag import Tag
from ..models.file import SQLiteFile, SQLiteFileContent



# from app import app
from .main_router import main_router
from ..internal import helpers



@main_router.get("/tag")
async def tag_list_handler():
    with Session(db.db_engine) as session:
        ret = session.exec(
            select(Tag)
        ).all()
        # print('handlers.py: ret=', ret)
        return {
            "status": "success",
            "tags": ret
        }
# END async def tag_list_handler():


@main_router.get("/item_file/{file_uuid}")
async def get_file_handler(file_uuid: uuid.UUID):
    with Session(db.db_engine) as session:
        fContent = session.exec(
            select(SQLiteFileContent).where(
                SQLiteFileContent.uuid == file_uuid)
        ).first()
        return Response(content=fContent.content_bytes)


@main_router.post("/upload_item_file")
async def upload_picture_handler(
        file_uploaded: Annotated[UploadFile, File()],
        uuid_str: Annotated[str, Form()]):
    f_content = file_uploaded.file.read()

    with Session(db.db_engine) as session:
        sqlFile = SQLiteFile(
            name=file_uploaded.filename,
            description=f"Description of file {file_uploaded.filename}",
            item_uuid=uuid.UUID(uuid_str)
        )
        # print('handlers:56 sqlFile:>>', sqlFile)
        f_uuid = sqlFile.uuid
        session.add(sqlFile)
        session.commit()

        sqlFile = session.get(SQLiteFile, f_uuid)
        # print('handlers:59 sqlFile:>>', type(sqlFile))
        # print('handlers:59 sqlFile:>>', sqlFile.uuid)
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
# END async def upload_picture_handler(
