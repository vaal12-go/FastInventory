# Main module of the application
# Dev run
#    pipenv run fastapi dev --host 127.0.0.1 --port 8080 main.py

# For prod environment (no IP as it will be managed by Docker):
#    pipenv run fastapi run  --port 8080 main.py


from fastapi.staticfiles import StaticFiles

from app import app
import helpers

# modules with handlers have to be imported so handles are registered
import qr_code_handler
import item_handlers
import handlers


# This route should be defined after all the rest in other case it will shadow other routes
app.mount("/", StaticFiles(directory=helpers.getHttpClientDirectory(),
                           html=True), name="static")
