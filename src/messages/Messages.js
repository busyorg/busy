import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import './Messages.scss';
import Header from './../app/header';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import actionDecorator from '../lib/actionDecorator';
import { fetchChannelPresence, joinChannel } from '../common/messages/actions';

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

  componentDidMount() {
    document.title = 'Messages | Busy';
  }

  render() {
    let channelName = this.props.params.channelName;

    if (!channelName) {
      channelName = 'general';
    }
    const channel = this.props.channels[channelName] || {
      latest: [],
      nmembers: 0,
    };

    return (
      <div className="Messages main-panel">
        <Header
          menu="messages"
        >
          <div
            style={{
              alignItems: 'center',
              position: 'absolute',
              left: '60px',
              paddingLeft: '10px',
              paddingRight: '10px',
              paddingTop: '5px',
              borderRight: 'none',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'block', border: 'none' }}>
              <b>
                {channelName}
              </b>
            </div>

            {channelName.indexOf('@') !== 0 && (
              <div style={{ display: 'block', border: 'none' }}>
                <span
                  style={{
                    // paddingRight: '10px',
                    fontSize: '.9em',
                    color: '#ccc',
                    // borderRight: 'solid 1px #ccc'
                  }}
                >
                  {channel.nmembers} members
                </span>
              </div>
            )}

            {channelName.indexOf('@') === 0 && (
              <div style={{ display: 'block', border: 'none' }}>
                <span
                  style={{
                    // border: 'solid 2px #27d0a9',
                    // backgroundColor: '#27d0a9',
                    display: 'inline-block',
                    width: '10px',
                    float: 'left',
                    border: 'solid 2px #ccc',
                    borderRadius: '100%',
                    margin: '7px 7px 7px 0',
                    height: '10px'
                  }}
                />

                <span
                  style={{
                    // borderRight: 'solid 1px #ccc'
                    // paddingRight: '10px',
                    fontSize: '.9em',
                    color: '#ccc',
                  }}
                >
                  away
                </span>
              </div>
            )}
          </div>
        </Header>

        <div className="messages">
          <MessageList
            messages={channel.latest}
          />

          <MessageForm
            channel={channelName}
            username={this.props.auth.user && this.props.auth.user.name}
          />
        </div>
      </div>
    );
  }
}

MessagesPage =
  actionDecorator(fetchChannelPresence, joinChannel)(MessagesPage);
MessagesPage = connect((state, { params }) => ({
  auth: state.auth,
  channels: state.messages.channels,
}))(MessagesPage);

export default MessagesPage;
