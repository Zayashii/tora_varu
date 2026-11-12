'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CONTENT, DEFAULT_LANG } from './content';

// Хэл сонголт.
// Эрэмбэ: 1) холбоосын ?lang=en, 2) өмнө нь сонгосон хэл (localStorage), 3) Монгол.
// Хэл солиход холбоос ?lang=en болж шинэчлэгдэх тул тэр холбоосыг хуваалцахад
// хүлээн авагч шууд англи хувилбарыг харна.

const STORAGE_KEY = 'toravaru-lang';

const LangContext = createContext({
  lang: DEFAULT_LANG,
  t: CONTENT[DEFAULT_LANG],
  setLang: () => {},
});

function readInitialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && CONTENT[fromUrl]) return fromUrl;
  } catch (e) {
    /* ignore */
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && CONTENT[stored]) return stored;
  } catch (e) {
    /* ignore */
  }
  return DEFAULT_LANG;
}

function writeUrlLang(lang) {
  try {
    const url = new URL(window.location.href);
    if (lang === DEFAULT_LANG) url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    window.history.replaceState(window.history.state, '', url.toString());
  } catch (e) {
    /* ignore */
  }
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    const initial = readInitialLang();
    if (initial !== DEFAULT_LANG) setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = CONTENT[lang].meta.title;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!CONTENT[next]) return;
    setLangState(next);
    writeUrlLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ lang, t: CONTENT[lang], setLang }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
