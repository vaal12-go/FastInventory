from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import db
from test1 import test_populate_db, testDB2
from contextlib import asynccontextmanager
from sqlmodel import Session, select

from models.item import Item
from models.tag import Tag

import helpers
import handlers

import uuid
from typing import List


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.db_engine = db.init_db()
    print(f"db_engine:{db.db_engine}")
    # test_populate_db()
    testDB2()

    yield
    # # Clean up the ML models and release the resources
    # ml_models.clear()


app = FastAPI(lifespan=lifespan)


@app.get("/item/{item_uuid}")
def item_get_handler(item_uuid: str):
    return handlers.item_get_handler(item_uuid)


@app.post("/item/")
async def new_item_handler(newItem: Item):
    print(f"Have item:{newItem}")
    newUUID = newItem.uuid
    session = Session(db.db_engine)
    session.add(newItem)
    session.commit()
    print(f"Item after saving:{newItem}")
    createdItem = session.exec(
        select(Item).where(Item.uuid == newUUID)
    ).first()
    print(f"createdItem:{createdItem}")
    return {
        "status": "success",
        "item": createdItem
    }

app.mount("/", StaticFiles(directory=helpers.getHttpClientDirectory(),
                           html=True), name="static")

# To run :
#   pipenv run fastapi dev --host 127.0.0.1 --port 8080 main.py
