import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

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

          { hasFollow &&
            <a className={classNames('trigger', { disabled: followingIsFetching })} onClick={onClickFollow}>
              <i className="icon material-icons">{isFollowing ? 'person_outline' : 'person_add'}</i>
            </a>
          }

          <Link to={`/messages/@${this.props.username}`} className="trigger"><i className="icon icon-md material-icons">chat_bubble_outline</i></Link>
        </div>
      </div>
    );
  }
});

module.exports = TriggerProfile;
