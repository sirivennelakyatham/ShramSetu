
const FIELD_KEYS = [
  "worksite_area", "responsible_person", "responsible_person_role",
  "number_affected", "immediate_danger", "amount_owed", "daily_wage",
  "days_unpaid", "payment_frequency", "previously_requested_payment",
  "unfair_deductions", "deduction_amount", "incident_description",
  "injured", "injury_description", "medical_treatment_received",
  "employer_informed", "safety_equipment_provided",
  "workplace_still_dangerous", "witnesses_present", "currently_safe",
  "abuse_type", "person_involved", "repeated_incident", "confinement",
  "identity_documents_withheld", "phone_withheld", "forced_work",
  "threats_of_violence", "sexual_harassment", "problem_subtype",
  "problem_description", "duration","incident_date",
];

const translations = {
  en: {
    categories: [
      "Unpaid wages or unfair deductions", "Workplace safety or injury",
      "Abuse or exploitation", "Other workplace problem",
    ],
    labels: [
      "Worksite area", "Person responsible", "Responsible person's role",
      "Workers affected", "Immediate danger", "Amount owed", "Daily wage",
      "Days without payment", "Payment frequency",
      "Payment previously requested", "Unfair deductions",
      "Deduction amount", "What happened", "Worker injured",
      "Injury details", "Medical treatment", "Employer informed",
      "Safety equipment", "Workplace still dangerous", "Witnesses present",
      "Currently safe", "Type of abuse", "Person involved",
      "Repeated incident", "Confinement", "Identity documents withheld",
      "Phone withheld", "Forced to work", "Threats of violence",
      "Sexual harassment", "Problem type", "Problem description", "Duration","incident_date",
    ],
    yes: "Yes", no: "No", unknown: "Don't know",
    prefer: "Prefer not to say", skipped: "Skipped",
    title: "Your report summary", reported: "You reported:",
    details: "Here are the details you provided:",
    empty: "No additional details have been provided yet.",
    unanswered: "Some questions were skipped or their answers are unknown. These details have not been assumed.",
    disclaimer: "This is a summary prepared by ShramSetu. It is not an official government complaint.",
    workplace: "Workplace problem",
  },

  te: {
    categories: [
      "చెల్లించని వేతనాలు లేదా అన్యాయమైన కోతలు",
      "పని ప్రదేశ భద్రత లేదా గాయం",
      "వేధింపులు లేదా దోపిడీ",
      "ఇతర పని ప్రదేశ సమస్య",
    ],
    labels: [
      "పని ప్రదేశం", "బాధ్యుడు", "బాధ్యుడి పాత్ర",
      "ప్రభావితమైన కార్మికులు", "తక్షణ ప్రమాదం", "బకాయి మొత్తం",
      "రోజువారీ వేతనం", "వేతనం అందని రోజులు", "చెల్లింపు తరచుదనం",
      "చెల్లింపు గురించి ముందుగా అడిగారా", "అన్యాయమైన కోతలు",
      "కోత మొత్తం", "ఏం జరిగింది", "కార్మికుడికి గాయమైందా",
      "గాయం వివరాలు", "వైద్య చికిత్స", "యజమానికి తెలిపారా",
      "భద్రతా పరికరాలు", "పని ప్రదేశంలో ఇంకా ప్రమాదం ఉందా",
      "సాక్షులు ఉన్నారా", "ప్రస్తుతం సురక్షితంగా ఉన్నారా",
      "వేధింపుల రకం", "సంబంధిత వ్యక్తి", "మళ్లీ జరిగిన సంఘటన",
      "నిర్బంధం", "గుర్తింపు పత్రాలు నిలిపివేశారా",
      "ఫోన్ నిలిపివేశారా", "బలవంతంగా పని చేయించారా",
      "హింస బెదిరింపులు", "లైంగిక వేధింపులు",
      "సమస్య రకం", "సమస్య వివరణ", "వ్యవధి","సంఘటన జరిగిన తేదీ",
    ],
    yes: "అవును", no: "కాదు", unknown: "తెలియదు",
    prefer: "చెప్పకూడదనుకుంటున్నాను", skipped: "దాటవేశారు",
    title: "మీ ఫిర్యాదు సారాంశం", reported: "మీరు నివేదించిన సమస్య:",
    details: "మీరు అందించిన వివరాలు:",
    empty: "ఇంకా అదనపు వివరాలు ఇవ్వలేదు.",
    unanswered: "కొన్ని ప్రశ్నలను దాటవేశారు లేదా వాటి సమాధానాలు తెలియవు. ఈ వివరాలను ఊహించి చేర్చలేదు.",
    disclaimer: "ఇది శ్రమసేతు తయారు చేసిన సారాంశం మాత్రమే. ఇది అధికారిక ప్రభుత్వ ఫిర్యాదు కాదు.",
    workplace: "పని ప్రదేశ సమస్య",
  },

  hi: {
    categories: [
      "बकाया मजदूरी या अनुचित कटौती",
      "कार्यस्थल की सुरक्षा या चोट",
      "उत्पीड़न या शोषण",
      "कार्यस्थल की अन्य समस्या",
    ],
    labels: [
      "कार्यस्थल का क्षेत्र", "जिम्मेदार व्यक्ति", "जिम्मेदार व्यक्ति की भूमिका",
      "प्रभावित मजदूर", "तत्काल खतरा", "बकाया राशि", "दैनिक मजदूरी",
      "बिना भुगतान के दिन", "भुगतान की आवृत्ति",
      "क्या पहले भुगतान मांगा था", "अनुचित कटौती", "कटौती की राशि",
      "क्या हुआ", "क्या मजदूर घायल हुआ", "चोट का विवरण",
      "चिकित्सा उपचार", "क्या नियोक्ता को बताया", "सुरक्षा उपकरण",
      "क्या कार्यस्थल अभी भी खतरनाक है", "गवाह मौजूद थे",
      "क्या अभी सुरक्षित हैं", "उत्पीड़न का प्रकार", "संबंधित व्यक्ति",
      "बार-बार हुई घटना", "बंदी बनाना", "पहचान दस्तावेज़ रोकना",
      "फोन रोकना", "जबरन काम कराना", "हिंसा की धमकी",
      "यौन उत्पीड़न", "समस्या का प्रकार", "समस्या का विवरण", "अवधि","घटना की तारीख",
    ],
    yes: "हाँ", no: "नहीं", unknown: "पता नहीं",
    prefer: "बताना नहीं चाहते", skipped: "छोड़ा गया",
    title: "आपकी रिपोर्ट का सारांश", reported: "आपने यह समस्या बताई:",
    details: "आपके द्वारा दी गई जानकारी:",
    empty: "अभी कोई अतिरिक्त जानकारी नहीं दी गई है।",
    unanswered: "कुछ सवाल छोड़ दिए गए या उनके जवाब पता नहीं हैं। इन जानकारियों का अनुमान नहीं लगाया गया है।",
    disclaimer: "यह श्रमसेतु द्वारा तैयार किया गया सारांश है। यह आधिकारिक सरकारी शिकायत नहीं है।",
    workplace: "कार्यस्थल की समस्या",
  },

  ta: {
    categories: [
      "நிலுவை ஊதியம் அல்லது நியாயமற்ற பிடித்தங்கள்",
      "பணியிடப் பாதுகாப்பு அல்லது காயம்",
      "துன்புறுத்தல் அல்லது சுரண்டல்",
      "பிற பணியிடப் பிரச்சினை",
    ],
    labels: [
      "பணியிடம்", "பொறுப்பான நபர்", "பொறுப்பான நபரின் பங்கு",
      "பாதிக்கப்பட்ட தொழிலாளர்கள்", "உடனடி ஆபத்து", "நிலுவைத் தொகை",
      "தினசரி ஊதியம்", "ஊதியம் வழங்கப்படாத நாட்கள்", "ஊதிய வழங்கும் முறை",
      "ஊதியம் முன்பு கேட்டீர்களா", "நியாயமற்ற பிடித்தங்கள்",
      "பிடித்தத் தொகை", "என்ன நடந்தது", "தொழிலாளருக்குக் காயமா",
      "காயத்தின் விவரங்கள்", "மருத்துவ சிகிச்சை", "முதலாளியிடம் தெரிவித்தீர்களா",
      "பாதுகாப்பு உபகரணங்கள்", "பணியிடம் இன்னும் ஆபத்தானதா",
      "சாட்சிகள் இருந்தார்களா", "தற்போது பாதுகாப்பாக உள்ளீர்களா",
      "துன்புறுத்தல் வகை", "சம்பந்தப்பட்ட நபர்", "மீண்டும் நடந்த சம்பவம்",
      "சிறைபிடித்தல்", "அடையாள ஆவணங்கள் தடுத்து வைக்கப்பட்டனவா",
      "தொலைபேசி தடுத்து வைக்கப்பட்டதா", "கட்டாய வேலை",
      "வன்முறை மிரட்டல்கள்", "பாலியல் துன்புறுத்தல்",
      "பிரச்சினை வகை", "பிரச்சினை விவரம்", "கால அளவு","சம்பவம் நடந்த தேதி",
    ],
    yes: "ஆம்", no: "இல்லை", unknown: "தெரியாது",
    prefer: "சொல்ல விரும்பவில்லை", skipped: "தவிர்க்கப்பட்டது",
    title: "உங்கள் புகாரின் சுருக்கம்", reported: "நீங்கள் தெரிவித்த பிரச்சினை:",
    details: "நீங்கள் வழங்கிய விவரங்கள்:",
    empty: "கூடுதல் விவரங்கள் எதுவும் இன்னும் வழங்கப்படவில்லை.",
    unanswered: "சில கேள்விகள் தவிர்க்கப்பட்டுள்ளன அல்லது அவற்றின் பதில்கள் தெரியவில்லை. இந்த விவரங்கள் ஊகிக்கப்படவில்லை.",
    disclaimer: "இது ஷ்ரம்சேது தயாரித்த சுருக்கம் மட்டுமே. இது அதிகாரப்பூர்வ அரசு புகார் அல்ல.",
    workplace: "பணியிடப் பிரச்சினை",
  },

  kn: {
    categories: [
      "ಬಾಕಿ ವೇತನ ಅಥವಾ ಅನ್ಯಾಯದ ಕಡಿತಗಳು",
      "ಕೆಲಸದ ಸ್ಥಳದ ಸುರಕ್ಷತೆ ಅಥವಾ ಗಾಯ",
      "ಕಿರುಕುಳ ಅಥವಾ ಶೋಷಣೆ",
      "ಇತರ ಕೆಲಸದ ಸ್ಥಳದ ಸಮಸ್ಯೆ",
    ],
    labels: [
      "ಕೆಲಸದ ಸ್ಥಳ", "ಜವಾಬ್ದಾರಿಯುತ ವ್ಯಕ್ತಿ", "ಜವಾಬ್ದಾರಿಯುತ ವ್ಯಕ್ತಿಯ ಪಾತ್ರ",
      "ಪರಿಣಾಮಿತ ಕಾರ್ಮಿಕರು", "ತಕ್ಷಣದ ಅಪಾಯ", "ಬಾಕಿ ಮೊತ್ತ",
      "ದಿನದ ವೇತನ", "ವೇತನವಿಲ್ಲದ ದಿನಗಳು", "ಪಾವತಿ ಅವಧಿ",
      "ಹಿಂದೆ ವೇತನ ಕೇಳಿದ್ದೀರಾ", "ಅನ್ಯಾಯದ ಕಡಿತಗಳು", "ಕಡಿತದ ಮೊತ್ತ",
      "ಏನಾಯಿತು", "ಕಾರ್ಮಿಕರಿಗೆ ಗಾಯವಾಗಿದೆಯೇ", "ಗಾಯದ ವಿವರಗಳು",
      "ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ", "ಮಾಲೀಕರಿಗೆ ತಿಳಿಸಿದ್ದೀರಾ", "ಸುರಕ್ಷತಾ ಸಾಧನಗಳು",
      "ಕೆಲಸದ ಸ್ಥಳ ಇನ್ನೂ ಅಪಾಯಕಾರಿಯೇ", "ಸಾಕ್ಷಿಗಳಿದ್ದರೇ",
      "ಈಗ ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಾ", "ಕಿರುಕುಳದ ಪ್ರಕಾರ", "ಸಂಬಂಧಪಟ್ಟ ವ್ಯಕ್ತಿ",
      "ಪುನರಾವರ್ತಿತ ಘಟನೆ", "ಬಂಧನ", "ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ತಡೆಹಿಡಿಯಲಾಗಿದೆಯೇ",
      "ಫೋನ್ ತಡೆಹಿಡಿಯಲಾಗಿದೆಯೇ", "ಬಲವಂತದ ಕೆಲಸ", "ಹಿಂಸೆಯ ಬೆದರಿಕೆಗಳು",
      "ಲೈಂಗಿಕ ಕಿರುಕುಳ", "ಸಮಸ್ಯೆಯ ಪ್ರಕಾರ", "ಸಮಸ್ಯೆಯ ವಿವರಣೆ", "ಅವಧಿ","ಘಟನೆ ನಡೆದ ದಿನಾಂಕ",
    ],
    yes: "ಹೌದು", no: "ಇಲ್ಲ", unknown: "ಗೊತ್ತಿಲ್ಲ",
    prefer: "ಹೇಳಲು ಇಷ್ಟವಿಲ್ಲ", skipped: "ಬಿಡಲಾಗಿದೆ",
    title: "ನಿಮ್ಮ ವರದಿಯ ಸಾರಾಂಶ", reported: "ನೀವು ವರದಿ ಮಾಡಿದ ಸಮಸ್ಯೆ:",
    details: "ನೀವು ನೀಡಿದ ವಿವರಗಳು:",
    empty: "ಇನ್ನೂ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ವಿವರಗಳನ್ನು ನೀಡಿಲ್ಲ.",
    unanswered: "ಕೆಲವು ಪ್ರಶ್ನೆಗಳನ್ನು ಬಿಟ್ಟಿರಬಹುದು ಅಥವಾ ಉತ್ತರಗಳು ತಿಳಿದಿಲ್ಲ. ಈ ವಿವರಗಳನ್ನು ಊಹಿಸಲಾಗಿಲ್ಲ.",
    disclaimer: "ಇದು ಶ್ರಮಸೇತು ಸಿದ್ಧಪಡಿಸಿದ ಸಾರಾಂಶ ಮಾತ್ರ. ಇದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ದೂರು ಅಲ್ಲ.",
    workplace: "ಕೆಲಸದ ಸ್ಥಳದ ಸಮಸ್ಯೆ",
  },

  bn: {
    categories: [
      "বকেয়া মজুরি বা অন্যায়ভাবে টাকা কাটা",
      "কর্মস্থলের নিরাপত্তা বা আঘাত",
      "নির্যাতন বা শোষণ",
      "অন্যান্য কর্মস্থলের সমস্যা",
    ],
    labels: [
      "কর্মস্থলের এলাকা", "দায়িত্বপ্রাপ্ত ব্যক্তি", "দায়িত্বপ্রাপ্ত ব্যক্তির ভূমিকা",
      "প্রভাবিত শ্রমিক", "তাৎক্ষণিক বিপদ", "বকেয়া টাকা", "দৈনিক মজুরি",
      "বেতন না পাওয়ার দিন", "বেতন প্রদানের সময়সূচি",
      "আগে বেতন চেয়েছিলেন কি", "অন্যায়ভাবে টাকা কাটা",
      "কাটা টাকার পরিমাণ", "কী ঘটেছিল", "শ্রমিক আহত হয়েছেন কি",
      "আঘাতের বিবরণ", "চিকিৎসা", "নিয়োগকর্তাকে জানানো হয়েছে কি",
      "নিরাপত্তা সরঞ্জাম", "কর্মস্থল এখনও বিপজ্জনক কি",
      "সাক্ষী ছিলেন কি", "এখন নিরাপদ আছেন কি", "নির্যাতনের ধরন",
      "জড়িত ব্যক্তি", "বারবার ঘটেছে কি", "আটকে রাখা",
      "পরিচয়পত্র আটকে রাখা হয়েছে কি", "ফোন আটকে রাখা হয়েছে কি",
      "জোর করে কাজ করানো", "হিংসার হুমকি", "যৌন হয়রানি",
      "সমস্যার ধরন", "সমস্যার বিবরণ", "সময়কাল","ঘটনার তারিখ",
    ],
    yes: "হ্যাঁ", no: "না", unknown: "জানি না",
    prefer: "বলতে চাই না", skipped: "এড়িয়ে যাওয়া হয়েছে",
    title: "আপনার রিপোর্টের সারাংশ", reported: "আপনি যে সমস্যাটি জানিয়েছেন:",
    details: "আপনার দেওয়া বিবরণ:",
    empty: "এখনও কোনো অতিরিক্ত বিবরণ দেওয়া হয়নি।",
    unanswered: "কিছু প্রশ্ন এড়িয়ে যাওয়া হয়েছে বা উত্তর জানা নেই। এই তথ্য অনুমান করে যোগ করা হয়নি।",
    disclaimer: "এটি শ্রমসেতু দ্বারা তৈরি একটি সারাংশ। এটি কোনো সরকারি অভিযোগ নয়।",
    workplace: "কর্মস্থলের সমস্যা",
  },
};

