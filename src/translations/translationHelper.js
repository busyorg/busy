import _ from 'lodash';

const isRootLocaleComment =
  reply => (reply.depth === 1 && reply.body.length === 4 && reply.body.substring(0, 2) === '# ');

export const toObject = (body) => {
  const object = {};
  const lines = body.split(/\n/);
  lines.forEach((line) => {
    const separatorPosition = line.indexOf(':');
    const key = separatorPosition > 0 ? line.slice(0, separatorPosition) : '';
    const value = separatorPosition > 0 ? line.slice(separatorPosition + 1) : '';
    if (key && value) {
      object[key.trim()] = value.trim();
    }
  });
  return object;
};

export const getMessages = (replies) => {
  const localesMap = {};
  const messages = {};
  let sortedReplies = _.sortBy(replies, 'net_rshares');
  sortedReplies = _.filter(sortedReplies, r => r.net_rshares >= 0);

  Object.keys(sortedReplies).forEach((key) => {
    const reply = sortedReplies[key];
    if (isRootLocaleComment(reply)) {
      localesMap[reply.permlink] = reply.body.replace('#', '').replace(' ', '').toLowerCase();
      messages[localesMap[reply.permlink]] = {};
    }
  });

  Object.keys(sortedReplies).forEach((key) => {
    const reply = sortedReplies[key];
    const locale = localesMap[reply.parent_permlink];
    if (locale) {
      const object = toObject(reply.body);
      messages[locale] = { ...messages[locale], ...object };
    }
  });

  return messages;
};

export const getLocale = (appLocale, messages) => {
  let locale = 'en';
  if (typeof navigator !== 'undefined') {
    const browserLocale = navigator.language || navigator.userLanguage; // eslint-disable-line
    locale = appLocale || browserLocale;
    locale = locale.substr(0, 2);
    locale = messages[locale] ? locale : 'en';
  }
  return locale;
};
