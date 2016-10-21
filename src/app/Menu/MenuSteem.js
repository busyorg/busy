import React from 'react';
import { Link } from 'react-router';

module.exports = React.createClass({
  render() {
    const username = this.props.username;
    return (
      <ul className="app-nav">
        <li><Link to="#" activeClassName="active"><i className="icon icon-md material-icons">info_outline</i><span className="hidden-xs"> Steem</span></Link></li>
        <li><Link to="#" activeClassName="active"><i className="icon icon-md material-icons">grade</i><span className="hidden-xs"> Rankings</span></Link></li>
        <li><Link to="#" activeClassName="active"><i className="icon icon-md material-icons">gavel</i><span className="hidden-xs"> Witnesses</span></Link></li>
      </ul>
    );
  }
});
