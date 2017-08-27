import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tag, Tooltip, Popover } from 'antd';
import { formatter } from 'steem';
import Avatar from './Avatar';
import FollowButton from '../widgets/FollowButton';
import Action from './Button/Action';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import './UserHeader.less';

const UserHeader = ({
  intl,
  authenticated,
  username,
  handle,
  userReputation,
  rank,
  isSameUser,
}) =>
  (<div
    className="UserHeader"
    style={{ backgroundImage: `url("${process.env.STEEMCONNECT_IMG_HOST}/@${handle}/cover")` }}
  >
    <div className="UserHeader__container">
      <Avatar username={handle} size={100} />
      <div className="UserHeader__user">
        <div className="UserHeader__row">
          <h2 className="UserHeader__user__username">
            {username}
            <Tooltip title={intl.formatMessage({ id: 'reputation_score', defaultMessage: 'Reputation Score' })}>
              <Tag>
                {formatter.reputation(userReputation)}
              </Tag>
            </Tooltip>
          </h2>
          <div className="UserHeader__user__button">
            {authenticated &&
              (isSameUser
                ? <a target="_blank" rel="noopener noreferrer" href={`https://steemit.com/@${username}/settings`}>
                  <Action small text={intl.formatMessage({ id: 'edit_profile', defaultMessage: 'Edit profile' })} />
                </a>
                : <FollowButton username={username} />)
            }
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
        <div className="UserHeader__rank">
          <i className="iconfont icon-ranking" /> {rank}
        </div>
      </div>
    </div>
  </div>);

UserHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  username: PropTypes.string,
  handle: PropTypes.string,
  userReputation: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  rank: PropTypes.string,
  isSameUser: PropTypes.bool,
};

UserHeader.defaultProps = {
  username: '',
  handle: '',
  userReputation: '0',
  rank: 'Minnow',
  isSameUser: false,
};

export default injectIntl(UserHeader);
