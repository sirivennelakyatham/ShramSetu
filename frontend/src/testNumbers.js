import {
  parseNumber,
  extractNumber,
} from "./numberParser";

const tests = [
  ["two hundred", "en"],
  ["two thousand", "en"],
  ["twenty five", "en"],
  ["दो हजार", "hi"],
  ["రెండు వేలు", "te"],
  ["இரண்டு ஆயிரம்", "ta"],
  ["ಎರಡು ಸಾವಿರ", "kn"],
  ["দুই হাজার", "bn"],
];

console.log("NUMBER PARSER TESTS");

tests.forEach(([text, language]) => {
  console.log(
    text,
    "=>",
    parseNumber(text, language)
  );
});

console.log(
  "Sentence test:",
  extractNumber(
    "My contractor owes me 8000 rupees",
    "en"
  )
);