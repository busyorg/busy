import React from 'react';
import { Link } from 'react-router';

import Icon from '../../widgets/Icon';

const TriggerFeed = React.createClass({
  render() {
    return (
      <div className="actions">
        <div className="triggers">
          {this.props.category &&
            <Link to={`/messages/${this.props.category}`} className="trigger">
              <Icon name="chat_bubble_outline" />
            </Link>}
          {this.props.category &&
            <a className="trigger">
              <Icon name="star_outline" />
            </a>}
          <Link to="/write" className="trigger">
            <Icon name="add" />
          </Link>
        </div>
      </div>
    );
  }
});

module.exports = TriggerFeed;
