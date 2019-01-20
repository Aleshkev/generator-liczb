import random from "lodash";

function generateNumber(whitelist, last, weights, avoidRepetition) {
  if (whitelist.length <= 2) {
    // Note: weights are ignored when there are only two elements (too easy to notice).
    return whitelist[random(0, whitelist.length - 1)];
  }

  let weighted = [];
  for (let i of whitelist) {
    for (let j = 0; j < weights[i]; ++j) {
      weighted.push(i);
    }
  }

  const x = weighted[Math.floor(Math.random() * weighted.length)];

  return x;
}

export default generateNumber;
