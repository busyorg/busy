import { addLocaleData } from 'react-intl';
import LANGUAGES from './languages';

export function findLanguage(locale) {
  return LANGUAGES.find(language => language.variants.indexOf(locale) !== -1) || LANGUAGES[0];
}

export function getRequestLocale(locales) {
  if (!locales || locales === '*') return LANGUAGES[0];

  return locales.split(',').map(lang => lang.split(';')[0])[0];
}

export function getBrowserLocale() {
  if (typeof navigator !== 'undefined') {
    return (
      navigator.userLanguage ||
      navigator.language ||
      (navigator.languages && navigator.languages[0] ? navigator.languages[0] : undefined)
    );
  }

  return undefined;
}

export function getLanguageText(language) {
  if (language.name === language.nativeName) return language.name;

  return `${language.nativeName} - ${language.name}`;
}

export async function loadLanguage(locale) {
  const language = findLanguage(locale);

  const localeDataPromise = import(`react-intl/locale-data/${language.localeData}`);
  const translationsPromise = import(`../locales/${language.translations}`);

  const [localeData, translations] = await Promise.all([localeDataPromise, translationsPromise]);

  addLocaleData(localeData.default);

  return {
    id: language.id,
    translations,
  };
}
