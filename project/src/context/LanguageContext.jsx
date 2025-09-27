import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('dbt_language', lang);
  };

  React.useEffect(() => {
    const storedLang = localStorage.getItem('dbt_language');
    if (storedLang) {
      changeLanguage(storedLang);
    }
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    isRTL: currentLanguage === 'ar' // Add more RTL languages if needed
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext }