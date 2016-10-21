import React from 'react';
import { Link } from 'react-router';

module.exports = React.createClass({
  render() {
    return (
      <ul className="app-nav">
        <li><Link to="/about" activeClassName="active"><i className="icon icon-md material-icons">info_outline</i><span className="hidden-xs"> About</span></Link></li>
        <li><Link to="/team" activeClassName="active"><i className="icon icon-md material-icons">group_work</i><span className="hidden-xs"> Team</span></Link></li>
        <li><Link to="/projects" activeClassName="active"><i className="icon icon-md material-icons">all_out</i><span className="hidden-xs"> Projects</span></Link></li>
        <li><Link to="/jobs" activeClassName="active"><i className="icon icon-md material-icons">done</i><span className="hidden-xs"> Jobs</span></Link></li>
        <li><Link to="/donate" activeClassName="active"><i className="icon icon-md material-icons">favorite</i><span className="hidden-xs"> Donate</span></Link></li>
        <li><Link to="/help" activeClassName="active"><i className="icon icon-md material-icons">help_outline</i><span className="hidden-xs"> Help</span></Link></li>
      </ul>
    );
  }
});
