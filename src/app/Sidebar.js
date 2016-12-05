import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import formatter from 'steem/lib/formatter';
import steemdb from 'steemdb';
import numeral from 'numeral';
import { sortBy } from 'lodash/collection';
import { startsWith } from 'lodash/string';
import { difference } from 'lodash/array';

import api from '../steemAPI';
import { hideSidebar } from '../actions';
import Loading from '../widgets/Loading';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';
import SidebarTabs from './Sidebar/SidebarTabs';
import SidebarUsers from './Sidebar/SidebarUsers';

import './Sidebar.scss';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
    messages: state.messages,
    favorites: state.favorites,
  }),
  dispatch => bindActionCreators({
    hideSidebar: hideSidebar,
  }, dispatch)
)

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      isLoaded: false,
      followingIsFetching: false,
      followingIsLoaded: false,
      categories: [],
      props: {},
      feedPrice: {},
      following: [],
      menu: 'categories',
      search: '',
    };
  }

  componentDidMount() {
    api.getState('trending/busy', (err, result) => {
      this.setState({
        isFetching: false,
        isLoaded: true,
        categories: result.category_idx && result.category_idx.trending,
        props: result.props,
        feedPrice: result.feed_price
      });
      this.getFollowing();
    });
  }

  componentDidUpdate() {
    if (!this.state.followingIsLoaded) {
      this.getFollowing();
    }
  }

  getFollowing() {
    if (!this.state.following.length &&
        !this.state.followingIsFetching &&
        !this.state.followingIsLoaded) {
      steemdb.accounts({
        account: this.props.auth.user.name
      },
      (err, result) => {
        this.setState({
          following: result[0].following,
          followingFetched: true,
        });
      });
    }
  }

  filterTagsBySearch(tags = []) {
    const { search } = this.state;
    return tags.filter((tag) => startsWith(tag, search));
  }

  renderFavoritedTags() {
    const { favorites } = this.props;
    const favoritedCategories = favorites.categories;
    return this.filterTagsBySearch(favoritedCategories).slice(0, 16).map((category, idx) =>
      <li key={idx}>
        <Link to={`/hot/${category}`} activeClassName="active">
          <Icon name="star" xs />
          { ' ' }
          #{category}
        </Link>
      </li>
    );
  }

  renderTags() {
    const { categories } = this.state;
    const { favorites } = this.props;

    if (categories) {
      // excluding items in favorite to avoid repetition
      const categoriesWithoutFavorites = difference(categories, favorites.categories);

      return this.filterTagsBySearch(categoriesWithoutFavorites)
        .slice(0, 16 - favorites.categories.length)
        .map((category, idx) =>
          <li key={idx}>
            <Link to={`/hot/${category}`} activeClassName="active">
              #{category}
            </Link>
          </li>
      );
    }
    return [];
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

    if (_.has(this.state.feedPrice, 'base')) {
      var power = formatter.vestToSteem(user.vesting_shares, this.state.props.total_vesting_shares, this.state.props.total_vesting_fund_steem);
      var base = (this.state.feedPrice.base).replace(' SBD', '').replace(',', '');
      var dollar = (parseFloat(base) * (parseFloat(user.balance) + parseFloat(power))) + parseFloat(user.sbd_balance);
    }
    return (
      <nav className="Sidebar">
        <div className="sidebar-header">
          <a className="hide-sidebar" onClick={() => this.props.hideSidebar()}>
            <Icon name="arrow_back" className="icon-menu" />
          </a>
          <div className="Sidebar__log">
            <div>
              <Link to={`/@${user.name}`} className="my-1">
                <Avatar sm username={user.name} reputation={user.reputation} />
              </Link>
              <div className="Sidebar__username">
                @{ `${user.name} ` }
                <a onClick={() => this.setState({ menu: 'settings' })}>
                  <Icon name="settings" xs />
                </a>
              </div>
            </div>
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
          {_.has(this.state.feedPrice, 'base') && this.state.menu === 'settings' &&
            <ul>
              <li className="title">
                <a href="https://steemconnect.com/profile" target="_blank">
                  <Icon name="perm_identity" />{' '}
                  <FormattedMessage id="profile" />
                </a>
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

          {_.size(this.state.categories) > 0 && this.state.menu === 'categories' &&
            <div>
              <ul className="Sidebar__tags">
                <li className="Sidebar__search">
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

                { this.renderFavoritedTags() }
                { this.renderTags() }

                <li><Link to="/tags" activeClassName="active"><FormattedMessage id="see_more" /></Link></li>
              </ul>
            </div>
          }

          {this.state.menu === 'users' &&
            <SidebarUsers
              messages={this.props.messages}
              auth={this.props.auth}
              contacts={this.state.following}
              favorites={this.props.favorites}
            />
          }

          {_.has(this.state.feedPrice, 'base') && this.state.menu === 'write' &&
            <ul>
              <li className="title">
                <Link to="/write">
                  <Icon name="add" />{' '}
                  <FormattedMessage id="write" />
                </Link>
              </li>
              {/* <li className="title">
                <Link to="/#drafts">
                  <Icon name="library_books" />{' '}
                  <FormattedMessage id="drafts" />
                </Link>
              </li> */}
              {/* <li className="title">
                <Link to="/#files">
                  <Icon name="attach_file" />{' '}
                  <FormattedMessage id="files" />
                </Link>
              </li> */}
              <li className="title">
                <Link to="/bookmarks">
                  <Icon name="bookmark" />{' '}
                  <FormattedMessage id="bookmarks" />
                </Link>
              </li>
            </ul>}
          {_.has(this.state.feedPrice, 'base') && this.state.menu === 'wallet' &&
            <ul className="Sidebar__tags">
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
