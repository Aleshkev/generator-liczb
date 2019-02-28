import random from "lodash/random";
import range from "lodash/range";
import sumBy from "lodash/sumBy";
import remove from "lodash/remove";
import download from "./download.js";

class Sequence {
  constructor() {
    this.weighted = range(40);
    this.backupWeighted = this.weighted.slice();
    this.next = [];

    this.lastRegular = [];

    this.k = 0;
    this.lastWithoutRepetition = [];

    // Fetch numbers from the server.
    download(this);
  }

  setWeights(weights) {
    this.weighted = [];
    // TODO: Now when I think about it, a weight of 0 may crash something.
    for (let i = 0; i < 40; ++i) {
      for (let j = 0; j < weights[i]; ++j) {
        this.weighted.push(i);
      }
    }
    console.log(this.weighted);
  }

  setNext(numbers) {
    this.next = numbers.slice();
  }

  reserve() {
    const n = 20;

    while (this.next.length < n) {
      this.next.push(this.weighted[random(0, this.weighted.length - 1)]);
    }
  }

  // Get a single number, no whitelist.
  _get() {
    if (this.next.length < 1) this.reserve();

    const x = this.next[0];
    this.next = this.next.slice(1);
    return x;
  }

  // Get a number, strictly following the whitelist.
  // No state saved between calls.
  get(whitelist) {
    if (sumBy(whitelist) === 0 || whitelist.length !== 40)
      throw new Error("Invalid whitelist");

    for (;;) {
      const x = this._get();
      if (whitelist[x]) return x;
    }
  }

  // Get a number, strictly following the whitelist.
  // No state saved between calls.
  // Uses back up whitelist, in case regular whitelist is corrupted or get() fails.
  getFromBackup(whitelist) {
    const weighted = this.backupWeighted.slice();
    remove(weighted, x => !whitelist[x]);
    return weighted[random(0, weighted.length - 1)];
  }

  // Get a number, following the whitelist.
  // No two numbers in a row will be the same (except in corner cases).
  getRegular(whitelist) {
    whitelist = whitelist.slice();

    // If there are less than 3 elements, we can't skip anything without fixing the result.
    // Also, this doesn't save the chosen number.
    if (sumBy(whitelist) < 3) return this.getFromBackup(whitelist);

    const last = this.lastRegular;

    // Don't choose last number.
    whitelist[last[last.length - 1]] = false;

    let x;
    if (sumBy(whitelist) < 5 || whitelist.lastIndexOf(true) >= 29) {
      x = this.getFromBackup(whitelist);
    } else {
      x = this.get(whitelist);
    }
    last.push(x);
    return x;
  }

  // Get a number, following the whitelist.
  // Cycles through all numbers before any repeat.
  // Falls back to getRegular() in corner cases.
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

    let x = this.getRegular(whitelist);
    last.push(x);
    return x;
  }
}

const sequence = new Sequence();

export default sequence;
