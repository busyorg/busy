import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import en from './en.json';
import cn from './cn.json';
import fr from './fr.json';
import de from './de.json';
import ru from './ru.json';
import kr from './kr.json';

addLocaleData(enLocaleData);
addLocaleData({ locale: 'cn', parentLocale: 'en' });
addLocaleData({ locale: 'fr', parentLocale: 'en' });
addLocaleData({ locale: 'de', parentLocale: 'en' });
addLocaleData({ locale: 'ru', parentLocale: 'en' });
addLocaleData({ locale: 'kr', parentLocale: 'en' });

export { en, cn, fr, de, ru, kr };
