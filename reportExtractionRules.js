// frontend/src/reportExtractionRules.js

// ==================================================
// 1. TEXT NORMALISATION
// ==================================================

export function normalizeDescription(text = "") {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[.,!?;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ==================================================
// 2. MULTILINGUAL KEYWORD MATCHING
// Initial vocabulary; expand after native-language testing.
// ==================================================

const RULES = {
  unpaid_wages: {
    amount_owed: {
      en: ["owed", "pending wages", "unpaid wages", "salary not received"],
      hi: ["पैसे नहीं मिले", "मजदूरी नहीं मिली"],
      te: ["డబ్బులు రాలేదు", "కూలి రాలేదు"],
      ta: ["சம்பளம் வரவில்லை", "கூலி கிடைக்கவில்லை"],
      kn: ["ಸಂಬಳ ಬಂದಿಲ್ಲ", "ಕೂಲಿ ಸಿಕ್ಕಿಲ್ಲ"],
      bn: ["বেতন পাইনি", "মজুরি পাইনি"],
    },
    unfair_deductions: {
      en: ["deducted", "cut from my wages", "salary cut"],
      hi: ["पैसे काटे", "मजदूरी काटी"],
      te: ["డబ్బులు కట్ చేశారు"],
      ta: ["பணம் பிடித்தம்"],
      kn: ["ಹಣ ಕಡಿತ"],
      bn: ["টাকা কেটে নিয়েছে"],
    },
  },

  safety_injury: {
    injured: {
      en: ["injured", "hurt", "got hurt", "got injured"],
      hi: ["चोट लगी", "घायल"],
      te: ["గాయమైంది", "దెబ్బ తగిలింది"],
      ta: ["காயம் ஏற்பட்டது"],
      kn: ["ಗಾಯವಾಯಿತು"],
      bn: ["আঘাত পেয়েছি"],
    },
    workplace_still_dangerous: {
      en: ["still dangerous", "unsafe workplace", "dangerous site"],
      hi: ["अभी भी खतरा", "काम की जगह असुरक्षित"],
      te: ["ఇంకా ప్రమాదం", "పని ప్రదేశం సురక్షితం కాదు"],
      ta: ["இன்னும் ஆபத்து"],
      kn: ["ಇನ್ನೂ ಅಪಾಯ"],
      bn: ["এখনও বিপদ"],
    },
  },

  abuse_exploitation: {
    confinement: {
      en: ["locked me in", "not allowed to leave", "prevented me from leaving"],
      hi: ["बाहर जाने नहीं दिया", "बंद कर दिया"],
      te: ["బయటకు వెళ్లనివ్వలేదు", "బంధించారు"],
      ta: ["வெளியே செல்ல விடவில்லை"],
      kn: ["ಹೊರಗೆ ಹೋಗಲು ಬಿಡಲಿಲ್ಲ"],
      bn: ["বাইরে যেতে দেয়নি"],
    },
    identity_documents_withheld: {
      en: ["kept my documents", "took my documents", "passport taken"],
      hi: ["दस्तावेज रख लिए", "कागजात ले लिए"],
      te: ["పత్రాలు తీసుకున్నారు"],
      ta: ["ஆவணங்களை எடுத்துக்கொண்டார்கள்"],
      kn: ["ದಾಖಲೆಗಳನ್ನು ತೆಗೆದುಕೊಂಡರು"],
      bn: ["কাগজপত্র নিয়ে নিয়েছে"],
    },
    phone_withheld: {
      en: ["took my phone", "kept my phone"],
      hi: ["फोन ले लिया", "मोबाइल रख लिया"],
      te: ["ఫోన్ తీసుకున్నారు"],
      ta: ["தொலைபேசியை எடுத்துக்கொண்டார்கள்"],
      kn: ["ಫೋನ್ ತೆಗೆದುಕೊಂಡರು"],
      bn: ["ফোন নিয়ে নিয়েছে"],
    },
    threats_of_violence: {
      en: ["threatened to hurt me", "threatened to kill me"],
      hi: ["जान से मारने की धमकी", "मारने की धमकी"],
      te: ["చంపేస్తానని బెదిరించారు"],
      ta: ["கொலை மிரட்டல்"],
      kn: ["ಕೊಲೆ ಬೆದರಿಕೆ"],
      bn: ["মেরে ফেলার হুমকি"],
    },
  },

  other: {
    problem_subtype: {
      en: ["no drinking water", "no food", "no accommodation", "no weekly rest"],
      hi: ["पीने का पानी नहीं", "खाना नहीं", "रहने की जगह नहीं"],
      te: ["తాగునీరు లేదు", "ఆహారం లేదు", "వసతి లేదు"],
      ta: ["குடிநீர் இல்லை", "உணவு இல்லை"],
      kn: ["ಕುಡಿಯುವ ನೀರಿಲ್ಲ", "ಆಹಾರವಿಲ್ಲ"],
      bn: ["পানীয় জল নেই", "খাবার নেই"],
    },
  },
};


// ==================================================
// 3. MATCH EXPLICIT PHRASES
// ==================================================

export function findExplicitMatches(text, language = "en") {
  const normalized = normalizeDescription(text);
  const matches = {};

  for (const [category, fields] of Object.entries(RULES)) {
    for (const [field, languages] of Object.entries(fields)) {
      const phrases = languages[language] || [];

      const found = phrases.some((phrase) =>
        normalized.includes(normalizeDescription(phrase))
      );

      if (found) {
        if (!matches[category]) {
          matches[category] = {};
        }

        matches[category][field] = {
          value: true,
          matched_phrase: phrases.find((phrase) =>
            normalized.includes(normalizeDescription(phrase))
          ),
          verified: false,
          needs_confirmation: true,
        };
      }
    }
  }

  return matches;
}


// ==================================================
// 4. EXTRACT MULTIPLE CATEGORY DETAILS
// ==================================================

export function extractExplicitDetails(text, language = "en") {
  return {
    original_text: text,
    matches: findExplicitMatches(text, language),
    requires_worker_review: true,
  };
}