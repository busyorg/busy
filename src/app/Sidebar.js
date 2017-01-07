import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import fetch from 'isomorphic-fetch';
import formatter from 'steem/lib/formatter';
import steemdb from 'steemdb';
import numeral from 'numeral';
import _ from 'lodash';
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
    hideSidebar,
  }, dispatch)
)

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      isLoaded: false,
      followingIsFetching: false,
      followingFetched: false,
      categories: [],
      props: {},
      price: '',
      following: [],
      menu: 'categories',
      search: '',
    };
  }

  componentDidMount() {
    api.getState('trending/busy', (err, result) => {
      let categories = (result.category_idx && result.category_idx.trending)
        || (result.tag_idx && result.tag_idx.trending);
      categories = categories.filter(Boolean);
      this.setState({
        isFetching: false,
        isLoaded: true,
        categories: categories,
        props: result.props,
      });
      this.getFollowing();
    });

    fetch('https://api.coinmarketcap.com/v1/ticker/steem/')
      .then(res =>
        res.json().then((json) => {
          const priceUsd = json[0].price_usd;
          this.setState({ price: priceUsd });
        })
      );
  }

  componentDidUpdate() {
    if (!this.state.followingFetched) {
      this.getFollowing();
    }
  }

  getFollowing() {
    if (!this.state.following.length &&
      !this.state.followingIsFetching &&
      !this.state.followingFetched) {
      this.setState({ followingIsFetching: true });
      steemdb.accounts({
          account: this.props.auth.user.name
        },
        (err, result) => {
          this.setState({
            following: result[0].following,
            followingIsFetching: false,
            followingFetched: true,
          });
        });
    }
  }

  filterTagsBySearch(tags = []) {
    const { search } = this.state;
    return tags.filter((tag) => _.startsWith(tag, search));
  }

  renderFavoritedTags() {
    const { favorites } = this.props;
    const favoritedCategories = favorites.categories;
    return this.filterTagsBySearch(favoritedCategories)
      .sort()
      .slice(0, 16)
      .map((category, idx) =>
        <li key={idx}>
          <Link to={`/hot/${category}`} activeClassName="active">
            <Icon name="star" xs />
            {category}
          </Link>
        </li>
    );
  }

  renderTags() {
    const { categories } = this.state;
    const { favorites } = this.props;

    if (categories) {
      // excluding items in favorite to avoid repetition
      const categoriesWithoutFavorites = _.difference(categories, favorites.categories);

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

  renderSearchAsTag() {
    const { search, categories } = this.state;
    const { favorites } = this.props;
    if (search
      && !categories.includes(search)
      && !favorites.categories.includes(search)
    ) {
      return (
        <li>
          <Link to={`/hot/${search}`} activeClassName="active">
            #{search}
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
    this.setState({
      menu,
      search: '',
    });
  };

  render() {
    const { search, price, props, menu } = this.state;
    const user = this.props.auth.user;

    const power = props
      ? formatter.vestToSteem(
        user.vesting_shares,
        props.total_vesting_shares,
        props.total_vesting_fund_steem,
      )
      : 0;

    const dollar = price
      ? (parseFloat(price) * (parseFloat(user.balance) + parseFloat(power)))
        + parseFloat(user.sbd_balance)
      : 0;

    return (
      <nav className="Sidebar">
        <div className="sidebar-header">
          <a className="hide-sidebar" onClick={() => this.props.hideSidebar()}>
            <Icon name="arrow_back" className="Icon--menu" />
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
          menu={menu}
          auth={this.props.auth}
          messages={this.props.messages}
        />

        <div className="sidebar-content">
          {this.state.isFetching && <Loading color="white" />}
          {price && props && menu === 'settings' &&
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

          {_.size(this.state.categories) > 0 && menu === 'categories' &&
            <div>
              <ul>
                <li>
                  <ul>
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
                    { this.renderSearchAsTag() }
                    { this.renderFavoritedTags() }
                    { this.renderTags() }
                    <li><Link to="/tags" activeClassName="active"><FormattedMessage id="see_more" /></Link></li>
                  </ul>
                </li>
              </ul>
            </div>
          }

          {menu === 'users' &&
            <SidebarUsers
              messages={this.props.messages}
              auth={this.props.auth}
              contacts={this.state.following}
              favorites={this.props.favorites}
            />
          }

          {price && props && menu === 'write' &&
            <ul>
              <li className="title">
                <Link to="/write">
                  <Icon name="add" />{' '}
                  <FormattedMessage id="write" />
                </Link>
              </li>
              <li className="title">
                <Link to="/drafts">
                  <Icon name="library_books" />{' '}
                  <FormattedMessage id="drafts" />
                </Link>
              </li>
              <li className="title">
                <Link to="/bookmarks">
                  <Icon name="bookmark" />{' '}
                  <FormattedMessage id="bookmarks" />
                </Link>
              </li>
            </ul>}

          {price && props && menu === 'wallet' &&
            <ul>
              <li className="title">
                <Link to="/transfer">
                  <Icon name="send" />{' '}
                  <FormattedMessage id="transfer" />
                </Link>
              </li>
              <li>
                <ul>
                  <li><span className="menu-row">1 Steem <span className="pull-right">{numeral(price).format('$0,0.000')}</span></span></li>
                  <li><span className="menu-row">Steem <span className="pull-right">{numeral(user.balance).format('0,0.00')}</span></span></li>
                  <li><span className="menu-row">Steem Power <span className="pull-right">{numeral(power).format('0,0.00')}</span></span></li>
                  <li><span className="menu-row">Steem Dollars <span className="pull-right">{numeral(user.sbd_balance).format('0,0.00')}</span></span></li>
                  <li><span className="menu-row"><FormattedMessage id="estimated_value" /> <span className="pull-right">{numeral(dollar).format('$0,0.00')}</span></span></li>
                </ul>
              </li>
              </ul>}
        </div>
      </nav>
    );
  }
}
