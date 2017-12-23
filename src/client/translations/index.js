export const availableLocales = ['en', 'cs', 'es', 'zh', 'fr', 'de', 'ru', 'ko', 'nl', 'sl', 'sv', 'pl', 'ar', 'tr', 'ro', 'ja', 'fil', 'th',
  'lo', 'id', 'ms', 'da', 'it', 'no', 'pt', 'vi', 'el', 'bg', 'uk', 'he', 'hi', 'ca', 'et', 'as', 'ta', 'bn', 'ne', 'yo', 'hr', 'hu'];

export const getBrowserLocale = () => {
  let detectedLocale;
  if (typeof navigator !== 'undefined') {
    detectedLocale =
      navigator.userLanguage ||
      navigator.language ||
      (navigator.languages && navigator.languages[0] ? navigator.languages[0] : undefined);
  }
  if (detectedLocale) {
    return detectedLocale.slice(0, 2);
  }
  return undefined;
};

export const getAvailableLocale = (appLocale) => {
  let locale = appLocale || 'auto';

  if (appLocale === 'auto') {
    locale = getBrowserLocale() || 'en';
  }

  if (availableLocales.includes(locale)) {
    return locale;
  }

  return 'en';
};
