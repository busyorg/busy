import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ToolTip from 'react-portal-tooltip';

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
    };
  }

  static propTypes = {
    username: PropTypes.string
  };

  openTooltip = () => {
    this.setState({ isOpen: true });
  };

  closeTooltip = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { username } = this.props;
    return (
      <div className="ProfileTooltip">
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
            <p>This is the content of the tooltip</p>
            <img src="image.png"/>
          </div>
        </ToolTip>
      </div>
    );
  }
}
