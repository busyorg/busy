import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import numeral from 'numeral';
import _ from 'lodash';
import UserCoverImage from '../UserCoverImage';
import Avatar from '../../widgets/Avatar';
import Icon from '../../widgets/Icon';
import Loading from '../../widgets/Loading';
import Follow from '../../widgets/Follow';
import Badge from '../../widgets/Badge';
import { getAccountWithFollowingCount } from '../../helpers/apiHelpers';

import './ProfileTooltip.scss';

@connect(
  state => ({
    auth: state.auth,
  })
)
export default class ProfileTooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      fetching: false,
    };
  }

  static propTypes = {
    username: PropTypes.string
  };

  fetchData() {
    const { username } = this.props;
    this.setState({ fetching: true });
    getAccountWithFollowingCount(username)
      .then((userData) => {
        this.setState({ userData, fetching: false });
      });
  }

  componentDidUpdate(nextProps) {
    if (this.props.username !== nextProps.username) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { username } = this.props;
    const { userData } = this.state;
    const jsonMetadata = userData.json_metadata;

    if (this.state.fetching || _.isEmpty(userData)) {
      return (
        <div className="ProfileTooltip">
          <Loading />
        </div>
      );
    }

    return (
      <div className="ProfileTooltip">
        <div>
          <UserCoverImage
            width={300}
            height={120}
            username={username}
          />
        </div>

        <div className="ProfileTooltip__leftContainer">
          <div className="ProfileTooltip__avatar">
            <Link to={`/@${username}`}>
              <Avatar
                md
                username={username}
                reputation={userData.name && userData.reputation}
              />
            </Link>
          </div>

          <Badge vestingShares={userData.vesting_shares} />
        </div>

        <div className="ProfileTooltip__rightContainer">
          <h3>
            <Link to={`/@${username}`}>
              {username}
            </Link>
          </h3>
          <p>
            <Link to={`/@${username}/followers`} className="ProfileTooltip--smallText">
              <Icon name="people" sm />
              {numeral(parseInt(userData.follower_count, 10)).format('0,0')}
              <span className="hidden-xs"> Followers</span>
            </Link>

            <Link to={`/@${username}/followed`} className="ProfileTooltip--smallText">
              <Icon name="people" sm />
              {numeral(parseInt(userData.following_count, 10)).format('0,0')}
              <span className="hidden-xs"> Followed</span>
            </Link>
          </p>
          <p>
            {jsonMetadata.profile &&
              jsonMetadata.profile.location &&
              `Location: ${jsonMetadata.profile.location}`
            }
          </p>
          <p className="ProfileTooltip_about">
            {jsonMetadata.profile && jsonMetadata.profile.about}
          </p>
        </div>

        <div className="ProfileTooltip__footerContainer">

          <div>
            <Link to={`/messages/@${username}`}>
              <Icon name="chat_bubble" />
              Message
            </Link>
            {' '}
            <Follow username={username} store={this.props.store} >
              Follow
            </Follow>
          </div>
        </div>
      </div>
    );
  }
}
