import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from db import db
# from populate_users import populate_users
# import configuration


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv()
    sqlite_f_name = os.getenv(
        "SQLITE_FILE_NAME")
    print(f"sqlite_f_name:{sqlite_f_name}")
    if sqlite_f_name == None:
        db.init_db()    
    else:
        db.init_db(sqlite_f_name)
    print(f"db_engine:{db.db_engine}")

    yield
    # Shutdown operations to be performed here
    pass

app = FastAPI(lifespan=lifespan)
