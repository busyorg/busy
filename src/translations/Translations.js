import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';
import nl from 'react-intl/locale-data/nl';
import se from 'react-intl/locale-data/se';

addLocaleData([...en, ...zh, ...fr, ...de, ...ru, ...ko, ...nl, ...se]);

function getMessageWithLocale(appLocale, messages) {
  const browserLocale = navigator.language || navigator.userLanguage; // eslint-disable-line
  let locale = appLocale || browserLocale;
  locale = locale.substr(0, 2);
  locale = messages[locale] ? locale : 'en';
  return { messages: messages[locale], locale };
}

export default getMessageWithLocale;
