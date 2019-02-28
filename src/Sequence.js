import random from "lodash/random";
import range from "lodash/range";
import sumBy from "lodash/sumBy";

class Sequence {
  constructor() {
    this.weighted = range(40);
    this.next = [];

    this.lastRegular = [];

    this.k = 0;
    this.lastWithoutRepetition = [];
  }
  reserve() {
    const n = 20;

    while (this.next.length < n) {
      this.next.push(this.weighted[random(0, this.weighted.length - 1)]);
    }

    // This may fetch numbers from server for true randomness.
  }

  // Get a single number, no whitelist.
  _get() {
    if (this.next.length < 1) this.reserve();

    const x = this.next[0];
    this.next = this.next.slice(1);
    return x;
  }

  // Get a number, strictly following the whitelist, repetitions possible.
  get(whitelist) {
    if (sumBy(whitelist) === 0 || whitelist.length != 40)
      throw new Error("Invalid whitelist");

    console.log(whitelist, this.next);

    for (;;) {
      const x = this._get();
      if (whitelist[x]) return x;
    }
  }

  // Get a number, following the whitelist, no two numbers in a row will be the same (unless whitelist.length < 3).
  getRegular(whitelist) {
    whitelist = whitelist.slice();

    // If there are less than 3 elements, we can't remove anything from whitelist without fixing the result.
    if (sumBy(whitelist) < 3) return this.get(whitelist);

    const last = this.lastRegular;

    // Remove last number from whitelist.
    whitelist[last[last.length - 1]] = false;

    last.push(this.get(whitelist));
    return last[last.length - 1];
  }

  // Get a number, following the whitelist, cycles through all numbers before any repeat. Falls back to getRegular() in corner cases.
  getWithoutRepetition(whitelist) {
    whitelist = whitelist.slice();

    const last = this.lastWithoutRepetition;
    const important = last.slice(last.length - this.k);

    // If we cycled through all numbers, start from beginning.
    if (whitelist.every((x, i) => !x || important.indexOf(i) !== -1)) {
      this.k = 0;
    }

    // Don't choose numbers already chosen in this cycle.
    for (let i = last.length - this.k; i < last.length; ++i) {
      whitelist[last[i]] = false;
    }

    ++this.k;

    last.push(this.getRegular(whitelist));
    return last[last.length - 1];
  }
}

const sequence = new Sequence();

export default sequence;
