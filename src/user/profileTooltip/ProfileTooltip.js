import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import steemdb from 'steemdb';
import numeral from 'numeral';
import _ from 'lodash';
import UserCoverImage from '../UserCoverImage';
import Avatar from '../../widgets/Avatar';
import Icon from '../../widgets/Icon';
import Loading from '../../widgets/Loading';

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
    steemdb.accounts({ account: username }, (err, result) => {
      this.setState({ userData: result[0], fetching: false });
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

    let jsonMetadata = {};
    if (!_.isEmpty(userData) && userData.json_metadata) {
      try {
        jsonMetadata = JSON.parse(userData.json_metadata);
      } catch (e) {
        throw new Error(`Error parsing jsonMetadata for user ${username}`);
      }
    }

    if (this.state.fetching) {
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
            <Avatar
              md
              username={username}
              reputation={userData.name && userData.reputation}
            />
          </div>
        </div>

        <div className="ProfileTooltip__rightContainer">
          <h3>{username}</h3>
          <p>
            { jsonMetadata.profile &&
              jsonMetadata.profile.location &&
              `Location: ${jsonMetadata.profile.location}`
            }
          </p>
          <p className="ProfileTooltip_about">
            { jsonMetadata.profile && jsonMetadata.profile.about }
          </p>
        </div>

        <div className="ProfileTooltip__footerContainer">
          <Link to={`/@${username}/followers`}>
            <Icon name="people" sm />
            { numeral(parseInt(userData.followers_count, 10)).format('0,0') }
            <span className="hidden-xs"> Followers</span>
          </Link>

          <Link to={`/@${username}/followed`}>
            <Icon name="people" sm />
            { numeral(parseInt(userData.following_count, 10)).format('0,0') }
            <span className="hidden-xs"> Followed</span>
          </Link>
        </div>
      </div>
    );
  }
}
