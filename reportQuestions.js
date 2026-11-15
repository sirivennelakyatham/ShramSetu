// frontend/src/reportQuestions.js

import {
  REPORT_CATEGORIES,
} from "./reportSchema";


// ==================================================
// 1. STANDARD ANSWER OPTIONS
// Every question supports these response types.
// ==================================================

export const STANDARD_ANSWER_OPTIONS = [
  {
    id: "value",
    label: "Provide an answer",
  },
  {
    id: "unknown",
    label: "I don't know",
  },
  {
    id: "prefer_not_to_say",
    label: "Prefer not to say",
  },
  {
    id: "skip",
    label: "Skip",
  },
];


// ==================================================
// 2. QUESTION CREATION HELPER
// ==================================================

function createQuestion({
  id,
  field,
  text,
  type = "text",
  required = false,
  options = [],
  condition = null,
}) {
  return {
    id,
    field,
    text,
    type,
    required,
    options,
    answerOptions: STANDARD_ANSWER_OPTIONS,
    condition,
  };
}


// ==================================================
// 3. SHARED QUESTIONS
// Questions potentially relevant to all categories.
// ==================================================

export const SHARED_QUESTIONS = [

  createQuestion({
    id: "worksite_area",
    field: "worksite_area",
    text: "Where did this problem happen?",
    type: "text",
  }),

  createQuestion({
    id: "responsible_person",
    field: "responsible_person_role",
    text: "Who is responsible for this problem?",
    type: "choice",
    options: [
      "Contractor",
      "Employer",
      "Supervisor",
      "Other",
      "Don't know",
    ],
  }),

createQuestion({
  id: "number_affected",
  field: "number_affected",
  text: "Are other workers facing the same problem?",
  type: "choice",
  options: [
    "Only me",
    "Yes, other workers too",
    "Don't know",
  ],
}),

];


// ==================================================
// 4. UNPAID WAGES QUESTIONS
// ==================================================

export const UNPAID_WAGES_QUESTIONS = [

  createQuestion({
    id: "amount_owed",
    field: "amount_owed",
    text: "How much money are you owed?",
    type: "currency",
  }),

  createQuestion({
    id: "daily_wage",
    field: "daily_wage",
    text: "How much do you normally earn per day?",
    type: "currency",
    condition: {
      field: "amount_owed",
      equals: "unknown",
    },
  }),

  createQuestion({
    id: "days_unpaid",
    field: "days_unpaid",
    text: "For how many days have you not received your wages?",
    type: "number",
    condition: {
      field: "amount_owed",
      equals: "unknown",
    },
  }),

  createQuestion({
    id: "payment_frequency",
    field: "payment_frequency",
    text: "How often are you normally paid?",
    type: "choice",
    options: [
      "Daily",
      "Weekly",
      "Monthly",
      "Other",
    ],
  }),

  createQuestion({
    id: "previously_requested_payment",
    field: "previously_requested_payment",
    text: "Have you already asked for your pending wages?",
    type: "choice",
    options: [
      "Yes",
      "No",
    ],
  }),

  createQuestion({
    id: "unfair_deductions",
    field: "unfair_deductions",
    text: "Has money been unfairly deducted from your wages?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "deduction_amount",
    field: "deduction_amount",
    text: "Approximately how much money was deducted?",
    type: "currency",
    condition: {
      field: "unfair_deductions",
      equals: "Yes",
    },
  }),

];


// ==================================================
// 5. SAFETY AND INJURY QUESTIONS
// Safety question must come first.
// ==================================================

