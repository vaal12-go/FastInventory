# Main module of the application
# Dev run
#    pipenv run fastapi dev --host 127.0.0.1 --port 8080 ./fast-app/main.py

# For prod environment (no IP as it will be managed by Docker):
#    pipenv run fastapi run  --port 8080 main.py


from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .app import app
from .internal import helpers

# modules with handlers have to be imported so handles are registered
from .routers import api_router

print(f"api_router:{api_router}")

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

# This route should be defined after all the rest in other case it will shadow other routes
app.mount("/", StaticFiles(directory=helpers.getHttpClientDirectory(),
                           html=True), name="static")


