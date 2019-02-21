import random from "lodash/random";
import remove from "lodash/remove";
import max from "lodash/max";
import range from "lodash/range";
import find from "lodash/find";
import { weights, applyWeightsRule } from "./weights.js";

// These weights will be fetched from benevolent server.
function getWeighted(whitelist) {
  if (!applyWeightsRule(whitelist)) {
    return whitelist;
  }
  let weighted = [];
  for (let i of whitelist) {
    for (let j = 0; j < weights[i]; ++j) {
      weighted.push(i);
    }
  }
  return weighted;
}

// This block of code will be replaced by authoritarian server.
let global_last = [];
function nextRandom(whitelist) {
  if (whitelist.length > 2) {
    remove(whitelist, x => x === global_last[global_last.length - 1]);
  }

  const weighted = getWeighted(whitelist);
  global_last.push(weighted[random(0, weighted.length - 1)]);
  return global_last[global_last.length - 1];
}

let last = [];
let k = 0;
function nextSequentialRandom(whitelist) {
  const important = last.slice(last.length - k);
  const needs_reset = whitelist.every(x => important.indexOf(x) !== -1);
  if (needs_reset) k = 0;

  for (let i = last.length - k; i < last.length; ++i) {
    remove(whitelist, x => x === last[i]);
  }

  ++k;
  last.push(nextRandom(whitelist, last));
  return last[last.length - 1];
}

function generateNumber(whitelist, avoidRepetition) {
  return avoidRepetition
    ? nextSequentialRandom(whitelist)
    : nextRandom(whitelist);
}

export { generateNumber };
