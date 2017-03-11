/* global window, document */
import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';
import debounce from 'lodash/debounce';
import clone from 'lodash/clone';
import { connect } from 'react-redux';

import './MessageList.scss';
import InfiniteScroll from '../widgets/InfiniteScroll';
import Loading from '../widgets/Loading';
import MessageDateGroup from './MessageDateGroup';
import { getTopPosition, setTopPosition, getViewportHeight } from '../helpers/scrollHelpers';
import { groupMessagesByDate } from './messageGroupHelpers';
import { sendReadAcknoledgement } from './messagesActions';

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
  };

  sendReadAcks() {
    this.props.sendReadAcknoledgement(this.props.messages);
  }

  constructor(props) {
    super(props);
    this.state = {
      containerHeight: 1000,
    };
  }

  componentDidMount() {
    this.sendReadAcks();
    this.setState({
      containerHeight: document.body.innerHeight,
    });
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate() {
    this.sendReadAcks();
    if (getTopPosition() === getViewportHeight()) {
      setTopPosition(getViewportHeight());
    }
  }

  onResize = debounce(() => {
    this.setState({
      containerHeight: document.body.innerHeight,
    });
  }, 100);

  render() {
    const { messages, username } = this.props;
    const dateGroups = groupMessagesByDate(messages);
    const messageEls = map(dateGroups, (dateGroup) => (
      <MessageDateGroup
        key={dateGroup.day}
        model={dateGroup}
      />
    ));

    const loader = (this.props.isLoading || this.props.hasMore) ? (
      <div
        style={{
          zIndex: 10,
        }}
        className="text-center"
      >
        Loading More messages
        <Loading style={{ marginLeft: 15, display: 'inline-block' }} />
      </div>
    ) : (
      <div className="text-center">
        {username
        ? (
          <span>
            This is the beginning of your private message history with <b>@{username}</b>.
          </span>
        ) : 'This is the beginning of the chat.'
        }
      </div>
    );

    return (
      <div className="MessageList messages-content media-list">

        <InfiniteScroll
          loadMore={this.props.fetchMoreMessages}
          loadingMore={this.props.isLoading}
          threshold={100}
          elementIsScrollable={false}
          hasMore={this.props.hasMore}
          loader={loader}
        >
          {messageEls}
        </InfiniteScroll>
      </div>
    );
  }
}

MessageList = connect(() => ({}), {
  sendReadAcknoledgement,
})(MessageList);

export default MessageList;
