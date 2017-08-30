import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
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
import esTranslations from '../locales/es.json';
import zhTranslations from '../locales/zh.json';
import frTranslations from '../locales/fr.json';
import deTranslations from '../locales/de.json';
import ruTranslations from '../locales/ru.json';
import koTranslations from '../locales/ko.json';
import nlTranslations from '../locales/nl.json';
import svTranslations from '../locales/sv.json';
import plTranslations from '../locales/pl.json';

addLocaleData([...en, ...es, ...zh, ...fr, ...de, ...ru, ...ko, ...nl, ...sv, ...pl]);

export const translations = {
  en: enTranslations,
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

export const getAvailableLocale = (appLocale) => {
  let locale = appLocale || 'auto';

  if (typeof navigator !== 'undefined' && appLocale === 'auto') {
    locale =
      navigator.userLanguage ||
      navigator.language ||
      (navigator.languages && navigator.languages[0] ? navigator.languages[0] : 'en');
  }

  if (translations[locale.slice(0, 2)]) {
    return locale.slice(0, 2);
  }

  return 'en';
};

const getTranslations = appLocale => translations[getAvailableLocale(appLocale)];

export default getTranslations;
