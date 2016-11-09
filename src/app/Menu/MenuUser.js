import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

module.exports = React.createClass({
  render() {
    const username = this.props.username;
    return (
      <ul className="app-nav">
        <li>
          <Link to={`/@${username}`} activeClassName="active">
            <i className="icon icon-md material-icons">assignment_ind</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="profile" /></span>
          </Link>
        </li>
        <li>
          <Link to="#activity" activeClassName="active">
            <i className="icon icon-md material-icons">update</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="activity" /></span></Link>
        </li>
        <li>
          <Link to={`/@${username}/feed`} activeClassName="active">
            <i className="icon icon-md  material-icons">subject</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="feed" /></span></Link>
        </li>
        <li>
          <Link to={`/@${username}/transfers`} activeClassName="active">
            <i className="icon icon-md material-icons">account_balance_wallet</i>{' '}
            <span className="hidden-xs"><FormattedMessage id="wallet" /></span></Link>
        </li>
      </ul>
    );
  }
});
