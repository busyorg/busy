import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const TriggerProfile = React.createClass({
  render() {
    const {
      isFollowing,
      isFollowingIsLoading,
      onClickFollow
    } = this.props;

    return (
      <div className="actions">
        <div className="triggers">
          <a className={classNames('trigger', { disabled: isFollowingIsLoading })} onClick={onClickFollow}>
            <i className="icon material-icons">{isFollowing ? 'person_outline' : 'person_add'}</i>
          </a>
          <Link to={`/messages/@${this.props.username}`} className="trigger"><i className="icon icon-md material-icons">chat_bubble_outline</i></Link>
        </div>
      </div>
    );
  }
});

module.exports = TriggerProfile;
