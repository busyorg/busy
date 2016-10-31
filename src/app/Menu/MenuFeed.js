import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

module.exports = React.createClass({
  render() {
    const category = (this.props.category) ? `/${this.props.category}` : '';
    return (
      <ul className="app-nav">
        <li>
          <Link to={`/trending${category}`} onlyActiveOnIndex activeClassName="active">
            <i className="icon icon-md material-icons">show_chart</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="trending" /></span>
          </Link>
        </li>
        <li>
          <Link to={`/hot${category}`} activeClassName="active">
            <i className="icon icon-md material-icons">whatshot</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="hot" /></span>
          </Link>
        </li>
        <li>
          <Link to={`/cashout${category}`} activeClassName="active">
            <i className="icon icon-md material-icons">schedule</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="payout_time" /></span>
          </Link>
        </li>
        <li>
          <Link to={`/created${category}`} activeClassName="active">
            <i className="icon icon-md material-icons">fiber_new</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="new" /></span></Link>
        </li>
        <li>
          <Link to={`/active${category}`} activeClassName="active">
            <i className="icon icon-md material-icons">track_changes</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="active" /></span>
          </Link>
        </li>
      </ul>
    );
  }
});
