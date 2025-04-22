import os.path


def getHttpClientDirectory():
    curr_dir = os.path.dirname(os.path.realpath(__file__))
    print(f"Curr Dir2:{curr_dir}")

    grand_parent_dir = os.path.split(
        os.path.split(os.path.abspath(curr_dir))[0]
    )[0]
    print(f"grand_parent_dir:{grand_parent_dir}")
    ret_path = os.path.join(grand_parent_dir, "static")
    print(f"ret_path:{ret_path}")
    return ret_path
