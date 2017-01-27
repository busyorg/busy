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
        <div className="my-3">
          <Link to={`/@${username}`}>
            <Avatar
              xl
              username={username}
              reputation={userData.name && userData.reputation}
            />
          </Link>
          <h3 className="my-2">
            <Link to={`/@${username}`}>
              {_.has(jsonMetadata, 'profile.name', username)
                ? jsonMetadata.profile.name
                : username
              }
            </Link>
          </h3>
          <div><Follow username={username} store={this.props.store} /></div>
          <div className="my-2">
            <Link to={`/@${username}/followers`} className="ProfileTooltip--smallText">
              <Icon name="people" sm />
              {numeral(parseInt(userData.follower_count, 10)).format('0,0')}
              <span className="hidden-xs"> Followers</span>
            </Link>
          </div>
        </div>
        <div>
          <p><Badge vestingShares={userData.vesting_shares} /></p>
          {_.has(jsonMetadata, 'profile.location') &&
            <p><Icon xs name="pin_drop" /> {jsonMetadata.profile.location}</p>
          }
          {_.has(jsonMetadata, 'profile.about') &&
            <p>{jsonMetadata.about}</p>
          }
        </div>
      </div>
    );
  }
}