export const SAFETY_INJURY_QUESTIONS = [

  createQuestion({
    id: "current_safety",
    field: "immediate_danger",
    text: "Are you hurt or in danger right now?",
    type: "choice",
    options: [
      "Yes, I am hurt",
      "Yes, I am in danger",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "incident_description",
    field: "incident_description",
    text: "Can you tell me what happened?",
    type: "text",
  }),

  createQuestion({
    id: "injured",
    field: "injured",
    text: "Were you physically injured?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "injury_description",
    field: "injury_description",
    text: "Can you describe your injury?",
    type: "text",
    condition: {
      field: "injured",
      equals: "Yes",
    },
  }),

  createQuestion({
    id: "medical_treatment",
    field: "medical_treatment_received",
    text: "Have you received medical treatment?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Need medical help",
    ],
    condition: {
      field: "injured",
      equals: "Yes",
    },
  }),

  createQuestion({
    id: "employer_informed",
    field: "employer_informed",
    text: "Have you informed your employer or contractor?",
    type: "choice",
    options: [
      "Yes",
      "No",
    ],
  }),

  createQuestion({
    id: "safety_equipment",
    field: "safety_equipment_provided",
    text: "Were safety equipment and protective measures provided?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "workplace_still_dangerous",
    field: "workplace_still_dangerous",
    text: "Is the workplace still dangerous?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "witnesses_present",
    field: "witnesses_present",
    text: "Were there other people who witnessed what happened?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Don't know",
    ],
  }),

  createQuestion({
    id: "evidence_available",
    field: "evidence_available",
    text: "Do you have any photographs or documents?",
    type: "choice",
    options: [
      "Yes",
      "No",
    ],
  }),

];


// ==================================================
// 6. ABUSE AND EXPLOITATION QUESTIONS
// Privacy-sensitive workflow.
// ==================================================

export const ABUSE_EXPLOITATION_QUESTIONS = [

  createQuestion({
    id: "currently_safe",
    field: "currently_safe",
    text: "Are you safe right now?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "abuse_description",
    field: "incident_description",
    text: "Would you like to describe what happened?",
    type: "text",
  }),

  createQuestion({
    id: "person_involved",
    field: "person_involved",
    text: "Who was involved?",
    type: "choice",
    options: [
      "Contractor",
      "Employer",
      "Supervisor",
      "Other",
      "Don't know",
    ],
  }),

  createQuestion({
    id: "incident_date",
    field: "incident_date",
    text: "When did this happen?",
    type: "date",
  }),

  createQuestion({
    id: "repeated_incident",
    field: "repeated_incident",
    text: "Has this happened before?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Prefer not to say",
    ],
  }),

  createQuestion({
    id: "confinement",
    field: "confinement",
    text: "Has anyone prevented you from leaving a place?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "identity_documents_withheld",
    field: "identity_documents_withheld",
    text: "Has anyone taken or kept your identity documents?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "phone_withheld",
    field: "phone_withheld",
    text: "Has anyone taken or prevented you from using your phone?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "forced_work",
    field: "forced_work",
    text: "Has anyone forced you to work against your will?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "threats_of_violence",
    field: "threats_of_violence",
    text: "Has anyone threatened to physically hurt you?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Not sure",
    ],
  }),

  createQuestion({
    id: "sexual_harassment",
    field: "sexual_harassment",
    text: "Have you experienced unwanted sexual behaviour or harassment?",
    type: "choice",
    options: [
      "Yes",
      "No",
      "Prefer not to say",
    ],
  }),

];


// ==================================================
// 7. OTHER PROBLEM QUESTIONS
// ==================================================

export const OTHER_QUESTIONS = [

  createQuestion({
    id: "problem_description",
    field: "problem_description",
    text: "Can you tell me a little more about the problem?",
    type: "text",
  }),

  createQuestion({
    id: "problem_subtype",
    field: "problem_subtype",
    text: "Which of these best describes your problem?",
    type: "choice",
    options: [
      "No drinking water",
      "Accommodation",
      "Food",
      "Working hours",
      "No weekly rest",
      "ID or registration problem",
      "Something else",
    ],
  }),

  createQuestion({
    id: "problem_duration",
    field: "duration",
    text: "How long have you been facing this problem?",
    type: "text",
  }),

];


// ==================================================
// 8. GET QUESTIONS FOR A CATEGORY
// ==================================================

export function getQuestionsForCategory(category) {

  switch (category) {

    case REPORT_CATEGORIES.UNPAID_WAGES:
      return [
        ...SHARED_QUESTIONS,
        ...UNPAID_WAGES_QUESTIONS,
      ];

    case REPORT_CATEGORIES.SAFETY_INJURY:
      return [
        ...SAFETY_INJURY_QUESTIONS,
        ...SHARED_QUESTIONS,
      ];

    case REPORT_CATEGORIES.ABUSE_EXPLOITATION:
      return [
        ...ABUSE_EXPLOITATION_QUESTIONS,
        ...SHARED_QUESTIONS,
      ];

    case REPORT_CATEGORIES.OTHER:
      return [
        ...OTHER_QUESTIONS,
        ...SHARED_QUESTIONS,
      ];

    default:
      return [];
  }

}


