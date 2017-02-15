import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import formatter from 'steem/lib/formatter';
import numeral from 'numeral';
import _ from 'lodash';
import api from '../steemAPI';
import { hideSidebar } from '../actions';
import Loading from '../widgets/Loading';
import Icon from '../widgets/Icon';
import SidebarHeader from './Sidebar/SidebarHeader';
import SidebarTabs from './Sidebar/SidebarTabs';
import SidebarUsers from './Sidebar/SidebarUsers';
import SidebarTags from './Sidebar/SidebarTags';
import './Sidebar.scss';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
    user: state.user,
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
      categories: [],
      props: {},
      price: '',
      menu: 'categories',
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
        categories,
        props: result.props,
      });
    });
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
    const { props, menu } = this.state;
    const { auth, app: { rate }, hideSidebar } = this.props;
    const { user } = auth;

    const power = props
      ? formatter.vestToSteem(
        user.vesting_shares,
        props.total_vesting_shares,
        props.total_vesting_fund_steem,
      )
      : 0;

    const dollar = rate
      ? (parseFloat(rate) * (parseFloat(user.balance) + parseFloat(power)))
        + parseFloat(user.sbd_balance)
      : 0;

    return (
      <nav className="Sidebar">
        <SidebarHeader
          auth={auth}
          user={user}
          hideSidebar={hideSidebar}
          onClickMenu={this.onClickMenu}
        />

        <SidebarTabs
          onClickMenu={this.onClickMenu}
          menu={menu}
          auth={this.props.auth}
          messages={this.props.messages}
        />

        <div className="sidebar-content">
          {this.state.isFetching && <Loading color="white" />}
          {rate && props && menu === 'settings' &&
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
            <SidebarTags
              favorites={this.props.favorites}
              categories={this.state.categories}
            />
          }

          {menu === 'users' &&
            <SidebarUsers
              messages={this.props.messages}
              auth={this.props.auth}
              contacts={this.props.user.following.list}
              favorites={this.props.favorites}
            />
          }

          {rate && props && menu === 'write' &&
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

          {rate && props && menu === 'wallet' &&
            <ul>
              <li className="title">
                <Link to={`/@${this.props.auth.user.name}/transfers`}>
                  <Icon name="account_balance_wallet" />{' '}
                  <FormattedMessage id="wallet" />
                </Link>
                <Link to="/transfer">
                  <Icon name="send" />{' '}
                  <FormattedMessage id="transfer" />
                </Link>
              </li>
              <li>
                <ul>
                  <li><span className="menu-row">1 Steem <span className="pull-right">{numeral(rate).format('$0,0.000')}</span></span></li>
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
