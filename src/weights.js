let weights = {
  1: 1,
  25: 200
};
for (let i = 1; i <= 40; ++i) {
  if (weights[i] === undefined) weights[i] = 100;
}

export default weights;
