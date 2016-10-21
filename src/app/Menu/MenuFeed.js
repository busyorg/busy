import React from 'react';
import { Link } from 'react-router';

const HeaderTriggers = React.createClass({
  render() {
    const category = this.props.category;
    return (
      <div className="sort-nav">
        <ul>
          <li><Link to={`/trending${category}`} onlyActiveOnIndex activeClassName="active"><i className="icon icon-md material-icons">show_chart</i></Link></li>
          <li><Link to={`/hot${category}`} activeClassName="active"><i className="icon icon-md material-icons">whatshot</i></Link></li>
          <li><Link to={`/cashout${category}`} activeClassName="active"><i className="icon icon-md material-icons">schedule</i></Link></li>
          <li><Link to={`/created${category}`} activeClassName="active"><i className="icon icon-md material-icons">fiber_new</i></Link></li>
          <li><Link to={`/active${category}`} activeClassName="active"><i className="icon icon-md material-icons">track_changes</i></Link></li>
          <li className="hide"><Link to={`/responses${category}`} activeClassName="active"><i className="icon icon-md material-icons">comment</i></Link></li>
          <li className="hide"><Link to={`/votes${category}`} activeClassName="active"><i className="icon icon-md material-icons">gavel</i></Link></li>
        </ul>
      </div>
    );
  }
});

module.exports = HeaderTriggers;

