import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';
import Icon from '../widgets/Icon';
import './Header.less';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
  }),
)
export default class Header extends Component {
  render() {
    return (
      <header>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible &&
            <a className="left ml-2">
              <Icon name="menu" className="Icon--menu" />
            </a>
          }
          <div className="section-content top-head">
            <div className="logo">
              <NavLink to="/" activeClassName="active">
                <img src="/img/logo.svg" />
              </NavLink>
            </div>
          </div>
          {this.props.auth.isAuthenticated ?
            <div className="right mr-2">
              <SimpleTooltipOrigin appearOn="bottom" message="Write">
                <Link to="/write">
                  <Icon name="add" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>

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

