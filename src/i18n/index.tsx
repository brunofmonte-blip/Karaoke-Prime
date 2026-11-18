/**
 * Internacionalização leve do Karaoke Prime (PT-BR / EN-US), sem dependências.
 *
 * Uso nos componentes:
 *   const { tr, lang, setLang } = useI18n();
 *   <h1>{tr('Bem-vindo', 'Welcome')}</h1>
 *
 * Idioma inicial: ?lang=en|pt na URL > escolha salva > idioma do navegador
 * (português → PT; qualquer outro → EN, já que o foco é o mercado americano).
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'pt' | 'en';

const STORAGE_KEY = 'kp_lang';

function detectInitialLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'pt' || fromUrl === 'en') {
      // Link com ?lang= (ex.: anúncios nos EUA) vale para o resto da navegação
      window.localStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') return saved;
  } catch {
    // localStorage pode não existir (modo privado, iframes); segue para o navegador
  }
  const browser = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  return browser.startsWith('pt') ? 'pt' : 'en';
}

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Escolhe o texto do idioma atual: tr('Olá', 'Hello') */
  tr: (pt: string, en: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // sem persistência: o idioma vale só para esta visita
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, tr: (pt, en) => (lang === 'pt' ? pt : en) }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>');
  return ctx;
}

/** Botão PT | EN para o cabeçalho */
export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, setLang } = useI18n();
  const base = 'px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors';
  return (
    <div className={`flex items-center gap-1 border border-white/10 rounded-full p-0.5 ${className}`} role="group" aria-label="Language">
      {(['en', 'pt'] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`${base} ${lang === code ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'}`}
        >
          {code}
        </button>
      ))}
    </div>
  );
};
