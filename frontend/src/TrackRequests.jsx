
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Clock,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

import { useLanguage } from "./LanguageContext";
import "./TrackRequests.css";

const API_URL = "http://127.0.0.1:8000";

const translations = {
  en: {
    title: "Track Requests",
    subtitle: "Check the status of your assistance requests.",
    back: "Back",
    refresh: "Refresh",
    loading: "Loading your requests...",
    empty: "No assistance requests yet.",
    emptyHint: "When you contact a support organisation, your request will appear here.",
    submitted: "Request submitted",
    waiting: "Awaiting reply",
    replied: "Reply received",
    organisation: "Organisation",
    requestId: "Request ID",
    submittedOn: "Submitted on",
    problem: "Your issue",
    reply: "Organisation's reply",
    demo: "Demo request",
    demoNotice: "This is a local demonstration. Replies are simulated, not actual NGO responses.",
    error: "Could not load requests. Please check that the backend is running.",
    noReply: "No reply has been received yet. This page checks for updates automatically.",
  },
  te: {
    title: "అభ్యర్థనల స్థితి",
    subtitle: "మీ సహాయ అభ్యర్థనల స్థితిని చూడండి.",
    back: "వెనక్కి",
    refresh: "రిఫ్రెష్",
    loading: "మీ అభ్యర్థనలు లోడ్ అవుతున్నాయి...",
    empty: "ఇంకా సహాయ అభ్యర్థనలు లేవు.",
    emptyHint: "మీరు సహాయ సంస్థను సంప్రదించినప్పుడు, మీ అభ్యర్థన ఇక్కడ కనిపిస్తుంది.",
    submitted: "అభ్యర్థన పంపబడింది",
    waiting: "సమాధానం కోసం వేచి ఉంది",
    replied: "సమాధానం వచ్చింది",
    organisation: "సంస్థ",
    requestId: "అభ్యర్థన ఐడి",
    submittedOn: "పంపిన తేదీ",
    problem: "మీ సమస్య",
    reply: "సంస్థ సమాధానం",
    demo: "డెమో అభ్యర్థన",
    demoNotice: "ఇది స్థానిక డెమో మాత్రమే. సమాధానాలు అనుకరణ చేయబడినవి; నిజమైన NGO సమాధానాలు కావు.",
    error: "అభ్యర్థనలను లోడ్ చేయలేకపోయాం. బ్యాకెండ్ నడుస్తోందో లేదో చూడండి.",
    noReply: "ఇంకా సమాధానం రాలేదు. ఈ పేజీ స్వయంచాలకంగా నవీకరించబడుతుంది.",
  },
  hi: {
    title: "अनुरोध ट्रैक करें",
    subtitle: "अपने सहायता अनुरोधों की स्थिति देखें।",
    back: "वापस",
    refresh: "रिफ्रेश",
    loading: "आपके अनुरोध लोड हो रहे हैं...",
    empty: "अभी तक कोई सहायता अनुरोध नहीं है।",
    emptyHint: "जब आप किसी सहायता संगठन से संपर्क करेंगे, तो आपका अनुरोध यहाँ दिखाई देगा।",
    submitted: "अनुरोध भेजा गया",
    waiting: "जवाब की प्रतीक्षा",
    replied: "जवाब प्राप्त हुआ",
    organisation: "संगठन",
    requestId: "अनुरोध आईडी",
    submittedOn: "भेजने की तारीख",
    problem: "आपकी समस्या",
    reply: "संगठन का जवाब",
    demo: "डेमो अनुरोध",
    demoNotice: "यह एक स्थानीय डेमो है। जवाब नकली हैं, वास्तविक NGO के जवाब नहीं।",
    error: "अनुरोध लोड नहीं हो सके। कृपया बैकएंड चालू होने की जाँच करें।",
    noReply: "अभी तक कोई जवाब नहीं मिला है। यह पेज अपने आप अपडेट होता रहेगा।",
  },
  ta: {
    title: "கோரிக்கைகளைக் கண்காணிக்கவும்",
    subtitle: "உங்கள் உதவி கோரிக்கைகளின் நிலையைப் பார்க்கவும்.",
    back: "பின்செல்",
    refresh: "புதுப்பிக்கவும்",
    loading: "உங்கள் கோரிக்கைகள் ஏற்றப்படுகின்றன...",
    empty: "இதுவரை உதவி கோரிக்கைகள் இல்லை.",
    emptyHint: "உதவி அமைப்பைத் தொடர்பு கொண்டதும் உங்கள் கோரிக்கை இங்கே தோன்றும்.",
    submitted: "கோரிக்கை அனுப்பப்பட்டது",
    waiting: "பதிலுக்காகக் காத்திருக்கிறது",
    replied: "பதில் கிடைத்தது",
    organisation: "அமைப்பு",
    requestId: "கோரிக்கை ஐடி",
    submittedOn: "அனுப்பிய தேதி",
    problem: "உங்கள் பிரச்சினை",
    reply: "அமைப்பின் பதில்",
    demo: "டெமோ கோரிக்கை",
    demoNotice: "இது உள்ளூர் டெமோ. பதில்கள் உருவகப்படுத்தப்பட்டவை; உண்மையான NGO பதில்கள் அல்ல.",
    error: "கோரிக்கைகளை ஏற்ற முடியவில்லை. பின்தள சேவை இயங்குகிறதா எனச் சரிபார்க்கவும்.",
    noReply: "இதுவரை பதில் வரவில்லை. இந்தப் பக்கம் தானாகவே புதுப்பிக்கப்படும்.",
  },
  kn: {
    title: "ವಿನಂತಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    subtitle: "ನಿಮ್ಮ ಸಹಾಯ ವಿನಂತಿಗಳ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    back: "ಹಿಂದಕ್ಕೆ",
    refresh: "ರಿಫ್ರೆಶ್",
    loading: "ನಿಮ್ಮ ವಿನಂತಿಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
    empty: "ಇನ್ನೂ ಯಾವುದೇ ಸಹಾಯ ವಿನಂತಿಗಳಿಲ್ಲ.",
    emptyHint: "ನೀವು ಸಹಾಯ ಸಂಸ್ಥೆಯನ್ನು ಸಂಪರ್ಕಿಸಿದಾಗ ನಿಮ್ಮ ವಿನಂತಿ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
    submitted: "ವಿನಂತಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
    waiting: "ಉತ್ತರಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
    replied: "ಉತ್ತರ ಬಂದಿದೆ",
    organisation: "ಸಂಸ್ಥೆ",
    requestId: "ವಿನಂತಿ ಐಡಿ",
    submittedOn: "ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ",
    problem: "ನಿಮ್ಮ ಸಮಸ್ಯೆ",
    reply: "ಸಂಸ್ಥೆಯ ಉತ್ತರ",
    demo: "ಡೆಮೊ ವಿನಂತಿ",
    demoNotice: "ಇದು ಸ್ಥಳೀಯ ಡೆಮೊ. ಉತ್ತರಗಳು ಅನುಕರಿಸಲ್ಪಟ್ಟವು; ನಿಜವಾದ NGO ಉತ್ತರಗಳಲ್ಲ.",
    error: "ವಿನಂತಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.",
    noReply: "ಇನ್ನೂ ಉತ್ತರ ಬಂದಿಲ್ಲ. ಈ ಪುಟವು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನವೀಕರಿಸುತ್ತದೆ.",
  },
  bn: {
    title: "অনুরোধ ট্র্যাক করুন",
    subtitle: "আপনার সহায়তার অনুরোধগুলির অবস্থা দেখুন।",
    back: "ফিরে যান",
    refresh: "রিফ্রেশ",
    loading: "আপনার অনুরোধগুলি লোড হচ্ছে...",
    empty: "এখনও কোনো সহায়তার অনুরোধ নেই।",
    emptyHint: "আপনি কোনো সহায়তা সংস্থার সঙ্গে যোগাযোগ করলে আপনার অনুরোধ এখানে দেখা যাবে।",
    submitted: "অনুরোধ জমা হয়েছে",
    waiting: "উত্তরের অপেক্ষায়",
    replied: "উত্তর পাওয়া গেছে",
    organisation: "সংস্থা",
    requestId: "অনুরোধ আইডি",
    submittedOn: "জমা দেওয়ার তারিখ",
    problem: "আপনার সমস্যা",
    reply: "সংস্থার উত্তর",
    demo: "ডেমো অনুরোধ",
    demoNotice: "এটি একটি স্থানীয় ডেমো। উত্তরগুলি অনুকরণ করা হয়েছে, প্রকৃত NGO-র উত্তর নয়।",
    error: "অনুরোধ লোড করা যায়নি। ব্যাকএন্ড চালু আছে কিনা পরীক্ষা করুন।",
    noReply: "এখনও কোনো উত্তর আসেনি। এই পৃষ্ঠা স্বয়ংক্রিয়ভাবে আপডেট হবে।",
  },
};

function TrackRequests({ onBack }) {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async (showLoader = false) => {
    if (showLoader) setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ngo-email/requests`);

      if (!response.ok) {
        throw new Error("Unable to fetch requests");
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setError("");
    } catch (err) {
      console.error("Track requests error:", err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(true);

    const interval = setInterval(() => {
      loadRequests(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleString(
      language === "te" ? "te-IN" :
      language === "hi" ? "hi-IN" :
      language === "ta" ? "ta-IN" :
      language === "kn" ? "kn-IN" :
      language === "bn" ? "bn-IN" : "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getStatus = (status) => {
    if (status === "replied") {
      return { label: t.replied, className: "track-status-replied" };
    }

    if (status === "sent") {
      return { label: t.waiting, className: "track-status-waiting" };
    }

    return { label: t.submitted, className: "track-status-submitted" };
  };

  return (
    <div className="track-page">
      <header className="track-header">
        <button className="track-back-button" onClick={onBack}>
          <ArrowLeft size={19} />
          {t.back}
        </button>

        <button
          className="track-refresh-button"
          onClick={() => loadRequests(true)}
          disabled={loading}
        >
          <RefreshCw size={17} />
          {t.refresh}
        </button>
      </header>

      <main className="track-main">
        <div className="track-heading">
          <div className="track-heading-icon">
            <ClipboardList size={27} />
          </div>
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>

        {loading && (
          <div className="track-message">
            <RefreshCw className="track-spin" size={22} />
            <p>{t.loading}</p>
          </div>
        )}

        {!loading && error && (
          <div className="track-error">
            <AlertCircle size={22} />
            <p>{error}</p>
            <button onClick={() => loadRequests(true)}>{t.refresh}</button>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="track-empty">
            <ClipboardList size={42} />
            <h2>{t.empty}</h2>
            <p>{t.emptyHint}</p>
          </div>
        )}

        {!loading && !error && requests.length > 0 && (
          <section className="track-request-list">
            {requests.map((request) => {
              const status = getStatus(request.status);

              return (
                <article className="track-request-card" key={request.request_id}>
                  <div className="track-card-top">
                    <div className="track-card-icon">
                      <MessageSquare size={21} />
                    </div>
                    <span className={`track-status ${status.className}`}>
                      {request.reply_received && <CheckCircle size={14} />}
                      {!request.reply_received && <Clock size={14} />}
                      {status.label}
                    </span>
                  </div>

                  <h2>{request.organisation}</h2>

                  <div className="track-demo-label">{t.demo}</div>

                  <div className="track-meta">
                    <div>
                      <span>{t.requestId}</span>
                      <strong>{request.request_id}</strong>
                    </div>
                    <div>
                      <span>{t.submittedOn}</span>
                      <strong>{formatDate(request.created_at)}</strong>
                    </div>
                  </div>

                  {request.problem_description && (
                    <div className="track-problem">
                      <h3>{t.problem}</h3>
                      <p>{request.problem_description}</p>
                    </div>
                  )}

                  {request.reply_received ? (
                    <div className="track-reply">
                      <h3>
                        <CheckCircle size={17} />
                        {t.reply}
                      </h3>
                      <p>{request.reply_text}</p>
                      <span>{formatDate(request.replied_at)}</span>
                    </div>
                  ) : (
                    <div className="track-waiting-note">
                      <Clock size={17} />
                      <p>{t.noReply}</p>
                    </div>
                  )}

                  <p className="track-demo-notice">{t.demoNotice}</p>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default TrackRequests;
