import React, { useMemo, useState } from "react";
import portalData from "./government_portal_guides.json";
import { useLanguage } from "./LanguageContext";
import "./GovernmentPortalGuides.css";

const UI_COPY = {
  en: {
    back: "Back to government organisations",
    backList: "Back",
    eyebrow: "GOVERNMENT FILING GUIDE",
    afterReport: "AFTER YOUR REPORT IS CONFIRMED",
    heading: "Government organisations",
    intro: "Select an organisation to see how to approach it and file the relevant complaint.",
    official: "Open official website ↗",
    appropriate: "When this route is appropriate",
    notFor: "Do not use this route for",
    steps: "Step-by-step instructions",
    prepare: "Keep these details ready",
    after: "After submitting",
    cautions: "Important limitations",
    sources: "Official sources",
    disclaimer: "ShramSetu provides guidance only. The worker must review the live official portal, complete identity verification and submit the complaint themselves. Requirements may change.",
    listDisclaimer: "These are government routes, not NGO referrals. A recommendation does not mean a complaint has been submitted. Select a guide and complete the process on the official website or with the relevant office.",
    name: "Government organisation",
    view: "View filing instructions →"
  },
  te: {
    back: "ప్రభుత్వ సంస్థలకు తిరిగి వెళ్లండి",
    backList: "వెనక్కి వెళ్లండి",
    eyebrow: "ప్రభుత్వ ఫిర్యాదు మార్గదర్శి",
    afterReport: "మీ నివేదిక నిర్ధారించిన తర్వాత",
    heading: "ప్రభుత్వ సంస్థలు",
    intro: "సంబంధిత సంస్థను ఎంచుకుని ఫిర్యాదు చేసే విధానాన్ని తెలుసుకోండి.",
    official: "అధికారిక వెబ్‌సైట్ తెరవండి ↗",
    appropriate: "ఈ మార్గాన్ని ఎప్పుడు ఉపయోగించాలి",
    notFor: "ఈ మార్గాన్ని వీటి కోసం ఉపయోగించవద్దు",
    steps: "దశలవారీ సూచనలు",
    prepare: "ఈ వివరాలను సిద్ధంగా ఉంచుకోండి",
    after: "సమర్పించిన తర్వాత",
    cautions: "ముఖ్యమైన పరిమితులు",
    sources: "అధికారిక మూలాలు",
    disclaimer: "ShramSetu మార్గదర్శక సమాచారాన్ని మాత్రమే అందిస్తుంది. కార్మికుడు అధికారిక పోర్టల్‌ను పరిశీలించి, గుర్తింపు ధృవీకరణ పూర్తి చేసి, ఫిర్యాదును స్వయంగా సమర్పించాలి. అవసరాలు మారవచ్చు.",
    listDisclaimer: "ఇవి ప్రభుత్వ ఫిర్యాదు మార్గాలు, NGO సిఫార్సులు కావు. సిఫార్సు చేసినంత మాత్రాన ఫిర్యాదు సమర్పించబడదు. మార్గదర్శిని ఎంచుకుని అధికారిక వెబ్‌సైట్ లేదా సంబంధిత కార్యాలయం ద్వారా ప్రక్రియను పూర్తి చేయండి.",
    name: "ప్రభుత్వ సంస్థ",
    view: "ఫిర్యాదు సూచనలు చూడండి →"
  },
  hi: {
    back: "सरकारी संगठनों पर वापस जाएं",
    backList: "वापस",
    eyebrow: "सरकारी शिकायत मार्गदर्शिका",
    afterReport: "आपकी रिपोर्ट की पुष्टि के बाद",
    heading: "सरकारी संगठन",
    intro: "शिकायत करने का तरीका जानने के लिए एक संगठन चुनें।",
    official: "आधिकारिक वेबसाइट खोलें ↗",
    appropriate: "इस मार्ग का उपयोग कब करें",
    notFor: "इस मार्ग का उपयोग इनके लिए न करें",
    steps: "चरण-दर-चरण निर्देश",
    prepare: "ये विवरण तैयार रखें",
    after: "जमा करने के बाद",
    cautions: "महत्वपूर्ण सीमाएं",
    sources: "आधिकारिक स्रोत",
    disclaimer: "ShramSetu केवल मार्गदर्शन प्रदान करता है। कर्मचारी को आधिकारिक पोर्टल की जांच करके पहचान सत्यापन और अंतिम शिकायत जमा स्वयं करनी होगी। आवश्यकताएं बदल सकती हैं।",
    listDisclaimer: "ये सरकारी शिकायत मार्ग हैं, NGO रेफरल नहीं। सिफारिश का अर्थ शिकायत जमा होना नहीं है। मार्गदर्शिका चुनें और आधिकारिक वेबसाइट या संबंधित कार्यालय के माध्यम से प्रक्रिया पूरी करें।",
    name: "सरकारी संगठन",
    view: "शिकायत के निर्देश देखें →"
  },
  ta: {
    back: "அரசு நிறுவனங்களுக்குத் திரும்பு",
    backList: "பின்னால்",
    eyebrow: "அரசு புகார் வழிகாட்டி",
    afterReport: "உங்கள் அறிக்கை உறுதிசெய்யப்பட்ட பிறகு",
    heading: "அரசு நிறுவனங்கள்",
    intro: "புகார் அளிக்கும் முறையை அறிய ஒரு நிறுவனத்தைத் தேர்ந்தெடுக்கவும்.",
    official: "அதிகாரப்பூர்வ இணையதளத்தைத் திறக்கவும் ↗",
    appropriate: "இந்த வழியை எப்போது பயன்படுத்த வேண்டும்",
    notFor: "இந்த வழியை இவற்றுக்குப் பயன்படுத்த வேண்டாம்",
    steps: "படிப்படியான வழிமுறைகள்",
    prepare: "இந்த விவரங்களைத் தயாராக வைத்திருங்கள்",
    after: "சமர்ப்பித்த பிறகு",
    cautions: "முக்கியமான வரம்புகள்",
    sources: "அதிகாரப்பூர்வ ஆதாரங்கள்",
    disclaimer: "ShramSetu வழிகாட்டுதலை மட்டுமே வழங்குகிறது. பணியாளர் அதிகாரப்பூர்வ இணையதளத்தைச் சரிபார்த்து, அடையாளச் சரிபார்ப்பை முடித்து, புகாரைத் தானாகவே சமர்ப்பிக்க வேண்டும். தேவைகள் மாறலாம்.",
    listDisclaimer: "இவை அரசு புகார் வழிகள்; NGO பரிந்துரைகள் அல்ல. பரிந்துரை செய்யப்பட்டதால் புகார் சமர்ப்பிக்கப்பட்டதாகாது. வழிகாட்டியைத் தேர்ந்தெடுத்து அதிகாரப்பூர்வ இணையதளம் அல்லது அலுவலகம் மூலம் செயல்முறையை முடிக்கவும்.",
    name: "அரசு நிறுவனம்",
    view: "புகார் வழிமுறைகளைப் பார்க்கவும் →"
  },
  kn: {
    back: "ಸರ್ಕಾರಿ ಸಂಸ್ಥೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    backList: "ಹಿಂದಕ್ಕೆ",
    eyebrow: "ಸರ್ಕಾರಿ ದೂರು ಮಾರ್ಗದರ್ಶಿ",
    afterReport: "ನಿಮ್ಮ ವರದಿ ದೃಢೀಕರಿಸಿದ ನಂತರ",
    heading: "ಸರ್ಕಾರಿ ಸಂಸ್ಥೆಗಳು",
    intro: "ದೂರು ಸಲ್ಲಿಸುವ ವಿಧಾನ ತಿಳಿಯಲು ಒಂದು ಸಂಸ್ಥೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    official: "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ತೆರೆಯಿರಿ ↗",
    appropriate: "ಈ ಮಾರ್ಗವನ್ನು ಯಾವಾಗ ಬಳಸಬೇಕು",
    notFor: "ಈ ಮಾರ್ಗವನ್ನು ಇವುಗಳಿಗೆ ಬಳಸಬೇಡಿ",
    steps: "ಹಂತ ಹಂತದ ಸೂಚನೆಗಳು",
    prepare: "ಈ ವಿವರಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ",
    after: "ಸಲ್ಲಿಸಿದ ನಂತರ",
    cautions: "ಪ್ರಮುಖ ಮಿತಿಗಳು",
    sources: "ಅಧಿಕೃತ ಮೂಲಗಳು",
    disclaimer: "ShramSetu ಮಾರ್ಗದರ್ಶನವನ್ನು ಮಾತ್ರ ನೀಡುತ್ತದೆ. ಕಾರ್ಮಿಕರು ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ, ಗುರುತಿನ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ, ದೂರನ್ನು ಸ್ವತಃ ಸಲ್ಲಿಸಬೇಕು. ಅವಶ್ಯಕತೆಗಳು ಬದಲಾಗಬಹುದು.",
    listDisclaimer: "ಇವು ಸರ್ಕಾರಿ ದೂರು ಮಾರ್ಗಗಳು; NGO ಉಲ್ಲೇಖಗಳಲ್ಲ. ಶಿಫಾರಸು ಮಾಡಿದ ಮಾತ್ರಕ್ಕೆ ದೂರು ಸಲ್ಲಿಕೆಯಾಗುವುದಿಲ್ಲ. ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಸಂಬಂಧಿತ ಕಚೇರಿಯಲ್ಲಿ ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣಗೊಳಿಸಿ.",
    name: "ಸರ್ಕಾರಿ ಸಂಸ್ಥೆ",
    view: "ದೂರು ಸೂಚನೆಗಳನ್ನು ನೋಡಿ →"
  },
  bn: {
    back: "সরকারি সংস্থাগুলিতে ফিরে যান",
    backList: "ফিরে যান",
    eyebrow: "সরকারি অভিযোগ নির্দেশিকা",
    afterReport: "আপনার প্রতিবেদন নিশ্চিত হওয়ার পরে",
    heading: "সরকারি সংস্থা",
    intro: "অভিযোগ জানানোর পদ্ধতি জানতে একটি সংস্থা নির্বাচন করুন।",
    official: "সরকারি ওয়েবসাইট খুলুন ↗",
    appropriate: "কখন এই পথ ব্যবহার করবেন",
    notFor: "এই পথগুলি এর জন্য ব্যবহার করবেন না",
    steps: "ধাপে ধাপে নির্দেশাবলী",
    prepare: "এই তথ্যগুলি প্রস্তুত রাখুন",
    after: "জমা দেওয়ার পরে",
    cautions: "গুরুত্বপূর্ণ সীমাবদ্ধতা",
    sources: "সরকারি সূত্র",
    disclaimer: "ShramSetu শুধুমাত্র নির্দেশিকা দেয়। কর্মীকে সরকারি পোর্টাল পরীক্ষা করে পরিচয় যাচাই এবং অভিযোগ জমা নিজে সম্পন্ন করতে হবে। প্রয়োজনীয়তা পরিবর্তিত হতে পারে।",
    listDisclaimer: "এগুলি সরকারি অভিযোগ জানানোর পথ, NGO রেফারেল নয়। সুপারিশ করা মানেই অভিযোগ জমা হয়েছে এমন নয়। নির্দেশিকা নির্বাচন করে সরকারি ওয়েবসাইট বা সংশ্লিষ্ট অফিসে প্রক্রিয়া সম্পন্ন করুন।",
    name: "সরকারি সংস্থা",
    view: "অভিযোগের নির্দেশাবলী দেখুন →"
  }
};

