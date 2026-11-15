// frontend/src/reportSchema.js

// ==========================================
// 1. SUPPORTED LANGUAGES
// ==========================================

export const SUPPORTED_LANGUAGES = [
  "te", // Telugu
  "hi", // Hindi
  "en", // English
  "ta", // Tamil
  "kn", // Kannada
  "bn", // Bengali
];


// ==========================================
// 2. REPORT CATEGORIES
// ==========================================

export const REPORT_CATEGORIES = {
  UNPAID_WAGES: "unpaid_wages",
  SAFETY_INJURY: "safety_injury",
  ABUSE_EXPLOITATION: "abuse_exploitation",
  OTHER: "other",
};


// ==========================================
// 3. CATEGORY SEVERITY
// Higher number = higher priority
// ==========================================

export const CATEGORY_PRIORITY = {
  [REPORT_CATEGORIES.OTHER]: 1,
  [REPORT_CATEGORIES.UNPAID_WAGES]: 2,
  [REPORT_CATEGORIES.SAFETY_INJURY]: 3,
  [REPORT_CATEGORIES.ABUSE_EXPLOITATION]: 4,
};


// ==========================================
// 4. FIELD PROVENANCE
// Where did the information come from?
// ==========================================

export const FIELD_SOURCES = {
  HEARD: "heard",
  ANSWERED: "answered",
  SKIPPED: "skipped",
};


// ==========================================
// 5. ANSWER STATES
// ==========================================

export const ANSWER_STATUS = {
  PROVIDED: "provided",
  UNKNOWN: "unknown",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
  SKIPPED: "skipped",
  NOT_ASKED: "not_asked",
};


// ==========================================
// 6. FIELD CREATION HELPER
// Every extracted field follows the same format.
// ==========================================

export function createField(value = null, source = null) {
  return {
    value,
    source,
    answer_status: value !== null
      ? ANSWER_STATUS.PROVIDED
      : ANSWER_STATUS.NOT_ASKED,
    confidence: null,
  };
}


// ==========================================
// 7. SHARED FIELDS
// These apply to every report category.
// ==========================================

export const SHARED_FIELDS = {
  language: null,

  worksite_area: null,

  responsible_person: null,

  responsible_person_role: null,

  number_affected: null,

  immediate_danger: null,

  worker_contact: {
    name: null,
    phone: null,
    contact_preference: null,
  },

  consent: {
    save_report: false,
    share_with_organisation: false,
    recipient_id: null,
    consent_time: null,
  },
};


// ==========================================
// 8. UNPAID WAGES FIELDS
// ==========================================

export const UNPAID_WAGES_FIELDS = {
  work_type: null,

  employer_name: null,

  contractor_name: null,

  daily_wage: null,

  days_unpaid: null,

  last_payment_date: null,

  // Derived from last_payment_date.
  // Do not ask separately if the date is known.
  days_since_last_payment: null,

  amount_owed: null,

  approximate_amount_owed: null,

  payment_frequency: null,

  payment_method: null,

  unfair_deductions: null,

  deduction_amount: null,

  previously_requested_payment: null,

  other_workers_affected: null,
};


// ==========================================
// 9. SAFETY AND INJURY FIELDS
// ==========================================

export const SAFETY_INJURY_FIELDS = {
  incident_description: null,

  incident_date: null,

  injured: null,

  injury_description: null,

  medical_treatment_received: null,

  employer_informed: null,

  safety_equipment_provided: null,

  workplace_still_dangerous: null,

  witnesses_present: null,

  evidence_available: null,
};


// ==========================================
// 10. ABUSE AND EXPLOITATION FIELDS
// ==========================================

export const ABUSE_EXPLOITATION_FIELDS = {
  abuse_type: null,

  incident_description: null,

  person_involved: null,

  incident_date: null,

  repeated_incident: null,

  currently_safe: null,

  confinement: null,

  identity_documents_withheld: null,

  phone_withheld: null,

  forced_work: null,

  threats_of_violence: null,

  sexual_harassment: null,

  anonymous_report_requested: false,
};


// ==========================================
// 11. OTHER PROBLEM FIELDS
// ==========================================

export const OTHER_FIELDS = {
  problem_subtype: null,

  problem_description: null,

  duration: null,

  person_responsible: null,
};


// ==========================================
// 12. REPORT SUBTYPE OPTIONS
// ==========================================

export const OTHER_PROBLEM_SUBTYPES = [
  "no_drinking_water",
  "accommodation",
  "food",
  "working_hours",
  "no_weekly_rest",
  "id_or_registration",
  "other",
];


// ==========================================
// 13. CREATE A NEW REPORT DRAFT
// This does NOT save anything to SQLite.
// ==========================================

export function createReportDraft(language = "en") {
  return {
    report_id: null,

    created_at: new Date().toISOString(),

    language,

    primary_category: null,

    secondary_categories: [],

    shared: structuredClone(SHARED_FIELDS),

    category_details: {},

    original_input: {
      input_type: null,
      original_text: "",
      transcript: "",
    },

    extracted_fields: {},

    questions_answered: [],

    worker_friendly_summary: "",

    formal_summary: "",

    emergency_override: false,

    emergency_reason: null,

    preparation_status: "in_progress",

    worker_confirmed: false,
  };
}


// ==========================================
// 14. GET CATEGORY FIELDS
// ==========================================

export function getCategoryFields(category) {
  switch (category) {
    case REPORT_CATEGORIES.UNPAID_WAGES:
      return structuredClone(UNPAID_WAGES_FIELDS);

    case REPORT_CATEGORIES.SAFETY_INJURY:
      return structuredClone(SAFETY_INJURY_FIELDS);

    case REPORT_CATEGORIES.ABUSE_EXPLOITATION:
      return structuredClone(ABUSE_EXPLOITATION_FIELDS);

    case REPORT_CATEGORIES.OTHER:
      return structuredClone(OTHER_FIELDS);

    default:
      return {};
  }
}


// ==========================================
// 15. SELECT PRIMARY CATEGORY
// The highest-priority category wins.
// ==========================================

export function selectPrimaryCategory(categories = []) {
  if (categories.length === 0) {
    return null;
  }

  return [...categories].sort(
    (a, b) =>
      (CATEGORY_PRIORITY[b] || 0) -
      (CATEGORY_PRIORITY[a] || 0)
  )[0];
}