// ==================================================
// 9. CHECK WHETHER A QUESTION SHOULD BE ASKED
// ==================================================

export function shouldAskQuestion(question, answers = {}) {
  if (!question.condition) {
    return true;
  }

  const { field, equals } = question.condition;
  const answer = answers[field];

  if (answer === undefined || answer === null) {
    return false;
  }

  // Support both simple answers and structured answers.
  // Example structured answer:
  // { answer_status: "provided", value: "Yes" }

  if (typeof answer === "object") {
    if (answer.answer_status === "unknown") {
      return equals === "unknown";
    }

    if (answer.answer_status !== "provided") {
      return false;
    }

    return answer.value === equals;
  }

  // Support simple answers during our transition.
  return answer === equals;
}


// ==================================================
// 10. EMERGENCY KEYWORDS
// Initial English, Hindi and Telugu examples.
// Other languages will be added before multilingual
// emergency detection is enabled.
// ==================================================

export const EMERGENCY_KEYWORDS = {

  en: [
    "bleeding",
    "unconscious",
    "can't move",
    "cannot move",
    "seriously injured",
    "falling",
    "trapped",
    "locked inside",
    "threatened to kill",
    "physical violence",
  ],

  hi: [
    "खून बह रहा",
    "बेहोश",
    "चल नहीं पा रहा",
    "बंद कर दिया",
    "जान से मारने की धमकी",
    "मारपीट",
  ],

  te: [
    "రక్తం వస్తోంది",
    "స్పృహ కోల్పోయాడు",
    "నడవలేకపోతున్నాను",
    "బంధించారు",
    "చంపేస్తానని బెదిరించారు",
  ],

  ta: [],
  kn: [],
  bn: [],

};


// ==================================================
// 11. CHECK EMERGENCY KEYWORDS
// ==================================================

export function detectEmergencyKeywords(text, language = "en") {

  if (!text) {
    return false;
  }

  const keywords = EMERGENCY_KEYWORDS[language] || [];

  const normalizedText = text.toLowerCase();

  return keywords.some((keyword) =>
    normalizedText.includes(keyword.toLowerCase())
  );

}


// ==================================================
// 12. CHECK EMERGENCY ANSWERS
// ==================================================

export function detectEmergencyFromAnswers(answers = {}) {
  const getValue = (field) => {
    const answer = answers[field];

    if (answer && typeof answer === "object") {
      return answer.answer_status === "provided"
        ? answer.value
        : null;
    }

    return answer ?? null;
  };

  const immediateDanger = getValue("immediate_danger");
  const currentlySafe = getValue("currently_safe");
  const medicalNeed = getValue("medical_treatment_received");

  const immediateEmergency =
    immediateDanger === "Yes, I am hurt" ||
    immediateDanger === "Yes, I am in danger" ||
    currentlySafe === "No" ||
    medicalNeed === "Need medical help";

  const urgentProtectionFields = [
    "confinement",
    "identity_documents_withheld",
    "phone_withheld",
    "forced_work",
    "threats_of_violence",
    "sexual_harassment",
    "workplace_still_dangerous",
  ];

  const urgentProtection = urgentProtectionFields.some(
    (field) => getValue(field) === "Yes"
  );

  return {
    immediateEmergency,
    urgentProtection,
  };
}


// ==================================================
// 13. ABUSE FLOW SETTINGS
// ==================================================

export const ABUSE_FLOW_SETTINGS = {
  showSilentModePrompt: true,
  showEarphoneSuggestion: true,
  showQuickExit: true,
  allowAnonymousReport: true,
  allowEveryQuestionToBeSkipped: true,
};


// ==================================================
// 14. PHOTO SAFETY MESSAGE
// ==================================================

export const PHOTO_SAFETY_MESSAGE =
  "Only take photographs if it is safe to do so.";
