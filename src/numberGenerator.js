import random from "lodash/random";
import remove from "lodash/remove";
import max from "lodash/max";
import range from "lodash/range";
import { weights, applyWeightsRule } from "./weights.js";

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

function nextRandom(whitelist, last) {
  if (whitelist.length > 2) {
    remove(whitelist, x => x === last[last.length - 1]);
  }

  const weighted = getWeighted(whitelist);
  return weighted[random(0, weighted.length - 1)];
}

let planned = [],
  take = 0;
function nextSequentialRandom(whitelist, last) {
  // This function when one planned list ends and another one begins, occasionally return the same value twice in a row.
  // However, this is a quite rare case and hopefully nobody cares.

  while (take < planned.length && whitelist.indexOf(planned[take]) === -1)
    ++take;
  if (take < planned.length) return planned[take++];

  const weighted = getWeighted(range(1, 40 + 1));
  planned = [];
  while (weighted.length > 0) {
    let i = weighted[random(0, weighted.length - 1)];
    remove(weighted, x => x === i);
    planned.push(i);
  }

  console.log("planned:", planned);

  take = 0;
  return nextSequentialRandom(whitelist);
}

function generateNumber(whitelist, last, avoidRepetition) {
  return avoidRepetition
    ? nextSequentialRandom(whitelist, last)
    : nextRandom(whitelist, last);
}

export { generateNumber };
