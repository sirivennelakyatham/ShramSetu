import {
  NUMBER_WORDS,
  normalizeText,
} from "./languagePatterns";


// =====================================================
// 1. NORMALISE INDIAN LANGUAGE DIGITS
// =====================================================

const DIGIT_RANGES = [
  0x0966, // Devanagari (Hindi)
  0x09E6, // Bengali
  0x0C66, // Telugu
  0x0BE6, // Tamil
  0x0CE6, // Kannada
];

export function normalizeDigits(text) {
  return [...String(text)].map(char => {
    const code = char.codePointAt(0);

    for (const start of DIGIT_RANGES) {
      if (code >= start && code <= start + 9) {
        return String(code - start);
      }
    }

    return char;
  }).join("");
}


// =====================================================
// 2. TOKENISE TEXT
// Include Unicode combining marks (\p{M}).
// =====================================================

function tokenize(text) {
  return (
    normalizeDigits(String(text).normalize("NFC"))
      .toLowerCase()
      .match(/[\p{L}\p{M}\p{N}]+(?:\.[\p{N}]+)?/gu) || []
  );
}


// =====================================================
// 3. PARSE A NUMBER PHRASE
// =====================================================

export function parseNumber(text, language = "en") {
  if (!text) return null;

  const dictionary = NUMBER_WORDS[language];

  if (!dictionary) return null;

  const normalized = normalizeText(
    normalizeDigits(text).replace(/-/g, " ")
  );

  const tokens = normalized.split(/\s+/).filter(Boolean);

  if (!tokens.length) return null;

  let total = 0;
  let current = 0;
  let foundNumber = false;

  for (const token of tokens) {

    // Numeric digits: 25, 2000, 500.50
    if (/^\d+(\.\d+)?$/.test(token)) {
      current += Number(token);
      foundNumber = true;
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(dictionary, token)) {
      return null;
    }

    const value = dictionary[token];

    foundNumber = true;

    if (value === 100) {
      current = (current || 1) * 100;
      continue;
    }

    if (value === 1000) {
      total += (current || 1) * 1000;
      current = 0;
      continue;
    }

    current += value;
  }

  if (!foundNumber) return null;

  return total + current;
}


// =====================================================
// 4. EXTRACT A NUMBER FROM A COMPLETE SENTENCE
// Keep the longest valid number phrase.
// =====================================================

export function extractNumber(text, language = "en") {
  if (!text) return null;

  const tokens = tokenize(text);

  if (!tokens.length) return null;

  let bestMatch = null;

  for (let start = 0; start < tokens.length; start++) {

    for (let end = start + 1; end <= tokens.length; end++) {

      const phrase = tokens.slice(start, end).join(" ");

      const value = parseNumber(phrase, language);

      if (value !== null) {

        const currentLength = end - start;

        const bestLength = bestMatch
          ? bestMatch.end - bestMatch.start
          : 0;

        if (!bestMatch || currentLength > bestLength) {
          bestMatch = {
            value,
            phrase,
            start,
            end,
          };
        }
      }
    }
  }

  return bestMatch;
}