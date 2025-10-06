import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageEnforcer = ({ children }) => {
  const { i18n } = useTranslation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const handleLanguageChange = () => {
      document.documentElement.lang = i18n.language;
      const rtlLanguages = ['ar', 'he', 'fa'];
      document.documentElement.dir = rtlLanguages.includes(i18n.language) ? 'rtl' : 'ltr';
    };

    i18n.on('languageChanged', handleLanguageChange);
    handleLanguageChange();

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div className={`language-enforcer lang-${currentLanguage}`}>
      {children}
    </div>
  );
};

export default LanguageEnforcer;