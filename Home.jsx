
import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  HandHelping,
  ClipboardList,
  Mic,
  Languages,
  BriefcaseBusiness,
  ShieldAlert,
  X,
  ArrowRight,
} from "lucide-react";

import { useLanguage } from "./LanguageContext";
import "./Home.css";
import ReportProblem from "./ReportProblem";
import InformationHub from "./InformationHub";
import TrackRequests from "./TrackRequests";
import PageSpeaker from "./PageSpeaker";

function Home({ onChangeLanguage }) {
  const { language, t } = useLanguage();

  const [showEmergency, setShowEmergency] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activeInfoSection, setActiveInfoSection] = useState(null);
  const [showTrackRequests, setShowTrackRequests] = useState(false);

  const options = [
    {
      icon: AlertCircle,
      title: t("report"),
      number: "01",
      color: "green",
      id: "report",
    },
    {
      icon: BookOpen,
      title: t("rights"),
      number: "02",
      color: "gold",
      id: "rights",
    },
    {
      icon: HandHelping,
      title: t("help"),
      number: "03",
      color: "blue",
      id: "help",
    },
    {
      icon: ClipboardList,
      title: t("track"),
      number: "04",
      color: "green",
      id: "track",
    },
    {
      icon: BriefcaseBusiness,
      title: t("migrants"),
      number: "05",
      color: "gold",
      id: "migrants",
    },
  ];

  if (activeInfoSection) {
    return (
      <>
        <InformationHub
          section={activeInfoSection}
          onBack={() => setActiveInfoSection(null)}
          onChangeLanguage={onChangeLanguage}
          onTrackRequests={() => {
            setActiveInfoSection(null);
            setShowTrackRequests(true);
          }}
        />
        <PageSpeaker language={language} />
      </>
    );
  }

  if (showReport) {
    return (
      <>
        <ReportProblem
          onBack={() => setShowReport(false)}
          onChangeLanguage={onChangeLanguage}
        />
        <PageSpeaker language={language} />
      </>
    );
  }

  if (showTrackRequests) {
    return (
      <>
        <TrackRequests onBack={() => setShowTrackRequests(false)} />
        <PageSpeaker language={language} />
      </>
    );
  }

  return (
    <>
      <div className="home-page">
        <header className="home-header">
          <div className="home-brand">
            <div className="home-brand-mark">S</div>
            <div>
              <h2>ShramSetu</h2>
              <span>WORKER PROTECTION &amp; SUPPORT</span>
            </div>
          </div>

          <div className="home-header-actions">
            <button
              className="home-language-button"
              onClick={onChangeLanguage}
            >
              <Languages size={18} />
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        <main className="home-main">
          <div className="home-emergency-bar">
            <ShieldAlert size={19} />
            <span>{t("danger")}</span>
            <button onClick={() => setShowEmergency(true)}>
              <ArrowRight size={19} />
            </button>
          </div>

          <div className="home-welcome">
            <span className="home-eyebrow">
              {t("homeEyebrow")}
            </span>

            <h1>{t("homeTitle")}</h1>

            <p>{t("homeDescription")}</p>
          </div>

          <section className="home-options">
            {options.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  className="home-option-card"
                  key={option.id}
                  type="button"
                  onClick={() => {
                    if (option.id === "report") {
                      setShowReport(true);
                    } else if (
                      ["rights", "help", "migrants"].includes(option.id)
                    ) {
                      setActiveInfoSection(option.id);
                    } else if (option.id === "track") {
                      setShowTrackRequests(true);
                    }
                  }}
                >
                  <div className={`home-option-icon ${option.color}`}>
                    <Icon size={30} strokeWidth={1.8} />
                  </div>

                  <div className="home-option-text">
                    <span>{option.number}</span>
                    <h2>{option.title}</h2>
                  </div>

                  <span className="home-option-arrow">→</span>
                </button>
              );
            })}
          </section>

          <section className="home-voice-section">
            <div className="home-mic-icon">
              <Mic size={27} />
            </div>

            <div>
              <h3>{t("assistant")}</h3>
              <p>{t("voiceDescription")}</p>
            </div>

            <span className="home-voice-arrow">→</span>
          </section>
        </main>

        <footer className="home-footer">
          <span>SHRAMSETU © 2026</span>
          <span>{t("footerTagline")}</span>
        </footer>

        {showEmergency && (
          <div className="emergency-overlay">
            <div className="emergency-dialog">
              <button
                className="emergency-close"
                onClick={() => setShowEmergency(false)}
                aria-label={t("close")}
              >
                <X size={22} />
              </button>

              <div className="emergency-icon">
                <ShieldAlert size={32} />
              </div>

              <h2>{t("emergencyTitle")}</h2>
              <p>{t("emergencyText")}</p>

              <a className="emergency-call-button" href="tel:112">
                {t("emergencyCall")}
              </a>

              <button
                className="emergency-dismiss"
                onClick={() => setShowEmergency(false)}
              >
                {t("close")}
              </button>
            </div>
          </div>
        )}
      </div>

      <PageSpeaker language={language} />
    </>
  );
}

export default Home;
