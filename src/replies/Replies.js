import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReplies } from './repliesActions';
import { getIsAuthenticated } from '../reducers';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';

export class IReplies extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    getReplies: PropTypes.func.isRequired,
  };

  static defaultProps = {
    authenticated: false,
    getReplies: () => {},
  };

  componentWillMount() {
    if (this.props.authenticated) {
      this.props.getReplies();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.authenticated && !this.props.authenticated) {
      nextProps.getReplies();
    }
  }

  render() {
    return (
      <div className="shifted">
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={72}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <Affix className="rightContainer" stickPosition={72}>
            <div className="right">
              <RightSidebar />
            </div>
          </Affix>
          <div className="center">
            <h1>User replies</h1>
          </div>
        </div>
      </div>);
  }
}

const mapStateToProps = state => ({ authenticated: getIsAuthenticated(state) });

export default connect(mapStateToProps, { getReplies })(IReplies);
