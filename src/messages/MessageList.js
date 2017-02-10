/* eslint-disable react/no-find-dom-node */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { sendReadAcknoledgement } from './messagesActions';
import './MessageList.scss';
import Message from './Message.js';

function messageGroups(messages) {
  // Group messages by username and minute
  const ret = reduce(messages, (memo, message) => {
    const key =
      `${message.senderUsername}-${Math.floor(new Date(message.receivedAt).getTime() / 1000 / 60)}`;
    if (!memo.latest) {
      return {
        all: memo.all,
        latest: {
          key,
          messages: [message]
        }
      };
    } else if (memo.latest.key === key) {
      return {
        all: memo.all,
        latest: {
          key,
          messages: memo.latest.messages.concat([message]),
        },
      };
    }

    return {
      all: memo.all.concat([memo.latest]),
      latest: {
        key,
        messages: [message],
      }
    };
  }, {
    latest: null,
    all: [],
  });

  return ret.all.concat(ret.latest ? [ret.latest] : []);
}

const sortBasedOnDate = list =>
  list.sort((itemA, itemB) => {
    if (itemA.messages && itemB.messages) {
      const itemADate = new Date(itemA.messages[0].receivedAt).getTime();
      const itemBDate = new Date(itemB.messages[0].receivedAt).getTime();
      return itemADate > itemBDate ? 1 : -1;
    }
    return -1;
  });

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.array
  };

  sendReadAcks() {
    this.props.sendReadAcknoledgement(this.props.messages);
  }

  componentDidMount() {
    this.sendReadAcks();
  }

  componentDidUpdate() {
    this.sendReadAcks();

    document.body.scrollTop = document.body.scrollHeight;
    // Firefox Compatibility while document.scrollingElement isn't available
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  render() {
    const { messages, username } = this.props;
    const groups = sortBasedOnDate(messageGroups(messages));
    const messageEls = map(groups, ({ messages: messageGroup, key }, i) => (
      <Message
        key={[key, i]}
        model={messageGroup}
      />
    ));

    return (
      <div className="MessageList messages-content media-list">
        <div className="py-4 text-center">
          {username
            ? <p className="mb-4">
              This is the beginning of your private message history with <b>@{username}</b>.
            </p>
            : <p className="mb-4">
              This is the beginning of the chat.
            </p>
          }
        </div>
        {messageEls}
      </div>
    );
  }
}

MessageList = connect(() => ({}), {
  sendReadAcknoledgement,
})(MessageList);

export default MessageList;
