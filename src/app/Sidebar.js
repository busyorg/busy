import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import formatter from 'steem/lib/formatter';
import steemdb from 'steemdb';
import _ from 'lodash';
import numeral from 'numeral';

import api from '../steemAPI';
import { hideSidebar } from '../actions';
import Loading from '../widgets/Loading';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';
import SidebarTabs from './Sidebar/SidebarTabs';
import SidebarMessages from './Sidebar/SidebarMessages';

import './Sidebar.sass';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
    messages: state.messages,
  }),
  dispatch => bindActionCreators({
    hideSidebar: hideSidebar,
  }, dispatch)
)

export default class Sidebar extends Component {
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
      menu: 'public',
      search: '',
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

  search = (e) => {
    this.setState({ search: e.target.value });
  };

  onClickMenu = ({ menu }) => {
    this.setState({ menu });
  };

  render() {
    const user = this.props.auth.user;
    const search = this.state.search;
    let tags = [];
    if (this.state.categories) {
      let categories = _.sortBy(this.state.categories, 'discussions').reverse();
      categories = _.filter(categories, (category) => {
        return _.startsWith(category.name, search);
      });
      categories.forEach((category, key) => {
        tags.push(<li key={key}><Link to={`/trending/${category.name}`} activeClassName="active">#{category.name}</Link></li>);
      });
    }
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
            <Icon name="arrow_back" className="icon-menu" />
          </a>
          <div className="me">
            {this.props.auth.isAuthenticated ?
              <div>
                <Link to={`/@${user.name}`}>
                  <Avatar sm username={user.name} reputation={user.reputation} />
                </Link>
                <span style={{ clear: 'both', display: 'block' }}>
                  @{user.name} <a onClick={() => this.setState({ menu: 'settings' })}>
                    <Icon name="settings" xs />
                  </a>
                </span>
              </div> :
              <div className="log">
                {this.props.auth.isFetching ?
                  <Loading color="white" /> :
                  <a href={`${process.env.STEEMCONNECT_HOST}/authorize/@busy.app?redirect_url=${process.env.STEEMCONNECT_REDIRECT_URL}`}>
                    <Icon name="lock_outline" lg />
                  </a>}
              </div>}
          </div>
        </div>

        <SidebarTabs
          onClickMenu={this.onClickMenu}
          menu={this.state.menu}
          auth={this.props.auth}
          messages={this.props.messages}
        />

        <div className="sidebar-content">
          {this.state.isFetching && <Loading color="white" />}
          {this.props.auth.isAuthenticated && _.has(this.state.feedPrice, 'base') && this.state.menu === 'settings' &&
            <ul>
              <li className="title">
                <Link to="/#profile">
                  <Icon name="perm_identity" />{' '}
                  <FormattedMessage id="profile" />
                </Link>
              </li>
              <li className="title">
                <Link to="/settings">
                  <Icon name="settings" />{' '}
                  <FormattedMessage id="settings" />
                </Link>
              </li>
              <li className="title">
                <a href={`${process.env.STEEMCONNECT_HOST}/logout`}>
                  <Icon name="lock_open" />{' '}
                  <FormattedMessage id="logout" />
                </a>
              </li>
            </ul>}

          {_.size(this.state.categories) > 0 && this.state.menu === 'public' &&
            <div>
              <ul className="tags">
                <li className="search">
                  <div className="input-group">
                    <span className="input-group-addon"><Icon name="search" sm /></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={search}
                      onChange={this.search}
                    />
                  </div>
                </li>
                {tags}
                <li><Link to="/tags" activeClassName="active"><FormattedMessage id="see_more" /></Link></li>
              </ul>
            </div>
          }

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
                  <Icon name="add" />{' '}
                  <FormattedMessage id="write" />
                </Link>
              </li>
              <li className="title">
                <Link to="/#drafts">
                  <Icon name="library_books" />{' '}
                  <FormattedMessage id="drafts" />
                </Link>
              </li>
              <li className="title">
                <Link to="/#files">
                  <Icon name="attach_file" />{' '}
                  <FormattedMessage id="files" />
                </Link>
              </li>
              <li className="title">
                <Link to="/bookmarks">
                  <Icon name="collections_bookmark" />{' '}
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
