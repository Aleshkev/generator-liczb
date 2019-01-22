let weights = {
  1: 20,
  25: 400,
  19: 200,
  27: 200
};
for (let i = 1; i <= 40; ++i) {
  if (weights[i] === undefined) weights[i] = 100;
}

export default weights;
