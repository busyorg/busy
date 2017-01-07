import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';

import enMessage from './en.json';
import cnMessage from './cn.json';
import frMessage from './fr.json';
import deMessage from './de.json';
import ruMessage from './ru.json';
import krMessage from './kr.json';

addLocaleData([...en, ...zh, ...fr, ...de, ...ru, ...ko]);

export {
  enMessage as en,
  cnMessage as cn,
  frMessage as fr,
  deMessage as de,
  ruMessage as ru,
  krMessage as kr
};
