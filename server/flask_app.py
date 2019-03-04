import collections
import itertools
import random
import string
from typing import *
import yaml
import pathlib
import dataclasses
import datetime
import re
import warnings
import logging
import html
import pytz

from flask import Flask, request, abort, make_response

app = Flask(__name__)

logger = logging.getLogger(__file__)
logging.basicConfig(level=logging.DEBUG)

best_timezone = pytz.timezone('Europe/Warsaw')


def lesson_end(start: datetime.time) -> datetime.time:
    return (datetime.datetime.combine(datetime.date.today(), start) + datetime.timedelta(minutes=45)).time()


def process_transactions(transactions: str, n_students: int) -> List[int]:
    weights = [10] * n_students
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

    return weights


def generate_numbers(weights: List[int], n: int = 500) -> List[int]:
    weighted = tuple(itertools.chain(*([i] * weights[i] for i in range(len(weights))), range(len(weights), 40 + 1)))
    return list(random.choice(weighted) for _ in range(n))


def compress_numbers(numbers: List[int],
                     alphabet: str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzm0123456789+/"):
    assert all(0 <= x < len(alphabet) for x in numbers)
    return ''.join(alphabet[i] for i in numbers)


ClassId = NewType('ClassId', str)
UserId = NewType('UserId', str)
Client = NewType('Client', str)


class Class(NamedTuple):
    id: ClassId
    name: str
    weights: List[int]


class Lesson(NamedTuple):
    teached_class: Class
    start_time: datetime.time
    end_time: datetime.time


class User(NamedTuple):
    id: UserId
    name: str
    client: Client
    plan: List[List[Optional[Lesson]]]


@dataclasses.dataclass
class Block:
    numbers: List[int]
    lesson: Lesson
    sent: bool = False

    def __repr__(self):
        return f"Block(numbers=..., lesson={self.lesson}, sent={self.sent}"


users: List[User]
users_by_client: Dict[str, User]
planned_blocks: Dict[Tuple[datetime.date, Client], List[Block]] = {}


def load_blockchain():
    global users, users_by_client

    blockchain = yaml.load((pathlib.Path(__file__).parent / 'blockchain.yml').read_text())

    lesson_start_times = [datetime.time(*map(int, x.split(':'))) for x in blockchain['lesson-start-times']]
    logger.info(f"lesson_start_times: {lesson_start_times}")

    classes_by_id = {x['id']: Class(x['id'], x['name'], process_transactions(x['transactions'], x['n-students'])) for x
                     in blockchain['classes']}
    logger.info(f"classes_by_id: {classes_by_id}")

    def calculate_lessons(class_ids: List[Optional[ClassId]]):
        i = 0
        lessons = []
        while i < len(class_ids):
            if class_ids[i] is None:
                i += 1
                continue
            start = i
            while i < len(class_ids) and class_ids[i] == class_ids[start]:
                i += 1
            lessons.append(Lesson(classes_by_id[class_ids[start]], lesson_start_times[start],
                                  lesson_end(lesson_start_times[i - 1])))
        return lessons

    users = [User(x['id'], x['name'], x['client'], [calculate_lessons(y) for y in x['plan']]) for x in
             blockchain['users']]
    logger.info(f"users: {users}")

    users_by_client = {user.client: user for user in users}


def plan_blocks(date: datetime.date):
    if date.weekday() >= 5:
        return

    for user in users:
        blocks = []
        for lesson in user.plan[date.weekday()]:
            blocks.append(Block(generate_numbers(lesson.teached_class.weights), lesson))
        planned_blocks[date, user.client] = blocks


def find_block(moment: datetime.datetime, client: str) -> Optional[Block]:
    key = None
    for (m, c) in planned_blocks.keys():
        if m == moment.date():
            key = (m, c)
    if key is None:
        return None
    for block in planned_blocks[key]:
        if block.lesson.start_time <= moment.time() <= block.lesson.end_time:
            return block
    return None
    # if (moment.date(), client) not in planned_blocks.keys():
    #     return None
    # for block in planned_blocks[moment.date(), client]:
    #     if block.lesson.start_time <= moment.time() <= block.lesson.end_time:
    #         return block
    # return None


template = string.Template((pathlib.Path(__file__).parent / 'template.html').read_text(encoding='utf-8'))


@app.route('/')
def list_plans():
    items = []

    for (date, client), blocks in planned_blocks.items():
        user = users_by_client[client]
        for block in blocks:
            items.append(f'{html.escape(user.name)} <br> {date} {str(block.lesson.start_time)[:5]}-{str(block.lesson.end_time)[:5]}<ol>')
            items.extend(f'<li>{i + 1}</li>' for i in block.numbers)
            items.append(f'</ol>')

    items.append(f'time: {datetime.datetime.now(best_timezone)}')

    return template.substitute(items=' '.join(items))


@app.route('/help')
def list_blockchain():
    return (pathlib.Path(__file__).parent / 'blockchain.yml').read_text()


def generate_response(moment: datetime.datetime, client: str):
    block = find_block(moment, client)
    if block is None:
        return None

    return compress_numbers(block.lesson.teached_class.weights) + ' ' + compress_numbers(block.numbers)


@app.route('/get')
def get():
    auth = request.args.get('auth', '<wrong password>', str)
    client = request.args.get('client', '<undeclared>', str)

    if auth != "12345":  # TODO: Better password.
        return

    response = make_response(str(generate_response(datetime.datetime.now(best_timezone), client)))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


load_blockchain()
plan_blocks(datetime.date(2019, 3, 4))
plan_blocks(datetime.date(2019, 3, 5))
plan_blocks(datetime.date(2019, 3, 6))
plan_blocks(datetime.date(2019, 3, 7))
plan_blocks(datetime.date(2019, 3, 8))

logger.info(planned_blocks)
