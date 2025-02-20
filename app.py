from fastapi import FastAPI

from contextlib import asynccontextmanager

import db
from populate_users import populate_users


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.db_engine = db.init_db()
    print(f"db_engine:{db.db_engine}")
    # populate_users()/

    yield
    # # Clean up the ML models and release the resources
    # ml_models.clear()

app = FastAPI(lifespan=lifespan)
