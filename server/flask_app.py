import pathlib
import random
import string
from typing import *

from flask import Flask, request, make_response

cwd = pathlib.Path(__file__).parent


def access_schedule(pop_one: bool = False, whitelist: Tuple[int] = tuple(range(1, 40 + 1)),
                    f: pathlib.Path = cwd / "schedule.txt"):
    if f.is_file():
        t = list(map(int, f.read_text("utf-8").split(", ")))
    else:
        t = []
    while len(t) < 100:
        t.append(random.randint(1, 40))

    x = None
    while pop_one and x not in whitelist:
        x, *t = t

    f.write_text(", ".join(map(str, t)))

    if pop_one:
        return x
    else:
        return t


app = Flask(__name__)


@app.route("/get")
def get_one():
    whitelist = tuple(map(int, request.args.get("whitelist").split(","))
                      if "whitelist" in request.args else range(1, 40 + 1))
    x = access_schedule(pop_one=True, whitelist=whitelist)
    response = make_response(str(x))
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/")
def index(template=string.Template((cwd / "template.html").read_text("utf-8"))):
    items = "<ol>" + "".join(f"<li>{x:0>2}</li>" for x in access_schedule()) + "</ol>"
    return template.substitute(items=items)


print(access_schedule(pop_one=True))
