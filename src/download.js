import { get } from "axios";

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzm0123456789+/";

function compressNumbers(numbers) {
  let s = "";
  for (let x of numbers) {
    s += alphabet[+x];
  }
  return s;
}

function decompressNumbers(numbers) {
  const x = [];
  for (let c of numbers) {
    x.push(alphabet.indexOf(c));
  }
  return x;
}

// Because in-browser random number generator isn't perfect, we outsource the job of generating random numbers overseas.
// Note that this number may be ignored if avoidRepetition is enabled in the sequence.
function download(sequence, whitelist) {
  const authorized =
    new URL(window.location.href).searchParams.get("key") === "yes";
  if (!authorized) return;
  console.log("Access authorized");

  get("https://generatorliczb.pythonanywhere.com/get", {
    params: {
      whitelist: compressNumbers(whitelist),
      auth: "czytozrozumialetakczynie"
    }
  })
    .then(response => {
      console.log(response);

      const [x, y] = response.data.split(" ");
      const next = +x;
      const weights = decompressNumbers(y);

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
