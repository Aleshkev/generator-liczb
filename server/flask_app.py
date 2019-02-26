import collections
import random
import itertools
import string
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

alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzm0123456789+/"
compact_weights = ''.join(alphabet[weights[i]] for i in range(40))


class Sequence:
    def __init__(self, ideal_reservation=250):
        self.ideal_reservation = ideal_reservation

        self.next_numbers = []
        self.reserve(self.ideal_reservation)
        self.i = 0

    def reserve(self, n):
        while len(self.next_numbers) < n:
            self.next_numbers.append(random.choice(weighted))

    def get_next(self):
        self.i += 1
        self.reserve(self.ideal_reservation)
        x = self.next_numbers[0]
        self.next_numbers = self.next_numbers[1:]
        self.reserve(self.ideal_reservation)
        return x


sequence = Sequence()

template = string.Template("""
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: "Source Code Pro", "Courier New", Courier, monospace;
        padding: 16px;
        max-width: 346px;
        margin: auto;
      }
      ol {
        list-style: none;
        padding: 0;
        margin-top: 16px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 320px;
      }
      li {
        width: 32px;
      }
    </style>
  </head>
  <body>
    Liczby są brane po kolei; jeżeli użytkownik ma zaznaczoną opcję "unikaj
    powtórzeń" a liczba była wzięta ostatnio, jest pomijana.

    <ol>
      $items
    </ol>
  </body>
</html>
""")


@app.route('/')
def list_sequence():
    items = ['<li></li>'] * (sequence.i % 10)
    items.extend(f'<li>{i + 1}</li>' for i in sequence.next_numbers[:len(sequence.next_numbers) - sequence.i % 10])
    return template.substitute(items='\n'.join(items))


@app.route('/get')
def get():
    try:
        mask = request.args.get('whitelist', (1 << 40) - 1, int)
        assert 0 < mask < (1 << 40)
        while True:
            x = sequence.get_next()
            if mask & (1 << x):
                return f"{x};{compact_weights}"
    except Exception as e:
        traceback.print_exc()
        return f"<pre>{traceback.format_exc()}</pre>"
