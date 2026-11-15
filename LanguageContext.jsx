import { createContext, useContext, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem("shramsetu-language") || "en"
  );

  const setLanguage = (code) => {
    localStorage.setItem("shramsetu-language", code);
    setLanguageState(code);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}