function getLanguage(language) {
  return translations[language] || translations.en;
}

function formatValue(value, language) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? getLanguage(language).yes : getLanguage(language).no;
  }

  return String(value);
}

function getFieldLabels(language) {
  const labels = getLanguage(language).labels;
  return Object.fromEntries(
    FIELD_KEYS.map((key, index) => [key, labels[index]])
  );
}

function translateStatus(status, language) {
  const t = getLanguage(language);

  const statuses = {
    unknown: t.unknown,
    prefer_not_to_say: t.prefer,
    skipped: t.skipped,
  };

  return statuses[status] || status;
}

export function getReportSummary(draft, language = "en") {
  const t = getLanguage(language);
  const fieldLabels = getFieldLabels(language);

  const categoryIndex = {
    unpaid_wages: 0,
    safety_injury: 1,
    abuse_exploitation: 2,
    other: 3,
  }[draft.primary_category];

  const category = categoryIndex !== undefined
    ? t.categories[categoryIndex]
    : t.workplace;

  const details = [];

  const shared = draft.shared || {};
  const categoryDetails =
    draft.category_details?.[draft.primary_category] || {};

  const allDetails = { ...shared, ...categoryDetails };

  for (const [field, value] of Object.entries(allDetails)) {
    const label = fieldLabels[field];
    if (!label) continue;

    const formatted = formatValue(value, language);

    if (formatted !== null) {
      details.push({ field, label, value: formatted });
    }
  }

  const unanswered = [];

  for (const [field, answer] of Object.entries(draft.extracted_fields || {})) {
    if (
      ["unknown", "prefer_not_to_say", "skipped"].includes(
        answer.answer_status
      )
    ) {
      unanswered.push({
        field,
        label: fieldLabels[field] || field,
        status: translateStatus(answer.answer_status, language),
      });
    }
  }

  return {
    title: category,
    details,
    unanswered,
    disclaimer: t.disclaimer,
    labels: t,
  };
}

export function getWorkerFriendlySummary(draft, language = "en") {
  const summary = getReportSummary(draft, language);
  const t = summary.labels;

  let text = `${t.reported} ${summary.title}.\n\n`;

  if (summary.details.length > 0) {
    text += `${t.details}\n`;

    for (const detail of summary.details) {
      text += `• ${detail.label}: ${detail.value}\n`;
    }
  } else {
    text += `${t.empty}\n`;
  }

  if (summary.unanswered.length > 0) {
    text += `\n${t.unanswered}\n`;

    for (const item of summary.unanswered) {
      text += `• ${item.label}: ${item.status}\n`;
    }
  }

  text += `\n${summary.disclaimer}`;

  return text;
}
