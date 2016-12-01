import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import Icon from '../../widgets/Icon';

const TriggerProfile = React.createClass({
  render() {
    const {
      isFollowing,
      followingIsFetching,
      onClickFollow,
      hasFollow
    } = this.props;

    return (
      <div className="actions">
        <div className="triggers">
          {hasFollow &&
            <a className={classNames('trigger', { disabled: followingIsFetching })} onClick={onClickFollow}>
              <Icon name={isFollowing ? 'person_outline' : 'person_add'} />
            </a>}
        </div>
      </div>
    );
  }
});

module.exports = TriggerProfile;
