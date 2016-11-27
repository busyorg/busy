import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { showSidebar } from '../actions';
import Icon from '../widgets/Icon';

import './Header.scss';

@connect(
  state => ({
    app: state.app,
  }),
  dispatch => bindActionCreators({
    showSidebar: showSidebar,
  }, dispatch)
)

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    showSidebar: PropTypes.func,
  };

  render() {
    return (
      <header>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible &&
          <a className="left" onClick={() => this.props.showSidebar()}>
            <Icon name="menu" className="icon-menu" />
          </a>}
          <div className="section-content top-head">
            <div className="logo"><Link to="/" onlyActiveOnIndex activeClassName="active"><img src="/img/logo.svg" /></Link></div>
          </div>
          <a className="right">
            <Icon name="notifications" className="icon-menu" />
          </a>
        </div>
        {this.props.children && <div className="app-nav">{this.props.children}</div>}
      </header>
    );
  }
}

