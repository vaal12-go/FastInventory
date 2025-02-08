from sqlmodel import Field, SQLModel, create_engine
import uuid


class Container(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    description: str = ""
