import React, { Component } from 'react';
import _ from 'lodash';
import Icon from '../../widgets/Icon';

export default class SidebarTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplies: false,
    };
  }

  renderUnread() {
    const nUnreadMessages = _.size(this.props.messages.unreadMessages);

    if (!nUnreadMessages) return null;

    return (
      <div
        className="SidebarIcons__unreadMessagesCount"
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          lineHeight: '19px',
          height: '20px',
          width: '20px',
          borderRadius: '100%',
          backgroundColor: 'white',
          color: 'black'
        }}
      >
        {nUnreadMessages}
      </div>
    );
  }

  render() {
    if (!this.props.auth.isAuthenticated) {
      return null;
    }
    const menu = this.props.menu;
    return (
      <ul className="list-selector">
        <li>
          <a
            onClick={() => this.props.onClickMenu({ menu: 'categories' })}
            className={menu === 'categories' && 'active'}
          >
            <Icon name="public" lg />
          </a>
        </li>
        <li style={{ position: 'relative' }}>
          <a
            onClick={() => this.props.onClickMenu({ menu: 'users' })}
            className={menu === 'users' && 'active'}
          >
            {this.renderUnread()}
            <Icon name="people" lg />
          </a>
        </li>
        <li>
          <a
            onClick={() => this.props.onClickMenu({ menu: 'write' })}
            className={menu === 'write' && 'active'}
          >
            <Icon name="create" lg />
          </a>
        </li>
        <li>
          <a
            onClick={() => this.props.onClickMenu({ menu: 'wallet' })}
            className={menu === 'wallet' && 'active'}
          >
            <Icon name="account_balance_wallet" lg />
          </a>
        </li>
      </ul>
    );
  }
};
