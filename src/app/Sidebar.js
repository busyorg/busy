import React, { Component, PropTypes } from 'react';
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import steemdb from 'steemdb';
import Avatar from '../widgets/Avatar';

import SidebarMessages from './Sidebar/SidebarMessages';

let ReactRedux = require('react-redux'),
  actions = require('../actions'),
  formatter = require('steem/lib/formatter'),
  _ = require('lodash'),
  numeral = require('numeral'),
  api = require('../steemAPI'),
  Loading = require('../widgets/Loading'),
  Link = require('react-router').Link;


class SidebarIcons extends Component {
  renderUnread() {
    const nUnreadMessages = size(this.props.messages.unreadMessages);

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

    return (
      <ul className="list-selector">
        <li><a onClick={() => this.props.onClickMenu({ menu: 'public' })} className="active"><i className="icon icon-md material-icons">public</i></a></li>

        <li style={{ position: 'relative' }}>
          <a onClick={() => this.props.onClickMenu({ menu: 'feed' })} className="active">
            {this.renderUnread()}
            <i className="icon icon-md material-icons">chat_bubble_outline</i>
          </a>
        </li>

        <li><a onClick={() => this.props.onClickMenu({ menu: 'write' })} className="active"><i className="icon icon-md material-icons">create</i></a></li>
        <li><a onClick={() => this.props.onClickMenu({ menu: 'wallet' })} className="active"><i className="icon icon-md material-icons">account_balance_wallet</i></a></li>
      </ul>
    );
  }
}

class Sidebar extends Component {
  constructor(props) {
    super(props);

    api.getState('trending/busy', (err, result) => {
      this.setState({
        isFetching: false,
        isLoaded: true,
        categories: result.categories,
        props: result.props,
        feedPrice: result.feed_price
      });
      this.getFollowing();
    });

    this.state = {
      isFetching: true,
      isLoaded: false,
      followingIsFetching: false,
      followingIsLoaded: false,
      categories: [],
      props: {},
      feedPrice: {},
      following: [],
      menu: 'public'
    };
  }

  componentDidUpdate() {
    if (!this.state.followingFetched) {
      this.getFollowing();
    }
  }

  getFollowing() {
    if (this.props.auth.isAuthenticated &&
        !_.size(this.state.following) &&
        !this.state.followingIsFetching &&
        !this.state.followingIsLoaded) {
      steemdb.accounts({
        account: this.props.auth.user.name
      }, (err, result) => {
        this.setState({
          following: result[0].following,
          followingFetched: true,
        });
      });
    }
  }

  onClickMenu = ({ menu }) => {
    this.setState({ menu });
  };

