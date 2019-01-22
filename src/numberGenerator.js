import { random, remove } from "lodash";

function generateNumber(whitelist, last, weights, avoidRepetition) {
  if (whitelist.length > 2) {
    remove(whitelist, x => x == last[last.length - 1]);
  }

  if (whitelist.length <= 4) {
    // Note: weights are ignored when there are only few elements (too easy to notice).

    return whitelist[random(0, whitelist.length - 1)];
  }

  let weighted = [];
  for (let i of whitelist) {
    for (let j = 0; j < weights[i]; ++j) {
      weighted.push(i);
    }
  }

  const x = weighted[random(0, weighted.length - 1)];

  return x;
}

export default generateNumber;
