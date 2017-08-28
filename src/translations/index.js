import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import zh from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';
import nl from 'react-intl/locale-data/nl';
import se from 'react-intl/locale-data/se';
import pl from 'react-intl/locale-data/pl';

import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import plTranslations from '../locales/pl.json';

addLocaleData([...en, ...es, ...zh, ...fr, ...de, ...ru, ...ko, ...nl, ...se, ...pl]);

export const translations = {
  en: enTranslations,
  fr: frTranslations,
  pl: plTranslations,
};

export const getAvailableLocale = (appLocale) => {
  let locale = 'en';
  if (typeof navigator !== 'undefined') {
    const browserLocale = navigator.language || navigator.userLanguage;
    locale = appLocale || browserLocale;
  }

  if (translations[locale]) {
    return locale;
  }
  return 'en';
};

const getTranslations = appLocale => translations[getAvailableLocale(appLocale)];

export default getTranslations;
