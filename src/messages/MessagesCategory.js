import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dispatchActions from '../helpers/dispatchActions';
import Header from '../app/Header';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import MenuFeed from '../app/Menu/MenuFeed';
import { fetchChannelPresence, joinChannel } from './messagesActions';
import './Messages.scss';

@dispatchActions(
  {
    waitFor: state => state.auth && state.auth.isAuthenticated,
  },
  ownProps => ({
    fetchChannelPresence: () => fetchChannelPresence(ownProps.params.category),
    joinChannel: () => joinChannel(ownProps.params.category),
  })
)
@connect(
  state => ({
    auth: state.auth,
    channels: state.messages.channels,
    favorites: state.favorites,
    isConnected: state.messages.isConnected,
  })
)
export default class MessagesCategory extends Component {
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
        <MenuFeed
          auth={this.props.auth}
          category={category === 'general' ? '' : category}
        />
        <div className="messages">
          <MessageList messages={channel.latest} />

          { this.props.isConnected &&
            <MessageForm
              channel={category}
              username={this.props.auth.user && this.props.auth.user.name}
            />
          }

        </div>
      </div>
    );
  }
}
