from sqlmodel import Session

import db

from models.user import User, get_password_hash


def populate_users():
    session = Session(db.db_engine)
    newUser = User(
        user_name="vaal12",
        pass_hash=get_password_hash("qwe1"),
        full_name="simple user",
        email="qwe1@qwe.com"
    )

    session.add(newUser)
    session.commit()

    newUser = User(
        user_name="admin",
        pass_hash=get_password_hash("admin    "),
        full_name="administrator",
        email="qwe_admin@qwe.com",
        admin=True
    )
    session.add(newUser)
    session.commit()
