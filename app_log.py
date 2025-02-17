# Used when logging strategies were explored. Not needed at the moment.


# import os
# import sys
# import logging

# loggers = [logging.getLogger(name) for name in logging.root.manager.loggerDict]
# print(f"Loggers:{loggers}")
# for logWriter in loggers:
#     logWriter.info(
#         f"Logger [{logWriter}] message"
#     )


# api_logger = logging.getLogger("api server")
# # api_logger = logging.getLogger("uvicorn")

# api_logger.setLevel(logging.DEBUG)
# command_line_handler = logging.StreamHandler()
# command_line_handler.setLevel(logging.DEBUG)
# formatter = logging.Formatter('%(levelname)s- api - %(asctime)s - %(message)s')
# command_line_handler.setFormatter(formatter)
# api_logger.addHandler(command_line_handler)

# logging.basicConfig(
#     # filename='c:\\Users\\may13\\Desktop\\logs\\myapp.log',
#     level=logging.DEBUG,
#     handlers=[
#         logging.FileHandler("c:\\Users\\may13\\Desktop\\logs\\myapp.log"),
#         logging.StreamHandler(sys.stderr)])


# uvic_error_logger = logging.getLogger("uvicorn")

# print(f"sys.stdout:{sys.stdout}")
# print(f"sys.stderr:{sys.stderr}")
