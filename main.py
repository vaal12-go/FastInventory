import helpers
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI


from test1 import test_populate_db, testDB2

from sqlmodel import Session, select

from models.item import Item
from models.tag import Tag


import handlers

import uuid
from typing import List

# from handlers import item_get_handler, new_item_handler

from app import app
import qr_code_handler
import handlers

import logging

print("before app routers")

# This route should be defined after all the rest in other case it will shadow other routes
app.mount("/", StaticFiles(directory=helpers.getHttpClientDirectory(),
                           html=True), name="static")

print("After app routers")


# def item_get_handler(item_uuid: str):
#     return handlers.item_get_handler(item_uuid)


# To run :
#   pipenv run fastapi dev --host 127.0.0.1 --port 8080 --log-level debug main.py
