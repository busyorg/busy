import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import numeral from 'numeral';
import _ from 'lodash';
import UserCoverImage from '../../user/UserCoverImage';
import Avatar from '../Avatar';
import Icon from '../Icon';
import Loading from '../../components/Icon/Loading';
import Follow from '../Follow';
import Badge from '../Badge';
import { getAccountWithFollowingCount } from '../../helpers/apiHelpers';
import Tooltip from './Tooltip';

import './ProfileTooltip.less';

const TOOLTIP_MARGIN = 10;

const getTooltipOnBottomStyle = (position, tooltipWidth) => ({
  position: 'absolute',
  top: `${position.bottom + TOOLTIP_MARGIN}px`,
  left: `${position.left}px`,
});

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
      el: null,
    };
  }

  static propTypes = {
    value: PropTypes.shape({ username: PropTypes.string }),
  };

  handleRef = (e) => {
    if (!this.state.el) {
      this.setState({ el: e });
    }
  };

  fetchData() {
    const { username } = this.props.value;
    this.setState({ fetching: true });
    getAccountWithFollowingCount(username)
      .then((userData) => {
        this.setState({ userData, fetching: false });
      });
  }

  componentDidUpdate(nextProps) {
    const { username } = this.props.value;
    if (username !== nextProps.value.username) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { pos, className } = this.props;
    const tooltipWidth = this.state.el ? this.state.el.clientWidth : 0;

    const style = getTooltipOnBottomStyle(pos, tooltipWidth);
    const { username } = this.props.value;
    const { userData } = this.state;
    const jsonMetadata = userData.json_metadata;

    if (this.state.fetching || _.isEmpty(userData)) {
      return (
        <div className={className} style={style}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={className} style={style} ref={this.handleRef}>
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

export const ProfileTooltipOrigin = ({ username, children }) => (
  <Tooltip
    value={{ username }}
    keep
    TemplateComp={ProfileTooltip}
    className="ProfileTooltip"
  >
    {children}
  </Tooltip>
);
