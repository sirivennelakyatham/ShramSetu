import React, { useState } from "react";
import {
  ArrowLeft,
  Languages,
  X,
  Send,
  CheckCircle,
  ShieldAlert,
  Volume2,
  LoaderCircle,
  Bot,
  User,
} from "lucide-react";

import { useLanguage } from "./LanguageContext";
import "./ReportProblem.css";
import useSpeech from "./useSpeech";
import ComplaintPathways from "./ComplaintPathways";
import NGOEmailRequest from "./NGOEmailRequest";
import VoiceInput from "./VoiceInput";

// Keep this aligned with the FastAPI backend address used by the project.
const API_BASE_URL = "http://127.0.0.1:8000";

function ReportProblem({ onBack, onChangeLanguage }) {
  const { language, t } = useLanguage();
  const {
    speak,
    stopSpeech,
    speaking,
    loading: speechLoading,
  } = useSpeech(language);

  const [stage, setStage] = useState("describe");
  const [description, setDescription] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [conversationReady, setConversationReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [report, setReport] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showNGOEmail, setShowNGOEmail] = useState(false);

  const requestJson = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.message || "Something went wrong. Please try again.");
    }
    return data;
  };

  const generateReport = async (activeSessionId) => {
    const data = await requestJson(
      `/conversation/${encodeURIComponent(activeSessionId)}/generate-report`,
      { method: "POST" }
    );
    if (!data.report) {
      throw new Error("The server did not return a grievance report.");
    }
    setReport(data.report);
    setConversationReady(true);
    setStage("review");
  };

  const startConversation = async () => {
    const firstMessage = description.trim();
    if (!firstMessage || busy) return;

    setBusy(true);
    setError("");
    try {
      const data = await requestJson("/conversation/start", {
        method: "POST",
        body: JSON.stringify({
          language,
          initial_message: firstMessage,
        }),
      });

      if (!data.session_id || typeof data.reply !== "string") {
        throw new Error("The conversation service returned an incomplete response.");
      }

      setSessionId(data.session_id);
      setMessages([
        { role: "user", content: firstMessage },
        { role: "assistant", content: data.reply },
      ]);
      setDescription("");

      if (data.ready_for_review) {
        setConversationReady(true);
        await generateReport(data.session_id);
      } else {
        setStage("conversation");
      }
    } catch (err) {
      setError(err.message || "Could not start the conversation.");
    } finally {
      setBusy(false);
    }
  };

  const sendMessage = async () => {
    const message = reply.trim();
    if (!message || !sessionId || busy) return;

    setBusy(true);
    setError("");
    setMessages((previous) => [...previous, { role: "user", content: message }]);
    setReply("");

    try {
      const data = await requestJson(
        `/conversation/${encodeURIComponent(sessionId)}/message`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
        }
      );

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply || "" },
      ]);

      if (data.ready_for_review) {
        setConversationReady(true);
        await generateReport(sessionId);
      }
    } catch (err) {
      // Keep the worker's message visible so they can retry without losing it.
      setMessages((previous) => [
        ...previous,
        { role: "system", content: `Message could not be sent: ${err.message}` },
      ]);
      setError(err.message || "Could not send your answer.");
    } finally {
      setBusy(false);
    }
  };

  const confirmReport = () => {
    if (!report) return;
    // The current backend generates and stores a draft awaiting review.
    // Confirmation here is the worker's explicit frontend approval; it does
    // not submit a government complaint or send information to an NGO.
    setStage("confirmed");
  };

  const goBack = () => {
    if (stage === "describe") {
      onBack();
    } else if (stage === "conversation") {
      // Do not create a new session when returning to the first screen.
      // Keep the active session in component state.
      setStage("conversation");
    } else if (stage === "review") {
      setStage("conversation");
    } else if (stage === "confirmed") {
      onBack();
    }
  };

  const reportRows = report
    ? [
        ["Problem", report.problem_description],
        ["Category", report.primary_category],
        ["Other related categories", Array.isArray(report.secondary_categories) ? report.secondary_categories.join(", ") : report.secondary_categories],
        ["Type of work", report.work_type],
        ["Employer / contractor", report.employer_or_contractor],
        ["Work location", report.work_location],
        ["Amount owed", report.amount_owed && typeof report.amount_owed === "object"
          ? [report.amount_owed.value, report.amount_owed.currency, report.amount_owed.certainty].filter(Boolean).join(" · ")
          : report.amount_owed],
        ["Duration", report.duration && typeof report.duration === "object"
          ? [report.duration.value, report.duration.certainty].filter(Boolean).join(" · ")
          : report.duration],
        ["Incident details", report.incident_details],
        ["Immediate danger", report.immediate_danger],
        ["Injuries", report.injuries],
        ["Other details", Array.isArray(report.other_relevant_details) ? report.other_relevant_details.join("; ") : report.other_relevant_details],
      ].filter(([, value]) => value !== null && value !== undefined && value !== "")
    : [];

  return (
    <div className="report-page">
      <header className="report-header">
        <button onClick={goBack} className="report-back" type="button">
          <ArrowLeft size={20} />
          {t("back")}
        </button>
        <strong>ShramSetu</strong>
        <button className="report-language" onClick={onChangeLanguage} type="button">
          <Languages size={18} />
          {language.toUpperCase()}
        </button>
      </header>

      <main className="report-main">
        {stage === "describe" && (
          <>
            <div className="report-intro">
              <span className="report-eyebrow">{t("report")}</span>
              <h1>{t("reportTitle")}</h1>
              <p>Tell us what happened at work. ShramSetu will ask a few questions to understand your situation and prepare a report.</p>
            </div>

            <button
              className="report-emergency-button"
              onClick={() => setShowEmergency(true)}
              type="button"
            >
              <ShieldAlert size={23} />
              <span>{t("danger")}</span>
            </button>

            <section className="report-conversation">
              <div className="report-welcome-message">
                <ShieldAlert size={20} className="report-message-icon" />
                <p>You can explain the problem in your own words. You do not need to choose a category or answer a fixed questionnaire.</p>
              </div>

              <div className="report-text-entry">
                <label htmlFor="problem-description">{t("describeProblem")}</label>
                <textarea
                  id="problem-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  rows={6}
                  maxLength={5000}
                />
                <VoiceInput
  language={language}
  onTranscript={(transcript) => {
    setDescription((previous) =>
      previous.trim()
        ? `${previous.trim()} ${transcript}`
        : transcript
    );
  }}
/>
              </div>

              {error && <p className="report-error" role="alert">{error}</p>}

              <button
                className="report-next-button"
                type="button"
                disabled={!description.trim() || busy}
                onClick={startConversation}
              >
                {busy ? <LoaderCircle className="report-spinner" size={18} /> : <Send size={18} />}
                {busy ? "Starting conversation..." : "Start conversation"}
              </button>
            </section>
          </>
        )}

        {stage === "conversation" && (
          <section className="report-conversation">
            <div className="report-intro">
              <span className="report-eyebrow">{t("report")}</span>
              <h1>Tell us a little more</h1>
              <p>Answer the assistant's questions. Your replies stay in this conversation.</p>
            </div>

            <div className="report-chat-thread" aria-live="polite">
              {messages.map((item, index) => (
                <div
                  className={`report-chat-message ${item.role === "user" ? "worker" : item.role === "system" ? "system" : "assistant"}`}
                  key={`${item.role}-${index}`}
                >
                  <span className="report-chat-avatar">
                    {item.role === "user" ? <User size={17} /> : <Bot size={17} />}
                  </span>
                  <div className="report-chat-bubble">
                    <span className="report-chat-sender">
                      {item.role === "user" ? "You" : item.role === "system" ? "Notice" : "ShramSetu"}
                    </span>
                    <p>{item.content}</p>
                    {item.role === "assistant" && item.content && (
                      <button
                        type="button"
                        className="report-speech-button"
                        onClick={() => speaking ? stopSpeech() : speak(item.content)}
                        disabled={speechLoading}
                      >
                        <Volume2 size={17} />
                        {speechLoading ? "Loading..." : speaking ? "Stop" : "Listen"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="report-thinking">
                  <LoaderCircle className="report-spinner" size={18} />
                  ShramSetu is thinking...
                </div>
              )}
            </div>

            
{!conversationReady && (
  <div className="report-chat-composer">
    <label htmlFor="conversation-reply">Your answer</label>

    <textarea
      id="conversation-reply"
      rows={3}
      maxLength={5000}
      value={reply}
      onChange={(event) => setReply(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      }}
      placeholder="Type your answer..."
      disabled={busy}
    />

    <VoiceInput
      language={language}
      disabled={busy}
      onTranscript={(transcript) => {
        setReply((previous) =>
          previous.trim()
            ? `${previous.trim()} ${transcript}`
            : transcript
        );
      }}
    />

    <p>Press Enter to send, or Shift + Enter for a new line.</p>

    {error && <p className="report-error" role="alert">{error}</p>}

    <button
      type="button"
      className="report-next-button"
      disabled={!reply.trim() || busy}
      onClick={sendMessage}
    >
      {busy ? (
        <LoaderCircle className="report-spinner" size={18} />
      ) : (
        <Send size={18} />
      )}
      Send answer
    </button>
  </div>
)}

            {conversationReady && (
              <div className="report-generation-status">
                {error ? (
                  <>
                    <p className="report-error" role="alert">{error}</p>
                    <button
                      type="button"
                      className="report-next-button"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        setError("");
                        try { await generateReport(sessionId); }
                        catch (err) { setError(err.message || "Could not generate the report."); }
                        finally { setBusy(false); }
                      }}
                    >Retry report generation</button>
                  </>
                ) : (
                  <p className="report-disclaimer">The questions are complete. Your report is being prepared for review.</p>
                )}
              </div>
            )}

            <button
              className="report-emergency-button"
              type="button"
              onClick={() => setShowEmergency(true)}
            >
              <ShieldAlert size={22} />
              <span>{t("danger")}</span>
            </button>
          </section>
        )}

        {stage === "review" && report && (
          <section className="report-conversation">
            <div className="report-intro">
              <span className="report-eyebrow">Review</span>
              <h1>Your grievance report</h1>
              <p>Please check the information below. Confirm only if it accurately describes what you told us.</p>
            </div>

            <div className="report-summary">
              {reportRows.length ? (
                <dl className="report-details-list">
                  {reportRows.map(([label, value]) => (
                    <div className="report-detail-row" key={label}>
                      <dt>{label}</dt>
                      <dd>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>The report was generated, but no displayable details were returned.</p>
              )}
              {Array.isArray(report.missing_information) && report.missing_information.length > 0 && (
                <div className="report-unanswered">
                  <h3>Information not provided</h3>
                  <ul>
                    {report.missing_information.map((item, index) => (
                      <li key={index}>{typeof item === "string" ? item : JSON.stringify(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="report-review-actions">
              <button
                className="report-next-button"
                type="button"
                onClick={confirmReport}
              >
                <CheckCircle size={18} />
                Confirm report
              </button>
            </div>
            <p className="report-disclaimer">
              This is a draft prepared by ShramSetu. Confirming it does not submit a complaint or share it with a government office or NGO.
            </p>
            {error && <p className="report-error" role="alert">{error}</p>}
          </section>
        )}

        {stage === "confirmed" && report && (
          <section className="report-conversation">
            <div className="report-intro">
              <CheckCircle size={48} />
              <h1>Report confirmed</h1>
              <p>Your report is confirmed. It has not been submitted to any authority.</p>
            </div>

            <ComplaintPathways
  language={language}
  report={{
    ...report,
    category: report.primary_category,
    state: "Telangana",
    language
  }}
  onSelectPathway={(pathway) => {
    if (pathway.id === "shramsetu-demo-support") {
      setShowNGOEmail(true);
    } else {
      console.log("Selected support pathway:", pathway);
    }
  }}
/>

{showNGOEmail && (
  <NGOEmailRequest
    report={report}
    language={language}
    onClose={() => setShowNGOEmail(false)}
  />
)}

            <button className="report-next-button" onClick={onBack} type="button">
              Return to home
            </button>
          </section>
        )}
      </main>

      {showEmergency && (
        <div className="report-emergency-overlay">
          <div className="report-emergency-dialog" role="dialog" aria-modal="true">
            <button
              className="report-emergency-close"
              onClick={() => setShowEmergency(false)}
              aria-label={t("close")}
              type="button"
            >
              <X size={22} />
            </button>
            <div className="report-emergency-icon">
              <ShieldAlert size={34} />
            </div>
            <h2>{t("emergencyTitle")}</h2>
            <p>{t("emergencyText")}</p>
            <a href="tel:112" className="report-emergency-call">{t("emergencyCall")}</a>
            <button
              className="report-emergency-dismiss"
              onClick={() => setShowEmergency(false)}
              type="button"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportProblem;
