import { get } from "axios";

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzm0123456789+/";

function decompress_numbers(numbers) {
  const x = [];
  for (let c of numbers) {
    x.push(alphabet.indexOf(c));
  }
  return x;
}

function compressWhitelist(whitelist) {
  let x = 0;
  for (let i = 0; i < 40; ++i) {
    if (whitelist[i]) x |= 1 << i;
  }
  return x;
}

// Because in-browser random number generator isn't perfect, we outsource the job of generating random numbers overseas.
function download(sequence, whitelist) {
  get("https://generatorliczb.pythonanywhere.com/get", {
    params: {
      whitelist: compressWhitelist(whitelist),
      auth: "12345"
    }
  })
    .then(response => {
      console.log(response);

      const [x, y] = response.data.split(" ");
      const next = +x;
      const weights = decompress_numbers(y);

      sequence.next[0] = next;
      console.log(sequence.next);
      sequence.setWeights(weights);
    })
    .catch(error => {
      console.error(error);
    })
    .then(() => {
      console.log("finished");
    });
}

export default download;
