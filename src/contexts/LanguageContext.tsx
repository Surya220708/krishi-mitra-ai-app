import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'pa' | 'ta' | 'te' | 'gu' | 'mr' | 'bn';

export const LANGUAGES = {
  en: { name: 'English', native: 'English' },
  hi: { name: 'Hindi', native: 'हिन्दी' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ta: { name: 'Tamil', native: 'தமிழ்' },
  te: { name: 'Telugu', native: 'తెలుగు' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી' },
  mr: { name: 'Marathi', native: 'मराठी' },
  bn: { name: 'Bengali', native: 'বাংলা' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishiMitraLanguage', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('krishiMitraLanguage') as Language;
    if (savedLang && LANGUAGES[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    // Load translations for the current language
    import(`../translations/${language}.ts`)
      .then(module => {
        setTranslations(prev => ({
          ...prev,
          [language]: module.default
        }));
      })
      .catch(error => {
        console.error(`Failed to load translations for ${language}:`, error);
      });
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};