import { addLocaleData } from 'react-intl';

// We include every available translation on the server. Translations are loaded asynchronously
// on the client.

import ar from 'react-intl/locale-data/ar';
import as from 'react-intl/locale-data/as';
import bg from 'react-intl/locale-data/bg';
import bn from 'react-intl/locale-data/bn';
import ca from 'react-intl/locale-data/ca';
import cs from 'react-intl/locale-data/cs';
import da from 'react-intl/locale-data/da';
import de from 'react-intl/locale-data/de';
import el from 'react-intl/locale-data/el';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import et from 'react-intl/locale-data/et';
import fil from 'react-intl/locale-data/fil';
import fr from 'react-intl/locale-data/fr';
import he from 'react-intl/locale-data/he';
import hi from 'react-intl/locale-data/hi';
import hr from 'react-intl/locale-data/hr';
import hu from 'react-intl/locale-data/hu';
import id from 'react-intl/locale-data/id';
import it from 'react-intl/locale-data/it';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import lo from 'react-intl/locale-data/lo';
import ms from 'react-intl/locale-data/ms';
import ne from 'react-intl/locale-data/ne';
import nl from 'react-intl/locale-data/nl';
import no from 'react-intl/locale-data/no';
import pl from 'react-intl/locale-data/pl';
import pt from 'react-intl/locale-data/pt';
import ro from 'react-intl/locale-data/ro';
import ru from 'react-intl/locale-data/ru';
import sl from 'react-intl/locale-data/sl';
import sv from 'react-intl/locale-data/sv';
import ta from 'react-intl/locale-data/ta';
import th from 'react-intl/locale-data/th';
import tr from 'react-intl/locale-data/tr';
import uk from 'react-intl/locale-data/uk';
import vi from 'react-intl/locale-data/vi';
import yo from 'react-intl/locale-data/yo';
import zh from 'react-intl/locale-data/zh';

import arSATranslations from '../client/locales/ar-SA.json';
import asINTranslations from '../client/locales/as-IN.json';
import bgBGTranslations from '../client/locales/bg-BG.json';
import bnINTranslations from '../client/locales/bn-IN.json';
import caESTranslations from '../client/locales/ca-ES.json';
import csCZTranslations from '../client/locales/cs-CZ.json';
import daDKTranslations from '../client/locales/da-DK.json';
import deDETranslations from '../client/locales/de-DE.json';
import elGRTranslations from '../client/locales/el-GR.json';
import enUSTranslations from '../client/locales/en-US.json';
import esESTranslations from '../client/locales/es-ES.json';
import etEETranslations from '../client/locales/et-EE.json';
import filPHTranslations from '../client/locales/fil-PH.json';
import frFRTranslations from '../client/locales/fr-FR.json';
import heILTranslations from '../client/locales/he-IL.json';
import hiINTranslations from '../client/locales/hi-IN.json';
import hrHRTranslations from '../client/locales/hr-HR.json';
import huHUTranslations from '../client/locales/hu-HU.json';
import idIDTranslations from '../client/locales/id-ID.json';
import itITTranslations from '../client/locales/it-IT.json';
import jaJPTranslations from '../client/locales/ja-JP.json';
import koKRTranslations from '../client/locales/ko-KR.json';
import loLATranslations from '../client/locales/lo-LA.json';
import msMYTranslations from '../client/locales/ms-MY.json';
import neNPTranslations from '../client/locales/ne-NP.json';
import nlNLTranslations from '../client/locales/nl-NL.json';
import noNOTranslations from '../client/locales/no-NO.json';
import plPLTranslations from '../client/locales/pl-PL.json';
import ptBRTranslations from '../client/locales/pt-BR.json';
import roROTranslations from '../client/locales/ro-RO.json';
import ruRUTranslations from '../client/locales/ru-RU.json';
import slSITranslations from '../client/locales/sl-SI.json';
import svSETranslations from '../client/locales/sv-SE.json';
import taINTranslations from '../client/locales/ta-IN.json';
import thTHTranslations from '../client/locales/th-TH.json';
import trTRTranslations from '../client/locales/tr-TR.json';
import ukUATranslations from '../client/locales/uk-UA.json';
import viVNTranslations from '../client/locales/vi-VN.json';
import yoNGTranslations from '../client/locales/yo-NG.json';
import zhCNTranslations from '../client/locales/zh-CN.json';

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
  ar: arSATranslations,
  as: asINTranslations,
  bg: bgBGTranslations,
  bn: bnINTranslations,
  ca: caESTranslations,
  cs: csCZTranslations,
  da: daDKTranslations,
  de: deDETranslations,
  el: elGRTranslations,
  en: enUSTranslations,
  es: esESTranslations,
  et: etEETranslations,
  fil: filPHTranslations,
  fr: frFRTranslations,
  he: heILTranslations,
  hi: hiINTranslations,
  hr: hrHRTranslations,
  hu: huHUTranslations,
  id: idIDTranslations,
  it: itITTranslations,
  ja: jaJPTranslations,
  ko: koKRTranslations,
  lo: loLATranslations,
  ms: msMYTranslations,
  ne: neNPTranslations,
  nl: nlNLTranslations,
  no: noNOTranslations,
  pl: plPLTranslations,
  pt: ptBRTranslations,
  ro: roROTranslations,
  ru: ruRUTranslations,
  sl: slSITranslations,
  sv: svSETranslations,
  ta: taINTranslations,
  th: thTHTranslations,
  tr: trTRTranslations,
  uk: ukUATranslations,
  vi: viVNTranslations,
  yo: yoNGTranslations,
  zh: zhCNTranslations,
};
