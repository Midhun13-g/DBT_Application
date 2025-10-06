import { useTranslation } from 'react-i18next';

/**
 * Translation utility to ensure all text in the application is translatable
 * This utility provides helper functions to handle dynamic translations
 */

// Helper function to get translated text with fallback
export const getTranslatedText = (key, fallback = '', t) => {
  try {
    const translated = t(key);
    // If translation key is not found, i18next returns the key itself
    return translated !== key ? translated : fallback;
  } catch (error) {
    console.warn(`Translation key not found: ${key}`);
    return fallback;
  }
};

// Hook for component-level translations with fallback
export const useTranslationWithFallback = () => {
  const { t, i18n } = useTranslation();
  
  const translate = (key, fallback = '') => {
    return getTranslatedText(key, fallback, t);
  };

  return {
    t: translate,
    i18n,
    currentLanguage: i18n.language
  };
};

// Common translation keys that should be used throughout the app
export const TRANSLATION_KEYS = {
  // Common actions
  ACTIONS: {
    LEARN_MORE: 'common.learnMore',
    ACCESS_NOW: 'common.accessNow',
    START_QUIZ: 'common.startQuiz',
    CLOSE_QUIZ: 'common.closeQuiz',
    CHECK_STATUS_NOW: 'common.checkStatusNow',
    VIEW_GUIDE: 'common.viewGuide',
    MY_PROFILE: 'common.myProfile',
    VIEW_NOTICE_BOARD: 'common.viewNoticeBoard'
  },
  
  // Portal branding
  PORTAL: {
    TITLE: 'portal.title',
    SUBTITLE: 'portal.subtitle',
    MAIN_TITLE: 'portal.mainTitle'
  },
  
  // Navigation
  NAV: {
    HOME: 'nav.home',
    DBT_CHECK: 'nav.dbtCheck',
    SEEDING_GUIDE: 'nav.seedingGuide',
    AWARENESS: 'nav.awareness',
    CAMP_BOOKING: 'nav.campBooking',
    LOGIN: 'nav.login',
    LOGOUT: 'nav.logout',
    DASHBOARD: 'nav.dashboard'
  },
  
  // Sections
  SECTIONS: {
    DBT_VS_AADHAAR: {
      TITLE: 'sections.dbtVsAadhaar.title',
      DBT_TITLE: 'sections.dbtVsAadhaar.dbtTitle',
      DBT_DESCRIPTION: 'sections.dbtVsAadhaar.dbtDescription',
      AADHAAR_TITLE: 'sections.dbtVsAadhaar.aadhaarTitle',
      AADHAAR_DESCRIPTION: 'sections.dbtVsAadhaar.aadhaarDescription'
    },
    UPDATES: {
      TITLE: 'sections.updates.title',
      SUBTITLE: 'sections.updates.subtitle'
    },
    QUICK_ACCESS: {
      TITLE: 'sections.quickAccess.title',
      SUBTITLE: 'sections.quickAccess.subtitle'
    },
    FEATURES: {
      TITLE: 'sections.features.title'
    },
    SCHEMES: {
      TITLE: 'sections.schemes.title',
      SUBTITLE: 'sections.schemes.subtitle'
    },
    QUIZ: {
      TITLE: 'sections.quiz.title',
      SUBTITLE: 'sections.quiz.subtitle'
    },
    CTA: {
      TITLE: 'sections.cta.title',
      SUBTITLE: 'sections.cta.subtitle'
    }
  }
};

// Function to validate if all required translations exist
export const validateTranslations = (language, requiredKeys) => {
  const { t } = useTranslation();
  const missingKeys = [];
  
  requiredKeys.forEach(key => {
    const translated = t(key);
    if (translated === key) {
      missingKeys.push(key);
    }
  });
  
  if (missingKeys.length > 0) {
    console.warn(`Missing translations for ${language}:`, missingKeys);
  }
  
  return missingKeys.length === 0;
};

// Function to get all translation keys from an object
export const getAllTranslationKeys = (obj, prefix = '') => {
  let keys = [];
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllTranslationKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  
  return keys;
};

export default {
  getTranslatedText,
  useTranslationWithFallback,
  TRANSLATION_KEYS,
  validateTranslations,
  getAllTranslationKeys
};