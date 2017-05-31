import React, { Component } from 'react';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import useScroll from 'react-router-scroll/lib/useScroll';
import routes from './routes';

// load the stylesheet
import './styles/base.less';

export default class AppHost extends Component {
  render() {
    return (
      <Router
        routes={routes}
        history={browserHistory}
        onUpdate={this.props.onUpdate}
        render={applyRouterMiddleware(useScroll())}
      />
    );
  }
}
