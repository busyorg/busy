import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import { PropTypes } from 'react';

import { startOfDay } from '../helpers/dateHelpers';

/**
 * Group messages by username and minute
 */

function groupMessagesByUser(messages) {
  const smessages = sortBy(messages, 'receivedAt');
  const ret = reduce(smessages, (memo, message) => {
    const receivedAtDate = new Date(message.receivedAt);
    const day = startOfDay(receivedAtDate).getTime();
    const key =
      `${message.senderUsername}-${Math.floor(receivedAtDate.getTime() / 1000 / 60)}`;
    if (!memo.latest) {
      return {
        all: memo.all,
        latest: {
          day,
          key,
          messages: [message]
        }
      };
    } else if (memo.latest.key === key) {
      return {
        all: memo.all,
        latest: {
          key,
          day,
          messages: memo.latest.messages.concat([message]),
        },
      };
    }

    return {
      all: memo.all.concat([memo.latest]),
      latest: {
        key,
        day,
        messages: [message],
      }
    };
  }, {
    latest: null,
    all: [],
  });

  return ret.all.concat(ret.latest ? [ret.latest] : []);
}

/**
 * Groups messages by date and username and minute. Output is sorted.
 *
 * @param {Array} messages
 * @returns {Array} dateMessageGroups
 * @returns {Object} dateMessageGroups[i] A day of messages
 * @returns {Date} dateMessageGroups[i].date The day of this group
 * @returns {Array} dateMessageGroups[i].messages The username/minute groups in this day
 * @returns {Object} dateMessageGroups[i].messages[i].messages The messages in
 *   this username/minute group
 *
 * @example
 *   messageGroups(someMessages);
 *   // =>
 *   // [
 *   //   {
 *   //     day: Fri Jan 13 2017 00:00:00 GMT-0200 (BRST),
 *   //     messages: [
 *   //       {
 *   //         key: 'yamadapc-1484272800000',     // <- `${username}-${minute}`
 *   //         messages: [...]                    // <- messages sent in this minute by this user
 *   //       },
 *   //       ...
 *   //     ],
 *   //   },
 *   //   ...
 *   // ]
 */

export function groupMessagesByDate(messages) {
  const umessages = groupMessagesByUser(messages);
  const dayGroups = map(groupBy(umessages, (m) => m.day), (userMessages, day) => ({
    messages: userMessages,
    day: new Date(+day),
  }));

  return sortBy(
    dayGroups,
    (v) => v.day
  );
}

export const propMessageGroup = PropTypes.shape({
  key: PropTypes.string.isRequired,
  messages: PropTypes.array,
});

export const propMessageDateGroup = PropTypes.shape({
  day: PropTypes.instanceOf(Date).isRequired,
  messages: PropTypes.arrayOf(propMessageGroup),
});
