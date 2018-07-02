import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getUserRankKey, getUserRank } from '../helpers/user';
import ReputationTag from './ReputationTag';
import AvatarLightbox from './AvatarLightbox';
import FollowButton from '../widgets/FollowButton';
import Action from './Button/Action';
import './UserHeader.less';

const UserHeader = ({
  username,
  handle,
  userReputation,
  vestingShares,
  isSameUser,
  coverImage,
  hasCover,
  isFollowing,
  onTransferClick,
  isActive,
}) => {
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  return (
    <div className={classNames('UserHeader', { 'UserHeader--cover': hasCover })} style={style}>
      <div className="UserHeader__container">
        <AvatarLightbox username={handle} size={100} isActive={isActive} />
        <div className="UserHeader__user">
          <div className="UserHeader__row">
            <h2 className="UserHeader__user__username">
              {username}
              <ReputationTag reputation={userReputation} />
            </h2>
            <div className="UserHeader__user__buttons">
              <div
                className={classNames('UserHeader__user__button', {
                  'UserHeader__user__button-follows-you': isFollowing && !isSameUser,
                })}
              >
                {isSameUser ? (
                  <Link to="/edit-profile">
                    <Action>
                      <FormattedMessage id="edit_profile" defaultMessage="Edit profile" />
                    </Action>
                  </Link>
                ) : (
                  <FollowButton username={handle} />
                )}
              </div>
              {!isSameUser && (
                <div
                  className={classNames('UserHeader__user__button', {
                    'UserHeader__user__button-follows-you': isFollowing && !isSameUser,
                  })}
                >
                  <Action onClick={onTransferClick}>
                    <FormattedMessage id="tranfer" defaultMessage="Transfer" />
                  </Action>
                </div>
              )}
            </div>
          </div>
          <div className="UserHeader__handle-rank-container">
            <div className="UserHeader__row UserHeader__handle">
              @{handle}
              {isFollowing && (
                <span className="UserHeader__follows-you">
                  <FormattedMessage id="follows_you" defaultMessage="Follows you" />
                </span>
              )}
            </div>
            <div className="UserHeader__rank">
              <i className="iconfont icon-ranking" />
              <FormattedMessage
                id={getUserRankKey(vestingShares)}
                defaultMessage={getUserRank(vestingShares)}
              />
            </div>
          </div>
          {isFollowing &&
            !isSameUser && (
              <span
                className={classNames('UserHeader__follows-you UserHeader__follows-you--mobile', {
                  'UserHeader__follows-you-cover-text-color': hasCover,
                })}
              >
                <FormattedMessage id="follows_you" defaultMessage="Follows you" />
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  username: PropTypes.string,
  handle: PropTypes.string,
  userReputation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  vestingShares: PropTypes.number,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  onTransferClick: PropTypes.func,
  isActive: PropTypes.bool.isRequired,
};

UserHeader.defaultProps = {
  username: '',
  handle: '',
  userReputation: '0',
  vestingShares: 0,
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  onTransferClick: () => {},
};

export default UserHeader;
