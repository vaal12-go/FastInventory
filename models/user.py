from sqlmodel import SQLModel


class User(SQLModel, table=True):
    user_name: str = Field(primary_key=True)
    pass_hash: str
    full_name: str | None
    email: str | None
    admin: bool = False


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password):
    return pwd_context.hash(password)
