import React from 'react';
import { Link } from 'react-router';

const HeaderTriggers = React.createClass({
  render() {
    const category = this.props.category;
    return (
      <ul className="app-nav">
        <li><Link to={`/trending${category}`} onlyActiveOnIndex activeClassName="active"><i className="icon icon-md material-icons">show_chart</i><span className="hidden-xs"> Trending</span></Link></li>
        <li><Link to={`/hot${category}`} activeClassName="active"><i className="icon icon-md material-icons">whatshot</i><span className="hidden-xs"> Hot</span></Link></li>
        <li><Link to={`/cashout${category}`} activeClassName="active"><i className="icon icon-md material-icons">schedule</i><span className="hidden-xs"> Payout Time</span></Link></li>
        <li><Link to={`/created${category}`} activeClassName="active"><i className="icon icon-md material-icons">fiber_new</i><span className="hidden-xs"> New</span></Link></li>
        <li><Link to={`/active${category}`} activeClassName="active"><i className="icon icon-md material-icons">track_changes</i><span className="hidden-xs"> Active</span></Link></li>
        <li className="hide"><Link to={`/responses${category}`} activeClassName="active"><i className="icon icon-md material-icons">comment</i><span className="hidden-xs"> Responses</span></Link></li>
        <li className="hide"><Link to={`/votes${category}`} activeClassName="active"><i className="icon icon-md material-icons">gavel</i><span className="hidden-xs"> Popular</span></Link></li>
      </ul>
    );
  }
});

module.exports = HeaderTriggers;
