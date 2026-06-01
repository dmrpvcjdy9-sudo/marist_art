import { useState, useCallback } from "react";
import es from "../locales/es";
import en from "../locales/en";

const locales = { es, en };

export default function useLanguage() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("marist-art-lang") || "es";
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "es" ? "en" : "es";
      localStorage.setItem("marist-art-lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let value = locales[lang];
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    },
    [lang]
  );

  return { lang, t, toggleLang };
}