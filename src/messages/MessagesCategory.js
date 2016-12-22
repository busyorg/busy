import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

import './Messages.scss';
import Header from '../app/Header';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import actionDecorator from '../helpers/actionDecorator';
import { fetchChannelPresence, joinChannel } from './messagesActions';

class MessagesPage extends Component {
  static propTypes = {
    auth: PropTypes.object,
    params: PropTypes.object,
    channels: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      text: '',
    };
  }

  render() {
    const category = this.props.params.category;
    const channel = this.props.channels[category] || {
      latest: [],
      nmembers: 0,
    };
    return (
      <div className="Messages main-panel">
        <Header />
        <div className="secondary-nav">
          <i className="icon icon-sm material-icons">
            {_.has(this.props.favorites, category) ? 'star' : 'star_border'}
          </i>
          <Link to={`/hot/${category}`}>#{category}</Link> <span>{channel.nmembers} online</span>
        </div>
        <div className="messages">
          <MessageList messages={channel.latest} />
          <MessageForm
            channel={category}
            username={this.props.auth.user && this.props.auth.user.name}
          />
        </div>
      </div>
    );
  }
}

MessagesPage = actionDecorator(fetchChannelPresence, joinChannel)(MessagesPage);

MessagesPage = connect(state => ({
  auth: state.auth,
  channels: state.messages.channels,
  favorites: state.favorites,
}))(MessagesPage);

export default MessagesPage;
