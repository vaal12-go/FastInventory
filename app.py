from fastapi import FastAPI


from contextlib import asynccontextmanager

import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.db_engine = db.init_db()
    print(f"db_engine:{db.db_engine}")
    # test_populate_db()
    # testDB2()

    yield
    # # Clean up the ML models and release the resources
    # ml_models.clear()

app = FastAPI(lifespan=lifespan)
