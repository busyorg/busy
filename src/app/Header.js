import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';
import { showSidebar } from '../actions';
import Icon from '../widgets/Icon';
import Popover from '../widgets/popover/Popover';
import ActivityNotification from '../activityNotification/ActivityNotification';
import * as activityNotificationsActions from '../activityNotification/activityNotificationActions';
import './Header.scss';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
    activityNotification: state.activityNotification,
  }),
  dispatch => bindActionCreators({
    showSidebar: showSidebar,
    fetchActivityNotifications: activityNotificationsActions.fetchActivityNotifications,
  }, dispatch)
)
export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    showSidebar: PropTypes.func,
    title: PropTypes.string,
  };

  componentDidMount() {
    // TODO: should replace it with a websocket connection to busy-push to pull new notifications
    this.unlisten = browserHistory.listen(() => {
      this.props.fetchActivityNotifications();
    });
  }

  componentWillMount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  render() {
    return (
      <header>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible &&
            <a className="left ml-2" onClick={() => this.props.showSidebar()}>
              <Icon name="menu" className="Icon--menu" />
            </a>
          }
          <div className="section-content top-head">
            <div className="logo">
              <Link to="/" onlyActiveOnIndex activeClassName="active">
                <img src="/img/logo.svg" />
              </Link>
            </div>
          </div>
          {this.props.auth.isAuthenticated ?
            <div className="right mr-2">
              <SimpleTooltipOrigin appearOn="bottom" message="Write">
                <Link to="/write">
                  <Icon name="add" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>
              
              <Popover
                title="Notifications"
                content={<ActivityNotification />}
                appearOn="bottom-left"
                containerClassName="ActivityNotification"
                fixedPosition
              >
                <SimpleTooltipOrigin appearOn="bottom" message="Open notifications">
                  <a>{this.props.activityNotification.unseenCounter}
                    <Icon name="notifications" className="Icon--menu" />
                  </a>
                </SimpleTooltipOrigin>
              </Popover>

              <SimpleTooltipOrigin appearOn="bottom" message="Bookmarks">
                <Link to="/bookmarks">
                  <Icon name="bookmarks" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>

              <SimpleTooltipOrigin appearOn="bottom" message="Help">
                <Link to="/help">
                  <Icon name="help_outline" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>
            </div>
            :
            <div className="right mr-2">
              <SimpleTooltipOrigin appearOn="bottom" message="Help">
                <Link to="/help">
                  <Icon name="help_outline" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>
            </div>
          }
        </div>
      </header>
    );
  }
}

