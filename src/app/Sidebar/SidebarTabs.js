import React, { Component } from 'react';
import Icon from '../../widgets/Icon';

export default class SidebarTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplies: false,
    };
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
            <Icon name="chat_bubble_outline" lg />
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
