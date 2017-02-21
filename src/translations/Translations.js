import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';
import nl from 'react-intl/locale-data/nl';
import se from 'react-intl/locale-data/se';

import enMessage from './en.json';
import zhMessage from './zh.json';
import frMessage from './fr.json';
import deMessage from './de.json';
import ruMessage from './ru.json';
import koMessage from './ko.json';
import nlMessage from './nl.json';
import seMessage from './se.json';

addLocaleData([...en, ...zh, ...fr, ...de, ...ru, ...ko, ...nl, ...se]);

const localeList = {
  en: enMessage,
  zh: zhMessage,
  fr: frMessage,
  de: deMessage,
  ru: ruMessage,
  ko: koMessage,
  nl: nlMessage,
  se: seMessage,
};

function getMessageWithLocale(appLocale) {
  const browserLocale = navigator.language || navigator.userLanguage; // eslint-disable-line
  let locale = appLocale || browserLocale;
  locale = locale.substr(0, 2); // get en from en-GB or en

  if (localeList[locale]) {
    return { messages: localeList[locale], locale };
  }
  return { messages: enMessage, locale: 'en' };
}

export default getMessageWithLocale;
