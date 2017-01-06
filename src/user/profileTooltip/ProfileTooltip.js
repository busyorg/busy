import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ToolTip from 'react-portal-tooltip';
import steemdb from 'steemdb';
import numeral from 'numeral';
import _ from 'lodash';
import UserCoverImage from '../UserCoverImage';
import Avatar from '../../widgets/Avatar';
import Icon from '../../widgets/Icon';

import './ProfileTooltip.scss';

@connect(
  state => ({
    auth: state.auth,
  })
)
export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      userData: {},
    };
  }

  static propTypes = {
    username: PropTypes.string
  };

  fetchData() {
    steemdb.accounts({ account: this.props.username }, (err, result) => {
      this.setState({ userData: result[0] });
      console.log(result[0]);
    });
  }

  openTooltip = () => {
    this.setState({ isOpen: true });
    this.fetchData();
  };

  closeTooltip = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { username } = this.props;
    const { userData } = this.state;
    let jsonMetadata = {};
    if (!_.isEmpty(userData)) {
      try {
        jsonMetadata = JSON.parse(userData.json_metadata);
      } catch (e) {
        throw new Error(`Error parsing jsonMetadata for user ${username}`);
      }
    }

    return (
      <div className="ProfileTooltipContainer">
        <Link
          onMouseEnter={this.openTooltip}
          onMouseLeave={this.closeTooltip}
          to={`/@${username}`}
          id={`${username}`}
        >
          { this.props.children }
        </Link>

        <ToolTip
          active={this.state.isOpen}
          position="right"
          arrow="top"
          parent={`#${username}`}
        >
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
        </ToolTip>
      </div>
    );
  }
}
