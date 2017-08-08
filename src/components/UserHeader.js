import React, { PropTypes } from 'react';
import { Tag, Popover } from 'antd';
import { formatter } from 'steem';
import Avatar from './Avatar';
import Follow from './Button/Follow';
import Action from './Button/Action';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import './UserHeader.less';

const UserHeader = ({
  auth,
  username,
  handle,
  userReputation,
  isSameUser,
  isFollowed,
  pendingFollow,
  onFollowClick,
}) =>
  (<div className="UserHeader">
    <div className="UserHeader__container">
      <Avatar username={handle} size={100} />
      <div className="UserHeader__user">
        <div className="UserHeader__row">
          <h2 className="UserHeader__user__username">
            {username}
            <Tag>
              {formatter.reputation(userReputation)}
            </Tag>
          </h2>
          <div className="UserHeader__user__button">
            {auth &&
              auth.isAuthenticated &&
              (isSameUser
                ? <Action small text="Edit profile" />
                : <Follow
                  isFollowed={isFollowed}
                  pending={pendingFollow}
                  onClick={onFollowClick}
                />)}
          </div>
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <PopoverMenu>
                <PopoverMenuItem key="option1">Option 1</PopoverMenuItem>
                <PopoverMenuItem key="option2">Option 2</PopoverMenuItem>
                <PopoverMenuItem key="option3">Option 3</PopoverMenuItem>
              </PopoverMenu>
            }
          >
            <i className="iconfont icon-more UserHeader__more" />
          </Popover>
        </div>
        <div className="UserHeader__row UserHeader__handle">
          @{handle}
        </div>
      </div>
    </div>
  </div>);

UserHeader.propTypes = {
  auth: PropTypes.shape(),
  username: PropTypes.string,
  handle: PropTypes.string,
  userReputation: PropTypes.string,
  isSameUser: PropTypes.bool,
  isFollowed: PropTypes.bool,
  pendingFollow: PropTypes.bool,
  onFollowClick: PropTypes.func,
};

UserHeader.defaultProps = {
  auth: {},
  username: '',
  handle: '',
  userReputation: '0',
  isSameUser: false,
  isFollowed: false,
  pendingFollow: false,
  onFollowClick: () => {},
};

export default UserHeader;
