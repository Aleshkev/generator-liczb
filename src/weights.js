import max from "lodash/max";

const weights = {
  1: 20,
  25: 500,
  19: 200,
  27: 200
};
for (let i = 1; i <= 40; ++i) {
  if (weights[i] === undefined) weights[i] = 100;
}

// There are 29 people in our class.
// When there are under 5 people, it's too easy to notice.
const applyWeightsRule = whitelist =>
  whitelist.length > 4 && max(whitelist) <= 29;

export { weights, applyWeightsRule };
