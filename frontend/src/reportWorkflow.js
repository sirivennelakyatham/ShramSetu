import {
  createReportDraft,
  getCategoryFields,
  REPORT_CATEGORIES,
} from "./reportSchema";

import {
  getQuestionsForCategory,
  shouldAskQuestion,
  detectEmergencyFromAnswers,
} from "./reportQuestions";


/* --------------------------------
   1. CREATE WORKFLOW
--------------------------------- */

export function createWorkflowState({
  category,
  language = "en",
  originalText = "",
  inputType = "text",
} = {}) {
  if (!Object.values(REPORT_CATEGORIES).includes(category)) {
    throw new Error("Please select a valid report category.");
  }

  return {
    language,
    primaryCategory: category,
    secondaryCategories: [],

    originalText,
    inputType,

    answers: {},
    questionsAnswered: [],

    emergency: {
      immediateEmergency: false,
      urgentProtection: false,
    },

    status: "in_progress",
  };
}


/* --------------------------------
   2. CREATE AN ANSWER
--------------------------------- */

export function createWorkflowAnswer(
  value = null,
  status = "provided",
  source = "answered"
) {
  const allowedStatuses = [
    "provided",
    "unknown",
    "prefer_not_to_say",
    "skipped",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid answer status: ${status}`);
  }

  return {
    value: status === "provided" ? value : null,
    answer_status: status,
    source,
  };
}


/* --------------------------------
   3. RECORD AN ANSWER
--------------------------------- */

export function recordWorkflowAnswer(
  state,
  field,
  value,
  status = "provided"
) {
  if (!state || !field) {
    throw new Error("Workflow state and field are required.");
  }

  const answer = createWorkflowAnswer(value, status);

  const updatedAnswers = {
    ...state.answers,
    [field]: answer,
  };

  const questionsAnswered = state.questionsAnswered.includes(field)
    ? state.questionsAnswered
    : [...state.questionsAnswered, field];

  const emergency = detectEmergencyFromAnswers(updatedAnswers);

  return {
    ...state,
    answers: updatedAnswers,
    questionsAnswered,
    emergency,
  };
}


/* --------------------------------
   4. GET QUESTIONS
--------------------------------- */

export function getWorkflowQuestions(state) {
  if (!state?.primaryCategory) {
    return [];
  }

  return getQuestionsForCategory(state.primaryCategory);
}


/* --------------------------------
   5. GET NEXT QUESTION
--------------------------------- */

export function getNextQuestion(state) {
  const questions = getWorkflowQuestions(state);

  for (const question of questions) {
    const alreadyAnswered = Object.prototype.hasOwnProperty.call(
      state.answers,
      question.field
    );

    if (alreadyAnswered) {
      continue;
    }

    const shouldAsk = shouldAskQuestion(
      question,
      state.answers
    );

    if (shouldAsk) {
      return question;
    }
  }

  return null;
}


/* --------------------------------
   6. GET WORKFLOW PROGRESS
--------------------------------- */

export function getWorkflowProgress(state) {
  const questions = getWorkflowQuestions(state);

  const visibleQuestions = questions.filter((question) => {
    const answered = Object.prototype.hasOwnProperty.call(
      state.answers,
      question.field
    );

    return answered || shouldAskQuestion(question, state.answers);
  });

  const completed = visibleQuestions.filter((question) =>
    Object.prototype.hasOwnProperty.call(
      state.answers,
      question.field
    )
  ).length;

  const total = visibleQuestions.length;

  return {
    completed,
    total,
    percentage: total === 0
      ? 0
      : Math.round((completed / total) * 100),
  };
}


/* --------------------------------
   7. CHECK IF QUESTIONS ARE FINISHED
--------------------------------- */

export function areQuestionsComplete(state) {
  return getNextQuestion(state) === null;
}


/* --------------------------------
   8. GET EMERGENCY STATUS
--------------------------------- */

export function getWorkflowEmergencyStatus(state) {
  return detectEmergencyFromAnswers(state.answers);
}


/* --------------------------------
   9. PREPARE REPORT FOR REVIEW
--------------------------------- */

export function prepareReportForReview(state) {
  if (!areQuestionsComplete(state)) {
    throw new Error(
      "Please complete or skip the remaining questions before reviewing."
    );
  }

  const draft = createReportDraft(state.language);

  draft.primary_category = state.primaryCategory;
  draft.secondary_categories = state.secondaryCategories;

  draft.original_input = {
    input_type: state.inputType,
    original_text: state.originalText,
    transcript: state.inputType === "voice"
      ? state.originalText
      : null,
  };

  const sharedFields = Object.keys(draft.shared || {});

  const categoryFields = Object.keys(
    getCategoryFields(state.primaryCategory) || {}
  );

  const categoryAnswers = {};

  for (const [field, answer] of Object.entries(state.answers)) {
    if (!answer) continue;

    const value = answer.answer_status === "provided"
      ? answer.value
      : null;

    // Put shared answers into the shared section.
    if (sharedFields.includes(field)) {
      draft.shared[field] = value;
    }

    // Put category-specific answers into category details.
    if (categoryFields.includes(field)) {
      categoryAnswers[field] = value;
    }
  }

  draft.category_details[state.primaryCategory] = {
    ...(draft.category_details[state.primaryCategory] || {}),
    ...categoryAnswers,
  };

  // Keep answer status and source information separately.
  draft.extracted_fields = Object.fromEntries(
    Object.entries(state.answers).map(([field, answer]) => [
      field,
      {
        value: answer.value,
        answer_status: answer.answer_status,
        source: answer.source,
      },
    ])
  );

  draft.emergency = {
    ...draft.emergency,
    ...state.emergency,
  };

  draft.preparation_status = "ready_for_review";
  draft.worker_confirmed = false;

  return draft;
}


/* --------------------------------
   10. WORKER CONFIRMATION
--------------------------------- */

export function confirmReportDraft(draft, confirmed) {
  if (confirmed !== true) {
    return {
      ...draft,
      worker_confirmed: false,
      preparation_status: "ready_for_review",
    };
  }

  return {
    ...draft,
    worker_confirmed: true,
    preparation_status: "confirmed",
  };
}