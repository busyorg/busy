import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import cs from 'react-intl/locale-data/cs';
import es from 'react-intl/locale-data/es';
import zh from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';
import nl from 'react-intl/locale-data/nl';
import sv from 'react-intl/locale-data/sv';
import pl from 'react-intl/locale-data/pl';

import enTranslations from '../locales/en.json';
import csTranslations from '../locales/cs.json';
import esTranslations from '../locales/es.json';
import zhTranslations from '../locales/zh.json';
import frTranslations from '../locales/fr.json';
import deTranslations from '../locales/de.json';
import ruTranslations from '../locales/ru.json';
import koTranslations from '../locales/ko.json';
import nlTranslations from '../locales/nl.json';
import svTranslations from '../locales/sv.json';
import plTranslations from '../locales/pl.json';

addLocaleData([...en, ...cs, ...es, ...zh, ...fr, ...de, ...ru, ...ko, ...nl, ...sv, ...pl]);

export const translations = {
  en: enTranslations,
  cs: csTranslations,
  es: esTranslations,
  zh: zhTranslations,
  fr: frTranslations,
  de: deTranslations,
  ru: ruTranslations,
  ko: koTranslations,
  nl: nlTranslations,
  sv: svTranslations,
  pl: plTranslations,
};

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

  if (translations[locale]) {
    return locale;
  }

  return 'en';
};

const getTranslations = appLocale => translations[getAvailableLocale(appLocale)];

export default getTranslations;
