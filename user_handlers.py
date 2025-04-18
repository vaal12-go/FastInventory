from typing import Annotated
from datetime import datetime, timedelta, timezone
from fastapi import Depends, Response, status, HTTPException
import jwt
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


from app import app
import db
from models.user import User, Token, verify_password

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")


def authenticate_user(session, username: str, password: str):
    usr = session.get(User, username)
    print('user_handlers:12 usr:>>', usr)
    if not usr:
        return False
    if not verify_password(password, usr.pass_hash):
        return False
    return usr


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    time_now = datetime.now(timezone.utc)
    if expires_delta:
        expire = time_now + expires_delta
    else:
        expire = time.now + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return (encoded_jwt, time_now, expire)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials2",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print('user_handlers:50 "qwe11":>>', "qwe11")
    session = Session(db.db_engine)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print('user_handlers:54 payload:>>', payload)
        user_name = payload.get("sub")
        print('user_handlers:54 user_name:>>', user_name)
        if user_name is None:
            raise credentials_exception
        tkn = Token(user_name=user_name)
    except InvalidTokenError:
        raise credentials_exception

    user = session.get(User, user_name)
    print('user_handlers:64 user:>>', user)
    if user is None:
        raise credentials_exception
    return user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return [{"item_id": "Foo", "owner": current_user.user_name}]


@app.post("/user/login")
async def user_login_hanlder(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        response: Response):
    print('user.handlers:8 form_data:>>', form_data)
    print('user_handlers:12 form_data.user:>>', form_data.username)
    print('user_handlers:13 form_data.password:>>', form_data.password)
    session = Session(db.db_engine)
    auth_user = authenticate_user(
        session, form_data.username, form_data.password)
    print('user_handlers:30 auth_user:>>', auth_user)
    if not auth_user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {
            "error": "bad credentials"
        }
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    (access_token, time_now, time_expired) = create_access_token(
        data={"sub": auth_user.user_name}, expires_delta=access_token_expires
    )
    print('user_handlers:52 access_token:>>', access_token)
    tkn = Token(
        access_token=access_token,
        created_date=time_now,
        expiration_date=time_expired,
        user_name=auth_user.user_name
    )
    print('user_handlers:68 tkn:>>', tkn)
    session.add(tkn)
    session.commit()
    print('user_handlers:72 tkn:>>', str(tkn))

    return tkn
