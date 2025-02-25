import datetime
from passlib.context import CryptContext
from sqlmodel import SQLModel, Field

# token does not need to be saved in DB. This class is only needed for "access_token" and "token_type" fields which will be returned to the client


class Token(SQLModel, table=True):
    # id field is only needed as sqlalchemy requires models/tables to have primary key
    id: int = Field(primary_key=True)
    access_token: str
    token_type: str = "bearer"
    user_name: str
    created_date: datetime.datetime
    expiration_date: datetime.datetime

    def short_token(self):
        return f"{self.access_token[:5]}...{self.access_token[-5:]}"

    def __str__(self):
        return f"models.user.Token id:{self.id} \n\ttoken:{self.short_token()}\n\texpiration:{self.expiration_date}"


class User(SQLModel, table=True):
    user_name: str = Field(primary_key=True)
    pass_hash: str
    full_name: str | None
    email: str | None
    admin: bool = False


# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd_context = CryptContext(schemes=["bcrypt"])


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
