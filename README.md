# FastInventory

Web application writted with FastAPI and SQLModel to serve as a personal inventory management. Application uses sqlite db, so all data (item, files) can be moved to other computer. This is work in progress, so updates will be posted.

## Technological hightlights
* Uses Sqlmodel related models (one to many, many-to-many) with automatic retrieval of relationship fields with Pydantic models
    * Item model uses Pydantic model inheritance (for creation of items, automatic generateion of created and updated date fields)
    * Also ItemOut allow for automatic population of linked many-to-many models (Tags) (see item_get.py function get_all_items)

* Storage/retrieval of binary files from SQL database
    * To optimize search for tags item and tag models were denormalized (field 'search_tags_field' was added to item table). Which allows for very quick filtering of items during search, but gives an overhead of manual updating of the field, when tag is added/removed from the item. TODO: check if such update can be done via automatic Pydantic fields
    * On 16Mar2025 context managers added to every fastapi handler as without context managers even on local testing machine sqlmodel depletes sessions pool, which leads to errors. With context management of session creation/freeing no pool exhaustion is observed.
* QRCode generation (for labelling of inventoried items)
* Search terms hightlight on the client uses segments union algorythm (see array_reducer reduce_arrays function), which allows for flexible and effective hightlighing of search terms on the page. This feature is implemented with heavy reliance of functional js contstructs (array forEach, filter and reduce).

## Updates
* 1May2025 - fastapi application is transitioned to use uv package/venv manager. React index page is default index being served (other pages will be transitioned). It is a bit less functional than vanilla js page (e.g. search is not yet working), but pagination works.
* 22Apr2025 - fastapi application moved to fast-app folder and it is better structured for further development. React rewrite of frontend started (not yet moved to actual frontend)
* 16Mar2025 - search by tags and text search field is working (at the moment only for item names). Search terms are highlighted on the client.



## Further development
* Front end rewrite with react
    * URL replacement with search parameters, so search criteria (and tags) can be bookmarked on the index page
    * Search - partially implemented in update of 16Mar2025
* Deployment with docker and nginx
* Integration with IP Webcam android application (so pictures taken from phone will be automatically saved to DB) - in works
* Authentification
* Load testing (search/retrieval/db size) with tens of thousands items.
* Separate databases for each user
* Ability to download databases
* Error handling on the server (return those to client) - partially done.
* Errors handling on client (display error conditions to user) - partially done (on index)
* Allow non-picture files to be saved to DB and opened on client
* Allow management of item's pictures (deletion)
* List of containers
    * Chain of containers (will require use of WITH RECURSIVE SQL)
 

