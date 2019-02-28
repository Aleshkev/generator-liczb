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

// Because in-browser random number generator isn't perfect, we outsource the job of generating random numbers overseas.
function download(sequence) {
  get("https://generatorliczb.pythonanywhere.com/get", {
    params: {
      auth: "12345",
      client: navigator.userAgent
    }
  })
    .then(response => {
      console.log(response);

      const [x, y] = response.data.split(" ");
      const weights = decompress_numbers(x);
      const next = decompress_numbers(y);

      sequence.setWeights(weights);
      sequence.setNext(next);
    })
    .catch(error => {
      console.error(error);
    })
    .then(() => {
      console.log("finished");
    });
}

export default download;
