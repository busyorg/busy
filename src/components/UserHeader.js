import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Tag, Tooltip, Popover } from 'antd';
import { formatter } from 'steem';
import getImage from '../helpers/getImage';
import { getUserRankKey, getUserRank } from '../helpers/user';
import AvatarLightbox from './AvatarLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from './Button/Action';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import './UserHeader.less';

const UserHeader = ({
  intl,
  username,
  handle,
  userReputation,
  vestingShares,
  isSameUser,
  hasCover,
  isPopoverVisible,
  onSelect,
  handleVisibleChange,
}) => (
  <div
    className={classNames('UserHeader', { 'UserHeader--cover': hasCover })}
    style={{ backgroundImage: `url("${getImage(`@${handle}/cover`)}")` }}
  >
    <div className="UserHeader__container">
      <AvatarLightbox username={handle} size={100} previewSize={800} />
      <div className="UserHeader__user">
        <div className="UserHeader__row">
          <h2 className="UserHeader__user__username">
            {username}
            <Tooltip
              title={intl.formatMessage({
                id: 'reputation_score',
                defaultMessage: 'Reputation Score',
              })}
            >
              <Tag>{formatter.reputation(userReputation)}</Tag>
            </Tooltip>
          </h2>
          <div className="UserHeader__user__button">
            {isSameUser ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://steemit.com/@${handle}/settings`}
              >
                <Action
                  small
                  text={intl.formatMessage({
                    id: 'edit_profile',
                    defaultMessage: 'Edit profile',
                  })}
                />
              </a>
            ) : (
              <FollowButton username={handle} />
            )}
          </div>
          {!isSameUser && (
            <Popover
              placement="bottom"
              trigger="click"
              visible={isPopoverVisible}
              onVisibleChange={handleVisibleChange}
              content={
                <PopoverMenu onSelect={onSelect}>
                  <PopoverMenuItem key="transfer">
                    <FormattedMessage id="transfer" defaultMessage="Transfer" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="mute">
                    <FormattedMessage id="block_user" defaultMessage="Block this user" />
                  </PopoverMenuItem>
                </PopoverMenu>
              }
            >
              <i className="iconfont icon-more UserHeader__more" />
            </Popover>
          )}
        </div>
        <div className="UserHeader__handle-rank-container">
          <div className="UserHeader__row UserHeader__handle">@{handle}</div>
          <div className="UserHeader__rank">
            <i className="iconfont icon-ranking" />
            <FormattedMessage
              id={getUserRankKey(vestingShares)}
              defaultMessage={getUserRank(vestingShares)}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

UserHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string,
  handle: PropTypes.string,
  userReputation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  vestingShares: PropTypes.number,
  isSameUser: PropTypes.bool,
  hasCover: PropTypes.bool,
  isPopoverVisible: PropTypes.bool,
  onSelect: PropTypes.func,
  handleVisibleChange: PropTypes.func,
};

UserHeader.defaultProps = {
  username: '',
  handle: '',
  userReputation: '0',
  vestingShares: 0,
  isSameUser: false,
  hasCover: false,
  isPopoverVisible: false,
  onSelect: () => {},
  handleVisibleChange: () => {},
};

export default injectIntl(UserHeader);
