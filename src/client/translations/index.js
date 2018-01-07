import { addLocaleData } from 'react-intl';
import { setUsedLocale } from '../app/appActions';
import { getLocale } from '../reducers';
import enTranslations from '../locales/en.json';

export function getDefaultTranslation() {
  return enTranslations;
}

export const availableLocales = [
  'en',
  'cs',
  'es',
  'zh',
  'fr',
  'de',
  'ru',
  'ko',
  'nl',
  'sl',
  'sv',
  'pl',
  'ar',
  'tr',
  'ro',
  'ja',
  'fil',
  'th',
  'lo',
  'id',
  'ms',
  'da',
  'it',
  'no',
  'pt',
  'vi',
  'el',
  'bg',
  'uk',
  'he',
  'hi',
  'ca',
  'et',
  'as',
  'ta',
  'bn',
  'ne',
  'yo',
  'hr',
  'hu',
];

const rtlLocales = ['he', 'ar', 'far', 'yi', 'ku', 'ur', 'dv', 'ha', 'ps'];

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

export const getLocaleDirection = locale => (rtlLocales.includes(locale) ? 'rtl' : 'ltr');

export const getAvailableLocale = appLocale => {
  let locale = appLocale || 'auto';

  if (appLocale === 'auto') {
    locale = getBrowserLocale() || 'en';
  }

  if (availableLocales.includes(locale)) {
    return locale;
  }

  return 'en';
};

export const loadTranslations = async store => {
  const state = store.getState();
  const availableLocale = getAvailableLocale(getLocale(state));

  const localeDataPromise = await import(`react-intl/locale-data/${availableLocale}`);
  const translationsPromise = await import(`../locales/${availableLocale}.json`);

  const [localeData, translations] = await Promise.all([localeDataPromise, translationsPromise]);

  addLocaleData(localeData);
  global.translations = translations;
  store.dispatch(setUsedLocale(availableLocale));
};
