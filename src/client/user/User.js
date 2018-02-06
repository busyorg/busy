import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { currentUserFollowersUser } from '../helpers/apiHelpers';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
  getIsUserFailed,
  getIsUserLoaded,
  getAuthenticatedUserName,
} from '../reducers';
import { openTransfer } from '../wallet/walletActions';
import { getAccount } from './usersActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
  }),
  {
    getAccount,
    openTransfer,
  },
)
export default class User extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getAccount: PropTypes.func,
    openTransfer: PropTypes.func,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getAccount: () => {},
    openTransfer: () => {},
  };

  static fetchData(store, match) {
    return store.dispatch(getAccount(match.params.name));
  }

  state = {
    popoverVisible: false,
    isFollowing: false,
  };

  componentDidMount() {
    const { user, authenticated, authenticatedUserName } = this.props;
    if (!user.id && !user.failed) {
      this.props.getAccount(this.props.match.params.name);
    }

    if (authenticated) {
      currentUserFollowersUser(authenticatedUserName, this.props.match.params.name).then(resp => {
        const result = _.head(resp);
        const followingUsername = _.get(result, 'following', '');
        const isFollowing = this.props.authenticatedUserName === followingUsername;
        this.setState({
          isFollowing,
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const diffUsername = this.props.match.params.name !== nextProps.match.params.name;
    const diffAuthUsername = this.props.authenticatedUserName !== nextProps.authenticatedUserName;
    if (diffUsername || diffAuthUsername) {
      currentUserFollowersUser(nextProps.authenticatedUserName, nextProps.match.params.name).then(
        resp => {
          const result = _.head(resp);
          const followingUsername = _.get(result, 'following', '');
          const isFollowing = nextProps.authenticatedUserName === followingUsername;
          this.setState({
            isFollowing,
          });
        },
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getAccount(this.props.match.params.name);
    }
  }

  handleUserMenuSelect = key => {
    if (key === 'transfer') {
      this.props.openTransfer(this.props.match.params.name);
      this.setState({
        popoverVisible: false,
      });
    }
  };

  handleVisibleChange = visible => {
    this.setState({ popoverVisible: visible });
  };

  render() {
    const { authenticated, authenticatedUser, loaded, failed } = this.props;
    const { isFollowing } = this.state;
    if (failed) return <Error404 />;

    const username = this.props.match.params.name;
    const { user } = this.props;
    const { profile = {} } = user.json_metadata || {};
    const busyHost = global.postOrigin || 'https://busy.org';
    const desc = profile.about || `Posts by ${username}`;
    const image = getAvatarURL(username) || '/images/logo.png';
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const displayedUsername = profile.name || username || '';
    const hasCover = !!profile.cover_image;
    const title = `${displayedUsername} - Busy`;

    const isSameUser = authenticated && authenticatedUser.name === username;

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
            coverImage={profile.cover_image}
            isFollowing={isFollowing}
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
              <div className="right">{loaded && <RightSidebar key={user.name} />}</div>
            </Affix>
            {loaded && <div className="center">{renderRoutes(this.props.route.routes)}</div>}
          </div>
        </div>
      </div>
    );
  }
}
