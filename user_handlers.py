from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


from app import app


@app.post("/user/login")
async def user_login_hanlder(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    print('user.handlers:8 form_data:>>', form_data)
    print('user_handlers:12 form_data.user:>>', form_data.username)
    print('user_handlers:13 form_data.password:>>', form_data.password)
    return {
        "error": "not implemented"
    }
