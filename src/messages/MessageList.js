/* eslint-disable react/no-find-dom-node */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';

import { sendReadAcknoledgement } from './messagesActions';
import './MessageList.scss';
import Message from './Message.js';

function messageGroups(messages) {
  // Group messages by username and minute
  const ret = reduce(messages, (memo, message) => {
    const key =
      `${message.senderUsername}-${Math.floor(new Date(message.sentAt).getTime() / 1000 / 60)}`;
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

  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentDidUpdate() {
    this.sendReadAcks();
    if (this.shouldScrollBottom) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    const { messages } = this.props;
    const groups = messageGroups(messages);
    console.log(groups);
    const messageEls = map(groups, ({ messages, key }, i) => (
      <Message
        key={[key, i]}
        model={messages}
      />
    )).reverse();

    return (
      <ul
        className="MessageList messages-content media-list"
      >
        {messageEls}
      </ul>
    );
  }
}

MessageList = connect(() => ({}), {
  sendReadAcknoledgement,
})(MessageList);

export default MessageList;
