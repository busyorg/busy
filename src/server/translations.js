import { addLocaleData } from 'react-intl';

// We include every available translation on the server. Translations are loaded asynchronously
// on the client.

import en from 'react-intl/locale-data/en';
import cs from 'react-intl/locale-data/cs';
import es from 'react-intl/locale-data/es';
import zh from 'react-intl/locale-data/zh';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import ko from 'react-intl/locale-data/ko';
import nl from 'react-intl/locale-data/nl';
import sl from 'react-intl/locale-data/sl';
import sv from 'react-intl/locale-data/sv';
import pl from 'react-intl/locale-data/pl';
import ar from 'react-intl/locale-data/ar';
import tr from 'react-intl/locale-data/tr';
import ro from 'react-intl/locale-data/ro';
import ja from 'react-intl/locale-data/ja';
import fil from 'react-intl/locale-data/fil';
import th from 'react-intl/locale-data/th';
import lo from 'react-intl/locale-data/lo';
import id from 'react-intl/locale-data/id';
import ms from 'react-intl/locale-data/ms';
import da from 'react-intl/locale-data/da';
import it from 'react-intl/locale-data/it';
import no from 'react-intl/locale-data/no';
import pt from 'react-intl/locale-data/pt';
import vi from 'react-intl/locale-data/vi';
import el from 'react-intl/locale-data/el';
import bg from 'react-intl/locale-data/bg';
import uk from 'react-intl/locale-data/uk';
import he from 'react-intl/locale-data/he';
import hi from 'react-intl/locale-data/hi';
import ca from 'react-intl/locale-data/ca';
import et from 'react-intl/locale-data/et';
import as from 'react-intl/locale-data/as';
import ta from 'react-intl/locale-data/ta';
import bn from 'react-intl/locale-data/bn';
import ne from 'react-intl/locale-data/ne';
import yo from 'react-intl/locale-data/yo';
import hr from 'react-intl/locale-data/hr';
import hu from 'react-intl/locale-data/hu';

import enTranslations from '../client/locales/en.json';
import csTranslations from '../client/locales/cs.json';
import esTranslations from '../client/locales/es.json';
import zhTranslations from '../client/locales/zh.json';
import frTranslations from '../client/locales/fr.json';
import deTranslations from '../client/locales/de.json';
import ruTranslations from '../client/locales/ru.json';
import koTranslations from '../client/locales/ko.json';
import nlTranslations from '../client/locales/nl.json';
import slTranslations from '../client/locales/sl.json';
import svTranslations from '../client/locales/sv.json';
import plTranslations from '../client/locales/pl.json';
import arTranslations from '../client/locales/ar.json';
import trTranslations from '../client/locales/tr.json';
import roTranslations from '../client/locales/ro.json';
import jaTranslations from '../client/locales/ja.json';
import filTranslations from '../client/locales/fil.json';
import thTranslations from '../client/locales/th.json';
import loTranslations from '../client/locales/lo.json';
import idTranslations from '../client/locales/id.json';
import msTranslations from '../client/locales/ms.json';
import daTranslations from '../client/locales/da.json';
import itTranslations from '../client/locales/it.json';
import noTranslations from '../client/locales/no.json';
import ptTranslations from '../client/locales/pt.json';
import viTranslations from '../client/locales/vi.json';
import elTranslations from '../client/locales/el.json';
import bgTranslations from '../client/locales/bg.json';
import ukTranslations from '../client/locales/uk.json';
import heTranslations from '../client/locales/he.json';
import hiTranslations from '../client/locales/hi.json';
import caTranslations from '../client/locales/ca.json';
import etTranslations from '../client/locales/et.json';
import asTranslations from '../client/locales/as.json';
import taTranslations from '../client/locales/ta.json';
import bnTranslations from '../client/locales/bn.json';
import neTranslations from '../client/locales/ne.json';
import yoTranslations from '../client/locales/yo.json';
import hrTranslations from '../client/locales/hr.json';
import huTranslations from '../client/locales/hu.json';

addLocaleData([
  ...en,
  ...cs,
  ...es,
  ...zh,
  ...fr,
  ...de,
  ...ru,
  ...ko,
  ...nl,
  ...sl,
  ...sv,
  ...pl,
  ...ar,
  ...tr,
  ...ro,
  ...ja,
  ...fil,
  ...th,
  ...lo,
  ...id,
  ...ms,
  ...da,
  ...it,
  ...no,
  ...pt,
  ...vi,
  ...el,
  ...bg,
  ...uk,
  ...he,
  ...hi,
  ...ca,
  ...et,
  ...as,
  ...ta,
  ...bn,
  ...ne,
  ...yo,
  ...hr,
  ...hu,
]);

export default {
  en: enTranslations,
  cs: csTranslations,
  es: esTranslations,
  zh: zhTranslations,
  fr: frTranslations,
  de: deTranslations,
  ru: ruTranslations,
  ko: koTranslations,
  nl: nlTranslations,
  sl: slTranslations,
  sv: svTranslations,
  pl: plTranslations,
  ar: arTranslations,
  tr: trTranslations,
  ro: roTranslations,
  ja: jaTranslations,
  fil: filTranslations,
  th: thTranslations,
  lo: loTranslations,
  id: idTranslations,
  ms: msTranslations,
  da: daTranslations,
  it: itTranslations,
  no: noTranslations,
  pt: ptTranslations,
  vi: viTranslations,
  el: elTranslations,
  bg: bgTranslations,
  uk: ukTranslations,
  he: heTranslations,
  hi: hiTranslations,
  ca: caTranslations,
  et: etTranslations,
  as: asTranslations,
  ta: taTranslations,
  bn: bnTranslations,
  ne: neTranslations,
  yo: yoTranslations,
  hr: hrTranslations,
  hu: huTranslations,
};
