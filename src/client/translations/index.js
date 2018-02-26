import { addLocaleData } from 'react-intl';
import _ from 'lodash';
import { setUsedLocale } from '../app/appActions';
import { getLocale } from '../reducers';

export const availableLocalesToReactIntl = {
  'af-ZA': '',
  'ar-SA': 'ar',
  'as-IN': 'as',
  'bg-BG': 'bg',
  'bn-BD': '',
  'bn-IN': 'bn',
  'bs-BA': '',
  'ca-ES': 'ca',
  'cs-CZ': 'cs',
  'da-DK': 'da',
  'de-DE': 'de',
  'el-GR': 'el',
  'en-US': 'en',
  'eo-UY': '',
  'es-ES': 'es',
  'et-EE': 'et',
  'fi-FI': '',
  'fil-PH': 'fil',
  'fr-FR': 'fr',
  'ha-HG': '',
  'he-IL': 'he',
  'hi-IN': 'hi',
  'hr-HR': 'hr',
  'hu-HU': 'hu',
  'id-ID': 'id',
  'ig-NG': '',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'lo-LA': 'lo',
  'ms-MY': 'ms',
  'ne-NP': 'np',
  'nl-NL': 'nl',
  'no-NO': 'no',
  'or-IN': '',
  'pcm-NG': '',
  'pl-PL': 'pl',
  'pt-BR': 'pt',
  'pt-PT': '',
  'ro-RO': 'ro',
  'ru-RU': 'ru',
  'sk-SK': '',
  'sl-SI': 'sl',
  'sr-SP': '',
  'sv-SE': 'sv',
  'ta-IN': 'ta',
  'th-TH': 'th',
  'tr-TR': 'tr',
  'tt-RU': '',
  'uk-UA': 'uk',
  'vi-VN': 'vi',
  'vls-BE': '',
  'yo-NG': 'yo',
  'zh-CN': 'zh',
  'zh-TW': 'zh',
};

export const rtlLocales = ['he', 'ar', 'far', 'yi', 'ku', 'ur', 'dv', 'ha', 'ps'];

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
  const locale = appLocale || 'auto';

  if (appLocale === 'auto') {
    return getBrowserLocale() || 'en';
  }

  return _.get(availableLocalesToReactIntl, locale, 'en');
};

export const getTranslationsByLocale = appLocale => {
  const allTranslations = _.keys(availableLocalesToReactIntl);

  if (appLocale === 'auto') {
    const browserLocale = getBrowserLocale();
    return _.findKey(availableLocalesToReactIntl, locale => locale === browserLocale) || 'default';
  }

  return _.get(allTranslations, _.indexOf(allTranslations, appLocale), 'default');
};

export const loadTranslations = async store => {
  const state = store.getState();
  const locale = getLocale(state);
  const availableLocale = getAvailableLocale(locale);
  const translationsLocale = getTranslationsByLocale(locale);

  const localeDataPromise = await import(`react-intl/locale-data/${availableLocale}`);
  const translationsPromise = await import(`../locales/${translationsLocale}.json`);

  const [localeData, translations] = await Promise.all([localeDataPromise, translationsPromise]);

  addLocaleData(localeData);
  global.translations = translations;
  store.dispatch(setUsedLocale(availableLocale));
};
