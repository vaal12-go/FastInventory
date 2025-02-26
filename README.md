# FastInventory

Web application writted with FastAPI and SQLModel to serve as a personal inventory management. Application uses sqlite db, so all data (item, files) can be moved to other computer. This is work in progress, so updates will be posted.

## Technological hightlights
* Uses Sqlmodel related models (one to many, many-to-many) with automatic retrieval of relationship fields with Pydantic models
* Storage/retrieval of binary files from SQL database
* QRCode generation (for labelling of inventoried items)

## Further development
* Deployment with docker and nginx
* Authentification
* Separate databases for each user
* Ability to download databases
* Error handling on the server (return those to client)
* Errors handling on client (display error conditions to user)
* Integration with IP Webcam android application (so pictures taken from phone will be automatically saved to DB)
* Allow non-picture files to be saved to DB and opened on client
* Allow management of item's pictures (deletion)
* List of containers
    * Chain of containers (will require use of WITH RECURSIVE SQL)
* List of tags
* Search

