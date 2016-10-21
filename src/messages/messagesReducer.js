import extend from 'lodash/extend';
import omit from 'lodash/omit';
import size from 'lodash/size';
import keyBy from 'lodash/keyBy';

import * as actions from './messagesActions';
import { actions as backgroundActions } from './messagesBackground';

// type Channel = {
//   channelName: String,
//   isLoading: Boolean,
//   latest: Array,
//   users: Object,
// }

const initialState = {
  channels: {},
  users: {},
  messages: {},
  unreadMessages: {},
  username: null,

  isLoading: true,
  isConnected: false,
};

export default function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      return extend({}, state, {
        username: action.user.name,
      });
    }

    case backgroundActions.USER_JOIN: {
      return extend({}, state, {
        users: {
          ...state.users,
          [`${action.payload.senderUsername}`]: true,
        },
      });
    }

    case backgroundActions.USER_LEAVE: {
      return extend({}, state, {
        users: omit(state.users, [action.payload.senderUsername]),
      });
    }

    case backgroundActions.USER_UNREAD_MESSAGES: {
      return extend({}, state, {
        unreadMessages: action.payload,
      });
    }

    case backgroundActions.USER_MESSAGE: {
      const channel = extend({}, state.channels[action.payload.channelName]) || {
        channelName: action.payload.channelName,
        users: {},
        latest: []
      };

      channel.users = extend({}, channel.users, {
        [`${action.payload.senderUsername}`]: true,
      });
      channel.latest = (channel.latest || []).concat([action.payload]);

      const channels = extend({}, state.channels, {
        [`${action.payload.channelName}`]: channel,
      });

      const unreadMessages = action.payload.senderUsername === state.username
        ? extend({}, state.unreadMessages)
        : {
          ...state.unreadMessages,
          [`${action.payload.uuid}`]: action.payload,
        };

      return extend({}, state, {
        channels,
        unreadMessages,
      });
    }

    case actions.USER_MESSAGE_READ_SUCCESS: {
      return extend({}, state, {
        unreadMessages: omit(state.unreadMessages, action.meta.uuids),
      });
    }

    case backgroundActions.ERROR: {
      return state;
    }

    case backgroundActions.CONNECTED: {
      return extend({}, state, {
        isConnected: true,
      });
    }

    case backgroundActions.DISCONNECTED: {
      return extend({}, state, {
        isConnected: false,
      });
    }

    case actions.FETCH_CHANNEL_PRESENCE_START: {
      return extend({}, state, {
        isLoading: true,
      });
    }

    case actions.FETCH_CHANNEL_PRESENCE_SUCCESS: {
      if (!action.payload) return state;

      return extend({}, state, {
        isLoading: false,
        channels: extend(state.channels, {
          [`${action.payload.channelName}`]: extend(action.payload, {
            nmembers: size(action.payload.users),
          }),
        })
      });
    }

    case actions.FETCH_MESSAGES_SUCCESS: {
      return extend({}, state, {
        unreadMessages: extend(
          {},
          state.unreadMessages,
          keyBy(action.payload.unreadMessages, 'uuid')
        ),
      });
    }

    default: {
      return state;
    }
  }
}
