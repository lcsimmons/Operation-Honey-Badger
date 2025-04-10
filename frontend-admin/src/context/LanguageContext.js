import { createContext, useEffect, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('reportLanguage');
    if (saved) setLanguage(saved);
  }, []);

  const updateLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('reportLanguage', newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
