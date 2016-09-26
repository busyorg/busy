import extend from 'lodash/extend';
import size from 'lodash/size';

import * as actions from './actions';
import { actions as backgroundActions } from './background';

// type Channel = {
//   channelName: String,
//   isLoading: Boolean,
//   latest: Array,
//   users: Object,
// }

const initialState = {
  channels: {},
  isLoading: true,
  isConnected: false,
};

export default function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case backgroundActions.USER_JOIN: {
      return state;
    }

    case backgroundActions.USER_LEAVE: {
      return state;
    }

    case backgroundActions.USER_MESSAGE: {
      const channel = state.channels[action.payload.channelName] || {
        channelName: action.payload.channelName,
        users: {},
        latest: []
      };

      channel.users[action.payload.senderUsername] = true;
      channel.latest.push(action.payload);

      const channels = extend({}, state.channels, {
        [`${action.payload.channelName}`]: channel,
      });

      return extend({}, state, {
        channels,
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
      return extend({}, state, {
        isLoading: false,
        channels: extend(state.channels, {
          [`${action.payload.channelName}`]: extend(action.payload, {
            nmembers: size(action.payload.users),
          }),
        })
      });
    }

    default: {
      return state;
    }
  }
}
