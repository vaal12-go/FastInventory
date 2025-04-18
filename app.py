import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv

import db
from populate_users import populate_users
import configuration


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv()
    configuration.SQLITE_FILE_NAME = os.getenv(
        "SQLITE_FILE_NAME", configuration.SQLITE_FILE_NAME)
    # print('app:18 config.SQLITE_FILE_NAME:>>', configuration.SQLITE_FILE_NAME)

    db.db_engine = db.init_db()
    print(f"db_engine:{db.db_engine}")

    yield
    # Shutdown operations to be performed here
    pass

app = FastAPI(lifespan=lifespan)
