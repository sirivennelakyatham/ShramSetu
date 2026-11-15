
// frontend/src/reportExtraction.js

import {
  REPORT_CATEGORIES,
  SHARED_FIELDS,
  UNPAID_WAGES_FIELDS,
  SAFETY_INJURY_FIELDS,
  ABUSE_EXPLOITATION_FIELDS,
  OTHER_FIELDS,
  ANSWER_STATUS,
  FIELD_SOURCES,
} from "./reportSchema";

import { extractAmount, extractDuration } from "./measurementParser";
import { extractNumber } from "./numberParser";

// ==================================================
// 1. CATEGORY KEYWORDS
// Initial rules-based detection.
// Multilingual coverage will be expanded and tested.
// ==================================================

const CATEGORY_KEYWORDS = {
  unpaid_wages: [
    "unpaid", "salary", "wages", "payment", "money owed",
    "not paid", "deduction", "pending salary",
    "वेतन", "मजदूरी", "पैसे नहीं मिले",
    "జీతం", "కూలి", "డబ్బులు రాలేదు",
    "சம்பளம்", "கூலி",
    "ಸಂಬಳ", "ಕೂಲಿ",
    "বেতন", "মজুরি",
  ],

  safety_injury: [
    "injury", "injured", "accident", "hurt", "bleeding",
    "unsafe", "safety", "fell", "fall", "hospital",
    "चोट", "दुर्घटना", "खतरा",
    "గాయం", "ప్రమాదం",
    "காயம்", "விபத்து",
    "ಗಾಯ", "ಅಪಘಾತ",
    "আঘাত", "দুর্ঘটনা",
  ],

  abuse_exploitation: [
    "abuse", "threat", "threatened", "beaten",
    "harassment", "forced", "locked", "confined",
    "documents taken", "phone taken",
    "धमकी", "मारपीट", "जबरदस्ती",
    "బెదిరింపు", "కొట్టారు",
    "மிரட்டல்", "துன்புறுத்தல்",
    "ಬೆದರಿಕೆ", "ಹಿಂಸೆ",
    "হুমকি", "নির্যাতন",
  ],

  other: [
    "water", "drinking water", "food", "accommodation",
    "housing", "working hours", "weekly rest",
    "पानी", "खाना", "रहने की जगह",
    "నీళ్లు", "ఆహారం", "వసతి",
    "தண்ணீர்", "உணவு", "தங்குமிடம்",
    "ನೀರು", "ಆಹಾರ", "ವಸತಿ",
    "জল", "খাবার", "থাকার জায়গা",
  ],
};


// ==================================================
// 2. CATEGORY DETECTION
// Multiple categories can be detected.
// ==================================================

export function detectReportCategories(text = "") {
  const normalized = text.toLowerCase();

  const detected = [];

  for (const [category, keywords] of Object.entries(
    CATEGORY_KEYWORDS
  )) {
    if (
      keywords.some((keyword) =>
        normalized.includes(keyword.toLowerCase())
      )
    ) {
      detected.push(category);
    }
  }

  return detected;
}


// ==================================================
// 3. FIELD METADATA
// Extracted information is NOT confirmed information.
// ==================================================

function makeExtractedField(
  value,
  source = FIELD_SOURCES.HEARD,
  confidence = "needs_worker_confirmation"
) {
  return {
    value,
    source,
    answer_status: ANSWER_STATUS.PROVIDED,
    confidence,
    verified: false,
    needs_confirmation: true,
  };
}


// ==================================================
// 4. CATEGORY FIELD REGISTRY
// ==================================================

const CATEGORY_FIELDS = {
  [REPORT_CATEGORIES.UNPAID_WAGES]: UNPAID_WAGES_FIELDS,
  [REPORT_CATEGORIES.SAFETY_INJURY]: SAFETY_INJURY_FIELDS,
  [REPORT_CATEGORIES.ABUSE_EXPLOITATION]:
    ABUSE_EXPLOITATION_FIELDS,
  [REPORT_CATEGORIES.OTHER]: OTHER_FIELDS,
};


// ==================================================
// 5. COPY EXPLICIT QUESTION ANSWERS
// Answers are more reliable than keyword guesses.
// ==================================================

function copyAnswers(answers = {}) {
  const result = {};

  for (const [field, answer] of Object.entries(answers)) {
    if (
      answer === null ||
      answer === undefined ||
      answer === ""
    ) {
      continue;
    }

    if (typeof answer === "object" && !Array.isArray(answer)) {
      const status = answer.answer_status;

      if (
        status === ANSWER_STATUS.SKIPPED ||
        status === ANSWER_STATUS.PREFER_NOT_TO_SAY ||
        status === ANSWER_STATUS.NOT_ASKED
      ) {
        result[field] = {
          ...answer,
          verified: false,
        };
        continue;
      }

      if (status === ANSWER_STATUS.UNKNOWN) {
        result[field] = {
          ...answer,
          verified: false,
        };
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(answer, "value")) {
        result[field] = {
          ...answer,
          source: answer.source || FIELD_SOURCES.ANSWERED,
          verified: false,
          needs_confirmation: true,
        };
        continue;
      }
    }

    result[field] = makeExtractedField(
      answer,
      FIELD_SOURCES.ANSWERED
    );
  }

  return result;
}


