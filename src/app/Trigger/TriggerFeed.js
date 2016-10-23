import React from 'react';
import { Link } from 'react-router';

const TriggerFeed = React.createClass({
  render() {
    return (
      <div className="actions">
        <div className="triggers">
          {this.props.category && <Link to={`/messages/${this.props.category}`} className="trigger"><i className="icon icon-md material-icons">chat_bubble_outline</i></Link>}
          {this.props.category && <a className="trigger"><i className="icon icon-md material-icons">star_outline</i></a>}
          <Link to="/write" className="trigger"><i className="icon icon-md material-icons">add</i></Link>
        </div>
      </div>
    );
  }
});

module.exports = TriggerFeed;
