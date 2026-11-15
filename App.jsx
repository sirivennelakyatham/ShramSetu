import { useState } from "react";
import "./App.css";
import { translations } from "./translations";
import { useLanguage } from "./LanguageContext";
import Home from "./Home";

const languages = [
  { code: "te", native: "తెలుగు", english: "Telugu", region: "తెలంగాణ" },
  { code: "hi", native: "हिन्दी", english: "Hindi", region: "भारत" },
  { code: "en", native: "English", english: "English", region: "India" },
  { code: "ta", native: "தமிழ்", english: "Tamil", region: "தமிழ்நாடு" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", region: "ಕರ್ನಾಟಕ" },
  { code: "bn", native: "বাংলা", english: "Bengali", region: "বাংলা" },
];

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { language, setLanguage, t } = useLanguage();
  const [showHome, setShowHome] = useState(false);

  if (showHome) {
  return <Home onChangeLanguage={() => setShowHome(false)} />;
}

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <a className="brand" href="/">
          <div className="brand-mark">
            <span>S</span>
          </div>

          <div className="brand-name">
            <strong>ShramSetu</strong>
            <small>THE BRIDGE TO YOUR RIGHTS</small>
          </div>
        </a>

        <div className="header-right">
          <span className="header-status">
            <span className="status-dot"></span>
            BUILT FOR EVERY VOICE
          </span>
        </div>
      </header>

      {/* MAIN LANDING SECTION */}
      <main>

        <section className="hero">

          {/* LEFT CONTENT */}
          <div className="hero-content">

            <div className="eyebrow">
              A PLATFORM FOR THE UNHEARD
            </div>

            <h1>
              Work should
              <br />
              never mean
              <br />
              <span>being unheard.</span>
            </h1>

            <p className="hero-description">
              Millions of informal and migrant workers face barriers
              to understanding their rights and accessing help.
              ShramSetu bridges that gap — through language, voice
              and human connection.
            </p>

            <div className="hero-points">

              <div className="hero-point">
                <span className="point-number">01</span>
                <div>
                  <strong>Speak freely</strong>
                  <p>Share your concerns in your own language.</p>
                </div>
              </div>

              <div className="hero-point">
                <span className="point-number">02</span>
                <div>
                  <strong>Understand your rights</strong>
                  <p>Access clear, spoken guidance and information.</p>
                </div>
              </div>

              <div className="hero-point">
                <span className="point-number">03</span>
                <div>
                  <strong>Reach real support</strong>
                  <p>Connect with organisations and people who can help.</p>
                </div>
              </div>

            </div>

            <div className="hero-bottom-note">
              <span className="sound-symbol">◖</span>
              VOICE-FIRST. MULTILINGUAL. PEOPLE-CENTRED.
            </div>

          </div>

          {/* RIGHT LANGUAGE PANEL */}
          <aside className="language-panel">

            <div className="panel-top">
              <span className="panel-index">01 / BEGIN HERE</span>
              <span className="panel-icon">↗</span>
            </div>

            {!selectedLanguage ? (
              <>
                <div className="panel-heading">
                  <h2>
                    Your language.
                    <br />
                    <span>Your starting point.</span>
                  </h2>

                  <p>
                    Choose the language you speak most comfortably.
                    ShramSetu begins with you.
                  </p>
                </div>

                <div className="language-list">

                  {languages.map((language, index) => (
                    <button
                      key={language.code}
                      className="language-option"
                      onClick={() => {
  setSelectedLanguage(language);
  setLanguage(language.code);
}}
                    >
                      <span className="language-index">
                        0{index + 1}
                      </span>

                      <span className="language-details">
                        <strong>{language.native}</strong>
                        <small>{language.english}</small>
                      </span>

                      <span className="language-arrow">↗</span>
                    </button>
                  ))}

                </div>

                <div className="panel-footer">
                  <span className="footer-audio-icon">◉</span>
                  <span>
                    Designed for people who prefer to speak
                    rather than type.
                  </span>
                </div>
              </>
            ) : (
              <div className="language-confirmation">
               <span className="confirmation-number">
  {t("languageSelected")}
</span>

                <p>
  {t("chosenLanguage").replace(
    "{language}",
    selectedLanguage.english
  )}
</p>
                <button
                  className="continue-button"
                 onClick={() => {
  localStorage.setItem(
    "shramsetu-language",
    selectedLanguage.code
  );
  setLanguage(selectedLanguage.code);
  setShowHome(true);
}}
                >
                 {t("continue")} <span>→</span>
                </button>

                <button
                  className="change-button"
                  onClick={() => setSelectedLanguage(null)}
                >
                  {t("changeLanguage")}
                </button>
              </div>
            )}

          </aside>

        </section>

        {/* BOTTOM VALUE STRIP */}
        <section className="value-strip">

          <div className="value-intro">
            <span>WHY SHRAMSETU</span>
            <strong>Access should not depend on language, literacy or location.</strong>
          </div>

          <div className="value-item">
            <span className="value-symbol">01</span>
            <div>
              <strong>Language without barriers</strong>
              <small>Designed around the worker's language.</small>
            </div>
          </div>

          <div className="value-item">
            <span className="value-symbol">02</span>
            <div>
              <strong>Voice beyond the screen</strong>
              <small>Speak, listen and navigate with audio.</small>
            </div>
          </div>

          <div className="value-item">
            <span className="value-symbol">03</span>
            <div>
              <strong>People connected to people</strong>
              <small>Independent and community-assisted access.</small>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span>SHRAMSETU © 2026</span>
        <span>EVERY WORKER. EVERY VOICE. EVERY RIGHT.</span>
      </footer>

    </div>
  );
}

export default App;