import collections
import json
import random
import itertools
import traceback

from flask import Flask, request, abort

app = Flask(__name__)


weights = collections.defaultdict(lambda: 10)
weights.update({
    1 - 1: 2,
    19 - 1: 20,
    25 - 1: 50,
    27 - 1: 20
})
weighted = tuple(itertools.chain(*([i] * weights[i] for i in range(40))))


@app.route('/weighted')
def get_weighted():
    return json.dumps(weighted)


class CompletelyRandomSequence:
    def __init__(self, ideal_reservation=128):
        self.ideal_reservation = ideal_reservation

        self.next_numbers = []
        self.reserve(self.ideal_reservation)
        self.i = 0

    def reserve(self, n):
        while len(self.next_numbers) < n:
            self.next_numbers.append(random.choice(weighted))

    def get_next(self):
        self.reserve(self.ideal_reservation)
        x = self.next_numbers[0]
        self.next_numbers = self.next_numbers[1:]
        self.reserve(self.ideal_reservation)
        return x


class SequentiallyRandomSequence(CompletelyRandomSequence):
    def reserve(self, n):
        l = list(range(40))
        while len(self.next_numbers) < n:
            random.shuffle(l)
            self.next_numbers += l


completely_random = CompletelyRandomSequence()
sequentially_random = SequentiallyRandomSequence()


print(completely_random.next_numbers, len(completely_random.next_numbers))
print(sequentially_random.next_numbers, len(sequentially_random.next_numbers))


@app.route('/')
def hello_world():
    return (f"completely random: {completely_random.next_numbers}<br/>"
            f"sequential random: {sequentially_random.next_numbers}")


@app.route('/get')
def get():
    try:
        sequence = {'completely': completely_random, 'sequentially': sequentially_random}[request.args.get('how')]
        mask = request.args.get('whitelist', (1 << 40) - 1, int)
        assert mask > 0
        while True:
            x = sequence.get_next()
            if mask & (1 << x):
                return str(x)
    except Exception as e:
        traceback.print_exc()
        return f"<pre>{traceback.format_exc()}</pre>"
