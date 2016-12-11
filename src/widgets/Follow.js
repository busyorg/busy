import React from 'react';
import classNames from 'classnames';

import Icon from './Icon';

const Follow = ({
  isFollowing,
  followingIsFetching,
  onClickFollow,
  hasFollow,
}) =>
  <span>
    { hasFollow &&
      <a className={classNames('trigger', { disabled: followingIsFetching })} onClick={onClickFollow}>
        <Icon name={isFollowing ? 'person_outline' : 'person_add'} />
      </a>
    }
  </span>;

export default Follow;
