import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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

  render() {
    return (
      <div className="ProfileTooltip">
        <Link to={`/@${this.props.username}`}>
          { this.props.children }
        </Link>
      </div>
    );
  }
}
