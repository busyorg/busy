import React, { PropTypes } from 'react';
import { Popover } from 'antd';
import Avatar from './Avatar';
import Follow from './Button/Follow';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import './UserHeader.less';

const UserHeader = ({ username, handle }) => (
  <div className="UserHeader">
    <div className="UserHeader__container">
      <Avatar username={handle} size={100} />
      <div className="UserHeader__user">
        <div className="UserHeader__row">
          <h2 className="UserHeader__user__username">{username}</h2>
          <div className="UserHeader__user__button">
            <Follow />
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
  username: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired,
};

export default UserHeader;
