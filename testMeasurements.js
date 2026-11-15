import {
  extractAmount,
  extractDuration,
} from "./measurementParser";

const amountTests = [
  ["My contractor owes me 5000 rupees", "en"],
  ["मुझे 2000 रुपये चाहिए", "hi"],
  ["నాకు 5000 రూపాయలు రావాలి", "te"],
  ["எனக்கு 2000 ரூபாய் வேண்டும்", "ta"],
  ["ನನಗೆ 3000 ರೂಪಾಯಿ ಬರಬೇಕು", "kn"],
  ["আমার ২০০০ টাকা পাওনা", "bn"],
];

const durationTests = [
  ["I haven't been paid for two weeks", "en"],
  ["दो हफ्ते से पैसे नहीं मिले", "hi"],
  ["రెండు వారాలుగా జీతం రాలేదు", "te"],
  ["இரண்டு வாரங்களாக சம்பளம் வரவில்லை", "ta"],
  ["ಎರಡು ವಾರಗಳಿಂದ ಸಂಬಳ ಬಂದಿಲ್ಲ", "kn"],
  ["দুই সপ্তাহ ধরে বেতন পাইনি", "bn"],
];

console.log("AMOUNT TESTS");

amountTests.forEach(([text, language]) => {
  console.log(text, "=>", extractAmount(text, language));
});

console.log("DURATION TESTS");

durationTests.forEach(([text, language]) => {
  console.log(text, "=>", extractDuration(text, language));
});