  render() {
    const user = this.props.auth.user;
    let tags = [];
    if (this.state.categories) {
      const categories = _.sortBy(this.state.categories, 'discussions').reverse();
      categories.forEach((category, key) => {
        tags.push(<li key={key}><Link to={`/trending/${category.name}`} activeClassName="active">#{category.name}</Link></li>);
      });
    }
    tags = _.sortBy(tags, 'discussions');
    tags = tags.slice(0, 20);
    if (_.has(this.state.feedPrice, 'base')) {
      var power = formatter.vestToSteem(user.vesting_shares, this.state.props.total_vesting_shares, this.state.props.total_vesting_fund_steem);
      var base = (this.state.feedPrice.base).replace(' SBD', '').replace(',', '');
      var dollar = (parseFloat(base) * (parseFloat(user.balance) + parseFloat(power))) + parseFloat(user.sbd_balance);
    }
    return (
      <nav className="sidebar">
        <div className="sidebar-header">
          <a className="hide-sidebar" onClick={() => this.props.hideSidebar()}>
            <i className="icon icon-md icon-menu material-icons">arrow_back</i>
          </a>
          <div className="me">
            {this.props.auth.isAuthenticated ?
              <div>
                <Link to={`/@${user.name}`}>
                  <Avatar sm username={user.name} reputation={user.reputation} />
                </Link>
                <span style={{ clear: 'both', display: 'block' }}>
                  @{user.name} <a onClick={() => this.setState({ menu: 'settings' })}>
                    <i className="icon icon-xs material-icons">settings</i>
                  </a>
                </span>
              </div> :
              <div className="log">
                {this.props.auth.isFetching ?
                  <Loading color="white" /> :
                  <a href={`${process.env.STEEMCONNECT_HOST}/authorize/@busy.app?redirect_url=${process.env.STEEMCONNECT_REDIRECT_URL}`}><i className="icon icon-lg material-icons pam">lock_outline</i></a>}
              </div>}
          </div>
        </div>

        <SidebarIcons
          onClickMenu={this.onClickMenu}
          auth={this.props.auth}
          messages={this.props.messages}
        />

        <div className="sidebar-content">
          {this.state.isFetching && <Loading color="white" />}
          {this.props.auth.isAuthenticated && _.has(this.state.feedPrice, 'base') && this.state.menu === 'settings' &&
            <ul>
              <li className="title">
                <Link to="/#profile">
                  <i className="icon icon-md material-icons">perm_identity</i>{' '}
                  <FormattedMessage id="profile" />
                </Link>
              </li>
              <li className="title">
                <Link to="/settings">
                  <i className="icon icon-md material-icons">settings</i>{' '}
                  <FormattedMessage id="settings" />
                </Link>
              </li>
              <li className="title">
                <a href={`${process.env.STEEMCONNECT_HOST}/logout`}>
                  <i className="icon icon-md material-icons">lock_open</i>{' '}
                  <FormattedMessage id="logout" />
                </a>
              </li>
            </ul>}

          {_.size(this.state.categories) > 0 && this.state.menu === 'public' &&
            <ul className="tags">
              {tags}
              <li><Link to="/tags" activeClassName="active"><FormattedMessage id="see_more" /></Link></li>
            </ul>}

          {this.state.menu === 'feed' &&
            <SidebarMessages
              messages={this.props.messages}
              auth={this.props.auth}
              contacts={this.state.following}
            />
          }

          {this.props.auth.isAuthenticated && _.has(this.state.feedPrice, 'base') && this.state.menu === 'write' &&
            <ul>
              <li className="title">
                <Link to="/write">
                  <i className="icon icon-md material-icons">add</i>{' '}
                  <FormattedMessage id="write" />
                </Link>
              </li>
              <li className="title">
                <Link to="/#drafts">
                  <i className="icon icon-md material-icons">library_books</i>{' '}
                  <FormattedMessage id="drafts" />
                </Link>
              </li>
              <li className="title">
                <Link to="/#files">
                  <i className="icon icon-md material-icons">attach_file</i>{' '}
                  <FormattedMessage id="files" />
                </Link>
              </li>
              <li className="title">

                <Link to="/bookmarks">
                  <i className="icon icon-md material-icons">collections_bookmark</i>{' '}
                  <FormattedMessage id="bookmarks" />
                </Link>

              </li>
            </ul>}
          {this.props.auth.isAuthenticated && _.has(this.state.feedPrice, 'base') && this.state.menu === 'wallet' &&
            <ul className="tags">
              <li><span className="menu-row">1 Steem <span className="pull-right">{numeral(base).format('$0,0.00')}</span></span></li>
              <li><span className="menu-row">Steem <span className="pull-right">{numeral(user.balance).format('0,0.00')}</span></span></li>
              <li><span className="menu-row">Steem Power <span className="pull-right">{numeral(power).format('0,0.00')}</span></span></li>
              <li><span className="menu-row">Steem Dollars <span className="pull-right">{numeral(user.sbd_balance).format('0,0.00')}</span></span></li>
              <li><span className="menu-row"><FormattedMessage id="estimated_value" /> <span className="pull-right">{numeral(dollar).format('$0,0.00')}</span></span></li>
            </ul>}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    app: state.app,
    auth: state.auth,
    messages: state.messages,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    hideSidebar() { dispatch(actions.hideSidebar()); }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Sidebar);
