import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import getImage from '../helpers/getImage';

import { getIsAuthenticated, getAuthenticatedUser, getUser } from '../reducers';

import { openTransfer } from '../wallet/walletActions';
import { getAccountWithFollowingCount } from './usersActions';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    user: getUser(state, ownProps.match.params.name),
  }),
  {
    getAccountWithFollowingCount,
    openTransfer,
  },
)
export default class User extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    getAccountWithFollowingCount: PropTypes.func,
    openTransfer: PropTypes.func,
  };

  static defaultProps = {
    getAccountWithFollowingCount: () => {},
    openTransfer: () => {},
  };

  static fetchData(store, match) {
    return store.dispatch(getAccountWithFollowingCount({ name: match.params.name }));
  }

  state = {
    popoverVisible: false,
  };

  componentDidMount() {
    if (!this.props.user.name && this.props.authenticatedUser.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name,
        authUser: this.props.authenticatedUser.name });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name
      && this.props.authenticatedUser.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name,
        authUser: this.props.authenticatedUser.name });
    }
  }

  handleUserMenuSelect = (key) => {
    if (key === 'transfer') {
      this.props.openTransfer(this.props.match.params.name);
      this.setState({
        popoverVisible: false,
      });
    }
  };

  handleVisibleChange = (visible) => {
    this.setState({ popoverVisible: visible });
  };

  render() {
    const { authenticated, authenticatedUser } = this.props;
    const username = this.props.match.params.name;
    const { user } = this.props;
    const { profile = {} } = user.json_metadata || {};
    const busyHost = global.postOrigin || 'https://busy.org';
    const desc = profile.about || `Posts by ${username}`;
    const image = getImage(`@${username}`) || '/images/logo.png';
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const displayedUsername = profile.name || username || '';
    const hasCover = !!profile.cover_image;
    const title = `${displayedUsername} - Busy`;

    const isSameUser = authenticated && authenticatedUser.name === username;
    const followsYou = user.follows_you;

    return (
      <div className="main-panel">
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />

          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Busy" />

          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={image || 'https://steemit.com/images/steemit-twshare.png'}
          />
        </Helmet>
        <ScrollToTopOnMount />
        {user && (
          <UserHero
            authenticated={authenticated}
            user={user}
            username={displayedUsername}
            isSameUser={isSameUser}
            isFollowingYou={followsYou}
            hasCover={hasCover}
            onFollowClick={this.handleFollowClick}
            isPopoverVisible={this.state.popoverVisible}
            onSelect={this.handleUserMenuSelect}
            handleVisibleChange={this.handleVisibleChange}
          />
        )}
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">{user && user.name && <RightSidebar key={user.name} />}</div>
            </Affix>
            <div className="center">{renderRoutes(this.props.route.routes)}</div>
          </div>
        </div>
      </div>
    );
  }
}