// ==================================================
// 6. EXTRACT NUMERIC AND MEASUREMENT INFORMATION
// ==================================================

function extractMeasurements(text, language) {
  const result = {};

  const amount = extractAmount(text, language);

  if (amount) {
    result.detected_amount = makeExtractedField(amount.value);
  }

  const duration = extractDuration(text, language);

  if (duration) {
    result.detected_duration_days =
      makeExtractedField(duration.days);
  }

  const number = extractNumber(text, language);

  if (number !== null && number !== undefined) {
    result.detected_number = makeExtractedField(number);
  }

  return result;
}


// ==================================================
// 7. EXTRACT CATEGORY-SPECIFIC DETAILS
// This stage uses explicit answers and measurements.
// It does not guess names, events or sensitive details.
// ==================================================

function extractCategoryDetails(
  category,
  text,
  language,
  answers
) {
  const categoryAnswers = copyAnswers(answers);

  const measurements = extractMeasurements(text, language);

  const allowedFields = CATEGORY_FIELDS[category] || {};

  const extracted = {};

  // Include only fields belonging to this category.
  for (const field of Object.keys(allowedFields)) {
    if (categoryAnswers[field]) {
      extracted[field] = categoryAnswers[field];
    }
  }

  // Keep numeric clues separate until their meaning is clear.
  extracted._measurement_clues = measurements;

  // Preserve the original text as evidence.
  extracted._original_description = makeExtractedField(text);

  return extracted;
}


// ==================================================
// 8. FIND MISSING INFORMATION
// Missing fields are suggestions for follow-up questions.
// They are NOT automatically treated as negative answers.
// ==================================================

function findMissingFields(category, extractedFields = {}) {
  const allowedFields = CATEGORY_FIELDS[category] || {};

  const missing = [];

  for (const field of Object.keys(allowedFields)) {
    const value = extractedFields[field];

    if (!value) {
      missing.push(field);
      continue;
    }

    if (
      typeof value === "object" &&
      (
        value.answer_status === ANSWER_STATUS.UNKNOWN ||
        value.answer_status === ANSWER_STATUS.SKIPPED ||
        value.answer_status === ANSWER_STATUS.PREFER_NOT_TO_SAY
      )
    ) {
      continue;
    }
  }

  return missing;
}


// ==================================================
// 9. MAIN EXTRACTION FUNCTION
// ==================================================

export function extractReportInformation({
  text = "",
  language = "en",
  category = null,
  answers = {},
} = {}) {
  const originalText = text.trim();

  const detectedCategories =
    detectReportCategories(originalText);

  const categories = [
    ...new Set([
      ...(category ? [category] : []),
      ...detectedCategories,
    ]),
  ];

  const primaryCategory =
    category || categories[0] || null;

  const secondaryCategories = categories.filter(
    (item) => item !== primaryCategory
  );

  const sharedAnswers = {};

  const sharedAnswerValues = copyAnswers(answers);

  for (const field of Object.keys(SHARED_FIELDS)) {
    if (sharedAnswerValues[field]) {
      sharedAnswers[field] = sharedAnswerValues[field];
    }
  }

  const categoryDetails = {};

  for (const currentCategory of categories) {
    categoryDetails[currentCategory] =
      extractCategoryDetails(
        currentCategory,
        originalText,
        language,
        answers
      );
  }

  const missingInformation = primaryCategory
    ? findMissingFields(
        primaryCategory,
        categoryDetails[primaryCategory] || {}
      )
    : [];

  return {
    language,

    original_text: originalText,

    detected_categories: categories,

    primary_category: primaryCategory,

    secondary_categories: secondaryCategories,

    shared_fields: sharedAnswers,

    category_details: categoryDetails,

    missing_information: missingInformation,

    requires_worker_review: true,

    extraction_status: originalText
      ? "completed"
      : "no_input",

    worker_confirmed: false,
  };
}


// ==================================================
// 10. PREPARE FIELDS FOR WORKER REVIEW
// ==================================================

export function prepareFieldsForReview(fields = {}) {
  const result = {};

  for (const [field, data] of Object.entries(fields)) {
    if (
      data &&
      typeof data === "object" &&
      Object.prototype.hasOwnProperty.call(data, "value")
    ) {
      result[field] = {
        ...data,
        verified: false,
        needs_confirmation: true,
      };
    } else {
      result[field] = makeExtractedField(data);
    }
  }

  return result;
}


// ==================================================
// 11. CONFIRM A FIELD
// Only call this after the worker reviews the value.
// ==================================================

export function confirmExtractedField(field, correctedValue) {
  return {
    value: correctedValue,
    source: FIELD_SOURCES.ANSWERED,
    answer_status: ANSWER_STATUS.PROVIDED,
    confidence: "worker_confirmed",
    verified: true,
    needs_confirmation: false,
  };
}