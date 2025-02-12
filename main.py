from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import db
from test1 import test_populate_db
from contextlib import asynccontextmanager

import helpers


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.db_engine = db.init_db()
    print(f"db_engine:{db.db_engine}")
    test_populate_db()

    yield
    # # Clean up the ML models and release the resources
    # ml_models.clear()


app = FastAPI(lifespan=lifespan)


# @app.get("/")
# async def root_handler():
#     return {"Hello": "World"}

app.mount("/", StaticFiles(directory=helpers.getHttpClientDirectory(),
          html=True), name="static")


# To run :
#   pipenv run fastapi dev --host 127.0.0.1 --port 8080 main.py
