import datetime
import pathlib
from typing import *
import collections
import random
import itertools
import string
import traceback
import html

from flask import Flask, request, abort, make_response

app = Flask(__name__)


def compress_numbers(numbers: List[int],
                     alphabet: str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzm0123456789+/"):
    assert all(0 <= x < len(alphabet) for x in numbers)
    return ''.join(alphabet[i] for i in numbers)


weights = collections.defaultdict(lambda: 10)
weights.update({
    1 - 1: 2,
    19 - 1: 20,
    25 - 1: 50,
    27 - 1: 20
})
weighted = tuple(itertools.chain(*([i] * weights[i] for i in range(40))))
compressed_weights = compress_numbers(list(weights[i] for i in range(40)))


def generate_block(n: int = 500):
    return [random.choice(weighted) for _ in range(n)]


assigned_block = {}
access_time = {}


template = string.Template((pathlib.Path(__file__).parent / 'template.html').read_text(encoding='utf-8'))


@app.route('/')
def list_sequence():
    items = []
    for client in sorted(assigned_block.keys(), key=lambda k: access_time[k], reverse=True):
        items.append(f'{html.escape(client)}<br>({access_time[client]})<ol>')
        items.extend(f'<li>{i + 1}</li>' for i in assigned_block[client])
        items.append(f'</ol>')
    return template.substitute(items=' '.join(items))


@app.route('/get')
def get():
    auth = request.args.get('auth', '<wrong password>', str)
    client = request.args.get('client', '<undeclared>', str)
    block = generate_block()

    if auth == "12345":  # TODO: Better password.
        assigned_block[client] = block
        access_time[client] = datetime.datetime.now()

    response = make_response(compressed_weights + ' ' + compress_numbers(block))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

