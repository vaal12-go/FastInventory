import uuid as uuid_lib
from datetime import datetime

from typing import Optional, List

from pydantic import BaseModel

from .tag import Tag
from .file import SQLiteFile

class ItemOut(BaseModel):
    uuid: uuid_lib.UUID
    name: str
    description: str
    container_uuid: uuid_lib.UUID | None = None
    tags: Optional[List[Tag]] = []
    files: Optional[List[SQLiteFile]] = []
    created_datetime: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


class ItemOutList(BaseModel):
    lst: List[ItemOut] = []

    class Config:
        from_attributes = True