import calendar
import dataclasses
import datetime
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

logger = logging.getLogger(__file__)
logging.basicConfig(level=logging.DEBUG)

best_timezone = pytz.timezone('Europe/Warsaw')


def lesson_end(start: datetime.time) -> datetime.time:
    return (datetime.datetime.combine(datetime.date.today(), start) + datetime.timedelta(minutes=45)).time()


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


def generate_numbers(weights: List[int], n: int = 500) -> List[int]:
    weighted = tuple(itertools.chain(*([i] * weights[i] for i in range(len(weights))), range(len(weights), 40 + 1)))
    return list(random.choice(weighted) for _ in range(n))


def compress_numbers(numbers: Iterable[int],
                     alphabet: str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzm0123456789+/"):
    assert all(0 <= x < len(alphabet) for x in numbers)
    return ''.join(alphabet[i] for i in numbers)


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

    def is_active(self, moment: datetime.datetime):
        return any(lesson.start <= moment.time() <= lesson.end for lesson in self.plan[moment.weekday()])

    def reserve(self, n: int = 500):
        weighted = tuple(itertools.chain(*((i,) * self.weights[i] for i in range(40))))
        while len(self.numbers) < n:
            x = random.choice(weighted)
            while self.numbers and self.numbers[-1] == x:
                x = random.choice(weighted)
            self.numbers += (x,)

    def get(self, starting: bool = False):
        if starting:
            return self.numbers[0]
        self.i += 1
        _, x, *self.numbers = self.numbers
        self.numbers = (x, *self.numbers)
        self.reserve()
        return x

    def get_with_whitelist(self, whitelist: int, starting: bool = False):
        assert 0 < whitelist < (1 << 40)
        while True:
            x = self.get(starting)
            starting = False
            if whitelist & (1 << x):
                return x


users: List[User]
users_by_client: Dict[str, User]


def load_blockchain():
    global users, users_by_client

    blockchain = yaml.load((pathlib.Path(__file__).parent / 'blockchain.yml').read_text())

    lesson_start_times = [datetime.time(*map(int, x.split(':'))) for x in blockchain['lesson-start-times']]
    logger.info(f"lesson_start_times: {lesson_start_times}")

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
    logger.info(f"users: {users}")

    users_by_client = {user.client: user for user in users}


load_blockchain()


def load_planned():
    logger.info("Load planned.yml")
    planned = yaml.load((pathlib.Path(__file__).parent / 'planned.yml').read_text())
    for user in users:
        user.i = planned[user.client]['i']
        user.numbers = tuple(x - 1 for x in planned[user.client]['numbers'])
        user.reserve()


def save_planned():
    logger.info("Save planned.yml")
    data = {user.client: {'numbers': [x + 1 for x in user.numbers], 'i': user.i} for user in users}
    (pathlib.Path(__file__).parent / 'planned.yml').write_text(yaml.dump(data))


try:
    load_planned()
except FileNotFoundError:
    for user_ in users:
        user_.reserve()
    save_planned()


def answer(moment: datetime.datetime, client: str, whitelist: int, starting: bool):
    if client not in users_by_client.keys():
        return 'invalid-client'
    user = users_by_client[client]
    if not user.is_active(moment):
        return 'client-not-active'
    x = user.get_with_whitelist(whitelist, starting)
    save_planned()
    return f"{x} {compress_numbers(user.weights)}"


@app.route('/get')
def app_answer():
    try:
        auth = request.args.get('auth', '<wrong authentication>', str)
        whitelist = request.args.get('whitelist', (1 << 40) - 1, int)

        logger.info(f"Request: auth: {auth!r}, whitelist: {whitelist}")

        s = 0
        for key in sorted(request.headers.keys()):
            if key not in ('X-Real-Ip', 'User-Agent', 'Accept'):
                continue
            for c in key + request.headers[key]:
                s = (s * 127 + ord(c)) % (10 ** 32 + 49)
        logger.info(f"The client proper hash is {s}")

        if auth != "12345":
            return 'invalid-authentication'

        response = make_response(answer(datetime.datetime.now(best_timezone), 'xyzzy', whitelist))
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    except:
        traceback.print_exc()
        return "error", 403


template = string.Template((pathlib.Path(__file__).parent / 'template.html').read_text(encoding='utf-8'))


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


@app.route('/help')
def list_blockchain():
    return '<pre>' + html.escape((pathlib.Path(__file__).parent / 'blockchain.yml').read_text()) + '</pre>'
