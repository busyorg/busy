import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';

import enMessage from './en.json';
import zhMessage from './zh.json';
import frMessage from './fr.json';
import deMessage from './de.json';
import ruMessage from './ru.json';
import koMessage from './ko.json';

addLocaleData([...en, ...zh, ...fr, ...de, ...ru, ...ko]);

export {
  enMessage as en,
  zhMessage as zh,
  frMessage as fr,
  deMessage as de,
  ruMessage as ru,
  koMessage as ko
};
