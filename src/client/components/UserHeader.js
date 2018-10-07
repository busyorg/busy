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
  SCORE,
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
          <div className="UserHeader__user__details">
            <h2 className="UserHeader__user__username">
              {username}
              {/* <ReputationTag reputation={userReputation} /> */}
            </h2>
						<div className="UserHeader__row UserHeader__handle">
							@{handle}
						</div>
						{isFollowing && (
							<span className="UserHeader__follows-you UserHeader__follows-you--mobile">
								<FormattedMessage id="follows_you" defaultMessage="Follows you" />
							</span>
						)}
          </div>
					<div className="UserHeader__row UserHeader__user__buttons">
						{!isSameUser && 
							<div
								className={classNames('UserHeader__user__button', {
									'UserHeader__user__button-follows-you': isFollowing && !isSameUser,
								})}
							>
								{/*  (
									<Link className="edit-profile" to="/edit-profile">
										<Action>
											<FormattedMessage id="edit_profile" defaultMessage="Edit profile" />
										</Action>
									</Link>
									) : (
									) */}
								{!isSameUser && <FollowButton username={handle} /> }
							</div>
						}
						{!isSameUser && (
							<div
								className={classNames('UserHeader__user__button', {
									'UserHeader__user__button-follows-you': isFollowing && !isSameUser,
								})}
							>
								<Action className="send-money" onClick={onTransferClick}>
									<FormattedMessage id="send" defaultMessage="Send" />
									<img src="/images/dollar.png" className="send-dollar on-right"/>
								</Action>
							</div>
						)}
					</div>
          {/* <div className="UserHeader__handle-rank-container">
            </div>
            <div className="UserHeader__rank">
              <i className="iconfont icon-ranking" />
              <FormattedMessage
                id={getUserRankKey(SCORE)}
                defaultMessage={getUserRank(SCORE)}
              />
          </div> */}
        </div>
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  username: PropTypes.string,
  handle: PropTypes.string,
  userReputation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  SCORE: PropTypes.number,
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
  SCORE: 0,
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  onTransferClick: () => {},
};

export default UserHeader;