// Accept language codes (te), locale codes (te-IN), and language names (Telugu/తెలుగు).
function normalizeLanguage(value) {
  if (value && typeof value === "object") {
    value =
      value.code ??
      value.languageCode ??
      value.locale ??
      value.value ??
      value.name ??
      "";
  }

  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "en";

  const base = raw.split(/[-_]/)[0];
  const aliases = {
    english: "en",
    తెలుగు: "te",
    telugu: "te",
    hindi: "hi",
    हिन्दी: "hi",
    हिंदी: "hi",
    tamil: "ta",
    தமிழ்: "ta",
    kannada: "kn",
    ಕನ್ನಡ: "kn",
    bengali: "bn",
    bangla: "bn",
    বাংলা: "bn"
  };

  return UI_COPY[base] ? base : aliases[raw] || "en";
}

export default function GovernmentPortalGuides({
  governmentRoutes = [],
  onBack
}) {
  const languageContext = useLanguage() || {};
  console.log("GOVERNMENT GUIDE LANGUAGE:", language);
console.log(
  "TELUGU TRANSLATION:",
  portalData.portals[0]?.translations?.te
);
  const languageValue =
    languageContext.language ??
    languageContext.lang ??
    languageContext.currentLanguage ??
    languageContext.selectedLanguage ??
    "en";

  const lang = normalizeLanguage(languageValue);
  const labels = UI_COPY[lang] || UI_COPY.en;
  const [selectedId, setSelectedId] = useState(null);

  const allGuides = Array.isArray(portalData?.portals)
    ? portalData.portals
    : [];

  const visibleGuides = useMemo(() => {
    if (!Array.isArray(governmentRoutes) || governmentRoutes.length === 0) {
      return allGuides;
    }

    const ids = new Set(
      governmentRoutes
        .map((route) =>
          String(route?.portal_id || route?.id || "").trim().toLowerCase()
        )
        .filter(Boolean)
    );

    const names = governmentRoutes
      .map((route) => String(route?.name || route?.title || "").trim().toLowerCase())
      .filter(Boolean);

    const matched = allGuides.filter((guide) => {
      const guideId = String(guide.id || "").toLowerCase();
      const guideName = String(guide.name || "").toLowerCase();

      return (
        ids.has(guideId) ||
        names.some(
          (name) => name.includes(guideName) || guideName.includes(name)
        )
      );
    });

    // If route identifiers do not match the directory, show all available guides
    // rather than rendering an empty page.
    return matched.length > 0 ? matched : allGuides;
  }, [governmentRoutes, allGuides]);

  const selected = allGuides.find((guide) => guide.id === selectedId) || null;
  const translatedSelected = selected?.translations?.[lang] || {};
  const content = selected ? { ...selected, ...translatedSelected } : null;

  if (selected && content) {
    return (
      <section className="ss-guides">
        <button
          className="ss-back"
          type="button"
          onClick={() => setSelectedId(null)}
        >
          ← {labels.back}
        </button>

        <div className="ss-guide-heading">
          <span className="ss-eyebrow">{labels.eyebrow}</span>
          <h2>{content.name || selected.name}</h2>
          <p>{content.scope || selected.scope}</p>
          <span className="ss-guide-type">{content.type || selected.type}</span>
        </div>

        <div className="ss-guide-actions">
          <a
            className="ss-official-link"
            href={selected.official_url || selected.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {labels.official}
          </a>
        </div>

        <GuideList title={labels.appropriate} items={content.when_to_use || selected.when_to_use} />
        <GuideList title={labels.notFor} items={content.not_for || selected.not_for} warning />
        <GuideList title={labels.steps} items={content.steps || selected.steps} numbered />
        <GuideList title={labels.prepare} items={content.prepare || selected.prepare} />
        <GuideList title={labels.after} items={content.after || selected.after} />
        <GuideList title={labels.cautions} items={content.cautions || selected.cautions} warning />

        <div className="ss-source-list">
          <h3>{labels.sources}</h3>
          {(selected.sources || []).map((url) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          ))}
        </div>

        <p className="ss-disclaimer">{labels.disclaimer}</p>
      </section>
    );
  }

  return (
    <section className="ss-guides">
      <div className="ss-guide-heading">
        <span className="ss-eyebrow">{labels.afterReport}</span>
        <h2>{labels.heading}</h2>
        <p>{labels.intro}</p>
      </div>

      {onBack && (
        <button className="ss-back" type="button" onClick={onBack}>
          ← {labels.backList}
        </button>
      )}

      <div className="ss-guide-grid">
        {visibleGuides.map((guide) => {
          const translated = guide.translations?.[lang] || {};
          return (
            <button
              className="ss-guide-card"
              type="button"
              key={guide.id}
              onClick={() => setSelectedId(guide.id)}
            >
              <span className="ss-card-title">
                {translated.name || guide.name}
              </span>
              <span className="ss-card-scope">
                {translated.scope || guide.scope}
              </span>
              <span className="ss-card-cta">{labels.view}</span>
            </button>
          );
        })}
      </div>

      <p className="ss-disclaimer">{labels.listDisclaimer}</p>
    </section>
  );
}

function GuideList({ title, items = [], numbered = false, warning = false }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const Tag = numbered ? "ol" : "ul";

  return (
    <section className={`ss-guide-block ${warning ? "ss-warning" : ""}`}>
      <h3>{title}</h3>
      <Tag>
        {items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </Tag>
    </section>
  );
}
