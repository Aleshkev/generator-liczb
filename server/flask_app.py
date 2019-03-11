import calendar
import dataclasses
import datetime
import functools
import html
import itertools
import logging
import pathlib
import random
import re
import string
import traceback
import warnings
from typing import *

import pytz
import yaml
from flask import Flask, request, make_response

app = Flask(__name__)

logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)
fh = logging.FileHandler(pathlib.Path(__file__).parent / 'log.log')
fh.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s:\t\t%(message)s'))
logger.addHandler(fh)

best_timezone = pytz.timezone('Europe/Warsaw')


def suspect(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        a = ', '.join(map(repr, args))
        k = (', ' if args and kwargs else '') + ', '.join(f'{k}={v!r}' for k, v in kwargs.items())
        r = f(*args, **kwargs)
        print(f"{f.__name__}({a}{k}) -> {r!r}")
        logger.debug(f"{f.__name__}({a}{k}) -> {r!r}")
        return r

    return wrapper


def lesson_end(start: datetime.time) -> datetime.time:
    return (datetime.datetime.combine(datetime.date.today(), start) + datetime.timedelta(minutes=45)).time()


@suspect
def process_transactions(transactions: str) -> Tuple[int, ...]:
    weights = [10] * 40
    for transaction in transactions:
        match = re.match(r'(.*), (.+)', transaction)

        expiration = datetime.datetime(*map(int, match.group(2).split('-')), hour=0)
        if expiration < datetime.datetime.now():
            warnings.warn("Expired transaction in blockchain: please remove")
            continue

        transaction = match.group(1)

        if transaction.startswith('delete'):
            match = re.match(r'delete (\d+) from (\d+)', transaction)
            n, a = int(match.group(1)), int(match.group(2)) - 1
            weights[a] -= n
            assert 0 < weights[a] < 64
        elif transaction.startswith('move'):
            match = re.match(r'move (\d+) from (\d+) to (\d+)', transaction)
            n, a, b = int(match.group(1)), int(match.group(2)) - 1, int(match.group(3)) - 1
            weights[a] -= n
            weights[b] += n
            assert 0 < weights[a] < 64 and 0 < weights[b] < 64

    return tuple(weights)


@suspect
def generate_numbers(weights: List[int], n: int = 500) -> List[int]:
    weighted = tuple(itertools.chain(*([i] * weights[i] for i in range(len(weights))), range(len(weights), 40 + 1)))
    return list(random.choice(weighted) for _ in range(n))


ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzm0123456789+/"


@suspect
def compress_numbers(numbers: Iterable[int]) -> str:
    assert all(0 <= x < len(ALPHABET) for x in numbers)
    return ''.join(ALPHABET[i] for i in numbers)


@suspect
def decompress_numbers(numbers: str) -> List[int]:
    assert all(c in ALPHABET for c in numbers)
    return [ALPHABET.index(c) for c in numbers]


class Lesson(NamedTuple):
    start: datetime.time
    end: datetime.time

    def __repr__(self):
        return f"{self.start.hour}:{self.start.minute:0>2}-{self.end.hour}:{self.end.minute:0>2}"


@dataclasses.dataclass
class User:
    client: str
    name: str
    weights: Tuple[int, ...]
    plan: Tuple[Tuple[Optional[Lesson], ...], ...]

    numbers: Tuple[int, ...] = ()
    i: int = 0

    @suspect
    def is_active(self, moment: datetime.datetime):
        return any(lesson.start <= moment.time() <= lesson.end for lesson in self.plan[moment.weekday()])

    @suspect
    def reserve(self, n: int = 500):
        weighted = tuple(itertools.chain(*((i,) * self.weights[i] for i in range(40))))
        while len(self.numbers) < n:
            x = random.choice(weighted)
            while self.numbers and self.numbers[-1] == x:
                x = random.choice(weighted)
            self.numbers += (x,)
        return self.numbers

    @suspect
    def get(self, starting: bool = False):
        if starting:
            return self.numbers[0]
        self.i += 1
        _, x, *self.numbers = self.numbers
        self.numbers = (x, *self.numbers)
        self.reserve()
        return x

    @suspect
    def get_with_whitelist(self, whitelist: Tuple[bool, ...], starting: bool = False):
        while True:
            x = self.get(starting)
            starting = False
            if whitelist[x]:
                return x


users: List[User]
users_by_client: Dict[str, User]


@suspect
def load_blockchain():
    global users, users_by_client

    blockchain = yaml.load((pathlib.Path(__file__).parent / 'blockchain.yml').read_text())

    lesson_start_times = [datetime.time(*map(int, x.split(':'))) for x in blockchain['lesson-start-times']]
    logger.info(f"load_blockchain(): lesson_start_times: {lesson_start_times}")

    @suspect
    def calculate_lessons(day_plan: Tuple[Optional[bool], ...]) -> Tuple[Lesson, ...]:
        i = 0
        lessons = []
        while i < len(day_plan):
            if not day_plan[i]:
                i += 1
                continue
            j = i
            while i < len(day_plan) and day_plan[i]:
                i += 1
            lessons.append(Lesson(lesson_start_times[j], lesson_end(lesson_start_times[i - 1])))
        return tuple(lessons)

    users = [User(x['client'], x['name'], process_transactions(x['transactions']),
                  tuple(calculate_lessons(day_plan) for day_plan in tuple(x['plan']) + ((),) * (7 - len(x['plan']))))
             for x in blockchain['users']]
    logger.info(f"load_blockchain(): users: {users}")

    users_by_client = {user.client: user for user in users}


load_blockchain()


@suspect
def load_planned():
    planned = yaml.load((pathlib.Path(__file__).parent / 'planned.yml').read_text())
    for user in users:
        user.i = planned[user.client]['i']
        user.numbers = tuple(x - 1 for x in planned[user.client]['numbers'])
        user.reserve()
        logger.info(f"load_planned(): user.name={user.name!r}: i={user.i}, numbers={user.numbers}")


@suspect
def save_planned():
    data = {}
    for user in users:
        data[user.client] = {'numbers': [x + 1 for x in user.numbers], 'i': user.i}
        logger.info(f"save_planned(): user.name={user.name!r}: i={user.i}, numbers={user.numbers}")
    (pathlib.Path(__file__).parent / 'planned.yml').write_text(yaml.dump(data))


try:
    load_planned()
except FileNotFoundError:
    logger.info(f"planned.yml not found")
    for user_ in users:
        user_.reserve()
    save_planned()

save_planned()
load_planned()


@suspect
def answer(moment: datetime.datetime, client: str, whitelist: Tuple[bool, ...], starting: bool = False):
    if client not in users_by_client.keys():
        return 'invalid-client'
    user = users_by_client[client]
    if not user.is_active(moment):
        return 'client-not-active'
    x = user.get_with_whitelist(whitelist, starting)
    save_planned()
    return f"{x} {compress_numbers(user.weights)}"


@suspect
@app.route('/get')
def app_answer():
    try:
        auth = request.args.get('auth', '<wrong authentication>')
        whitelist = tuple(decompress_numbers(request.args.get('whitelist', 'B' * 40)))
        assert all(x == 0 or x == 1 for x in whitelist)
        whitelist = tuple(map(bool, whitelist))

        client_hash = 0
        for key in sorted(request.headers.keys()):
            if key not in ('X-Real-Ip', 'User-Agent', 'Accept'):
                continue
            for c in key + request.headers[key]:
                client_hash = (client_hash * 127 + ord(c)) % (10 ** 32 + 49)

        logger.info(f"app_answer(): auth={auth!r}, whitelist={whitelist}, client_hash={client_hash}")

        if auth != "12345":
            return 'invalid-authentication'

        response = make_response(answer(datetime.datetime.now(best_timezone), 'xyzzy', whitelist))
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    except:
        traceback.print_exc()
        return "error", 403


template = string.Template((pathlib.Path(__file__).parent / 'template.html').read_text(encoding='utf-8'))


@suspect
@app.route('/')
def list_planned():
    items = []

    for user in users:
        items.extend([
            f'{user.name}',
            '; '.join(calendar.day_abbr[i] + ' ' + ', '.join(map(str, user.plan[i])) for i in range(7) if user.plan[i]),
            '<ol>' + '<li></li>' * (user.i % 10),
            ''.join(f'<li>{i + 1:_>2}</li>' for i in user.numbers[:len(user.numbers) - user.i % 10]),
            '</ol>'
        ])

    items.append(f'time: {datetime.datetime.now(best_timezone)}')

    return template.substitute(items=' '.join(items))


@suspect
@app.route('/help')
def list_blockchain():
    return '<pre>' + html.escape((pathlib.Path(__file__).parent / 'blockchain.yml').read_text()) + '</pre>'


@app.route('/log')
def list_log():
    return '<pre>' + html.escape((pathlib.Path(__file__).parent / 'log.log').read_text()) + '</pre>'
