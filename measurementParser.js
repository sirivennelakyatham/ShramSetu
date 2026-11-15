// frontend/src/measurementParser.js

import {
  extractNumber,
  normalizeDigits,
} from "./numberParser";


// =====================================================
// 1. CURRENCY WORDS
// =====================================================

const CURRENCY_WORDS = {
  en: ["rupee", "rupees", "rs", "inr"],
  hi: ["रुपया", "रुपये", "रुपए", "रुपयों"],
  te: ["రూపాయి", "రూపాయలు", "రూపాయల"],
  ta: ["ரூபாய்", "ரூபாய்கள்"],
  kn: ["ರೂಪಾಯಿ", "ರೂಪಾಯಿಗಳು"],
  bn: ["টাকা", "রুপি", "রুপী"],
};


// =====================================================
// 2. DURATION UNITS
// Values are approximate days.
// =====================================================

const DURATION_UNITS = {
  en: {
    day: 1,
    days: 1,
    week: 7,
    weeks: 7,
    month: 30,
    months: 30,
    year: 365,
    years: 365,
  },

  hi: {
    "दिन": 1,
    "दिनों": 1,
    "हफ्ता": 7,
    "हफ्ते": 7,
    "हफ्तों": 7,
    "सप्ताह": 7,
    "सप्ताहों": 7,
    "महीना": 30,
    "महीने": 30,
    "महीनों": 30,
    "साल": 365,
    "वर्ष": 365,
  },

  te: {
    "రోజు": 1,
    "రోజులు": 1,
    "వారము": 7,
    "వారం": 7,
    "వారాలు": 7,
    "వారాలుగా": 7,
    "వారాల": 7,
    "నెల": 30,
    "నెలలు": 30,
    "నెలలుగా": 30,
    "సంవత్సరం": 365,
    "సంవత్సరాలు": 365,
  },

  ta: {
    "நாள்": 1,
    "நாட்கள்": 1,
    "வாரம்": 7,
    "வாரங்கள்": 7,
    "வாரங்களாக": 7,
    "மாதம்": 30,
    "மாதங்கள்": 30,
    "மாதங்களாக": 30,
    "ஆண்டு": 365,
    "ஆண்டுகள்": 365,
  },

  kn: {
    "ದಿನ": 1,
    "ದಿನಗಳು": 1,
    "ವಾರ": 7,
    "ವಾರಗಳು": 7,
    "ವಾರಗಳಿಂದ": 7,
    "ತಿಂಗಳು": 30,
    "ತಿಂಗಳುಗಳು": 30,
    "ವರ್ಷ": 365,
    "ವರ್ಷಗಳು": 365,
  },

  bn: {
    "দিন": 1,
    "দিনগুলো": 1,
    "সপ্তাহ": 7,
    "সপ্তাহগুলো": 7,
    "মাস": 30,
    "মাসগুলো": 30,
    "বছর": 365,
    "বছরগুলো": 365,
  },
};


// =====================================================
// 3. TEXT TOKENISATION
// Keep consistent with numberParser.js.
// =====================================================

function getTokens(text) {
  const normalized = normalizeDigits(
    String(text || "").normalize("NFC")
  )
    .toLowerCase()
    .replace(/[₹,]/g, " ")
    .replace(/-/g, " ");

  return normalized.match(
    /[\p{L}\p{M}\p{N}]+(?:\.[\p{N}]+)?/gu
  ) || [];
}


// =====================================================
// 4. EXTRACT AMOUNT
// =====================================================

export function extractAmount(text, language = "en") {
  if (!text) return null;

  const tokens = getTokens(text);

  const currencyWords = CURRENCY_WORDS[language] || [];

  const hasCurrencySymbol =
    /₹|\b(?:inr|rs\.?)\b/i.test(text);

  const hasCurrencyWord = tokens.some(token =>
    currencyWords.includes(token)
  );

  if (!hasCurrencySymbol && !hasCurrencyWord) {
    return null;
  }

  const number = extractNumber(text, language);

  if (!number) return null;

  return {
    value: number.value,
    currency: "INR",
    original_expression: number.phrase,
    confidence: "needs_worker_confirmation",
  };
}


// =====================================================
// 5. EXTRACT DURATION
// =====================================================

export function extractDuration(text, language = "en") {
  if (!text) return null;

  const tokens = getTokens(text);

  const units = DURATION_UNITS[language] || {};

  const number = extractNumber(text, language);

  if (!number) return null;

  // Find the duration unit immediately after the number.
  const unitToken = tokens[number.end];

  if (!unitToken) return null;

  if (!Object.prototype.hasOwnProperty.call(units, unitToken)) {
    return null;
  }

  const multiplier = units[unitToken];

  return {
    original_value: number.value,
    original_unit: unitToken,
    days: number.value * multiplier,
    confidence: "needs_worker_confirmation",
  };
}