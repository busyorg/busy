import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ToolTip from 'react-portal-tooltip';
import UserCoverImage from '../UserCoverImage';

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
      isOpen: true,
    };
  }

  static propTypes = {
    username: PropTypes.string
  };

  openTooltip = () => {
    this.setState({ isOpen: true });
  };

  closeTooltip = () => {
    this.setState({ isOpen: true });
  };

  render() {
    const { username } = this.props;
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
          <div>
            <div>
              <UserCoverImage
                width={300}
                height={120}
                username={username}
              />
            </div>
            <p>{username}</p>
          </div>
        </ToolTip>
      </div>
    );
  }
}
