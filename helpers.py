import os.path


def getHttpClientDirectory():
    # (parent_dir_path, currDir) = os.path.split(
    #     os.path.dirname(os.path.realpath(__file__))
    # )
    curr_dir = os.path.dirname(os.path.realpath(__file__))
    print(f"Curr Dir:{curr_dir}")
    return os.path.join(curr_dir, "static")
