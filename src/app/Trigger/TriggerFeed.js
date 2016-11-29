import React from 'react';
import { Link } from 'react-router';

import Icon from '../../widgets/Icon';

const TriggerFeed = React.createClass({
  render() {
    return (
      <div className="actions">
        <div className="triggers">
          <Link to="/write" className="trigger">
            <Icon name="add" />
          </Link>
        </div>
      </div>
    );
  }
});

module.exports = TriggerFeed;
