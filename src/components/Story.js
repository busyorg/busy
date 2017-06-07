import React, { PropTypes } from 'react';
import numeral from 'numeral';
import { FormattedRelative } from 'react-intl';
import { Menu } from 'antd';
import { Link } from 'react-router';
import Avatar from './Avatar';
import Topic from './Button/Topic';
import './Story.less';

const SubMenu = Menu.SubMenu;

const Story = ({
  username,
  userFollowed,
  topics,
  likes,
  dislikes,
  comments,
  shares,
  payout,
  onLikeClick,
  onDislikeClick,
  onCommentClick,
  onShareClick
}) => {
  const likesValue = numeral(likes).format('0,0');
  const dislikesValue = numeral(dislikes).format('0,0');
  const commentsValue = numeral(comments).format('0,0');
  const sharesValue = numeral(shares).format('0,0');
  const payoutValue = numeral(payout).format('$0,0.00');

  return (
    <div className="Story">
      <Menu
        className="Story__more"
        mode="horizontal"
      >
        <SubMenu className="Story__more__item" title={<i className="iconfont icon-unfold Story__more__icon" />}>
          <Menu.Item key="follow"><i className="iconfont icon-people Story__submenu__icon" /> {(!userFollowed) ? 'Follow' : 'Unfollow'} {username}</Menu.Item>
          <Menu.Item key="save"><i className="iconfont icon-collection Story__submenu__icon" /> Save post</Menu.Item>
          <Menu.Item key="report"><i className="iconfont icon-flag Story__submenu__icon" /> Report post</Menu.Item>
        </SubMenu>
      </Menu>
      <div className="Story__header">
        <Avatar username={username} size={40} />
        <div className="Story__header__text">
          <Link to={`/${username}`}>
            <h4>{username}</h4>
          </Link>
          <span className="Story__date">2 days ago</span>
        </div>
        <div className="Story__topics">
          {topics && topics.map(topic => <Topic key={topic} name={topic} />)}
        </div>
      </div>
      <div className="Story__content">
        <h2 className="Story__content__title">Grilled Frog Cooking Over Clay</h2>
        <p>Put a frog into a vessel fill with water and start heating the water.
  As the temperature of the water begins to rise…</p>
        <img className="Story__content__image" src="https://placehold.it/520x400" alt="Bangkok" />
      </div>
      <div className="Story__footer">
        <span className="Story__footer__payout">{payoutValue}</span>
        <a className="Story__footer__link" onClick={() => onLikeClick()}>
          <i className="iconfont icon-praise_fill" />
          <span className="Story__footer__number">{likesValue}</span>
        </a>
        <a className="Story__footer__link" onClick={() => onDislikeClick()}>
          <i className="iconfont icon-praise_fill Story__footer__dislike" />
          <span className="Story__footer__number">{dislikesValue}</span>
        </a>
        <a className="Story__footer__link" onClick={() => onCommentClick()}>
          <i className="iconfont icon-message_fill" />
          <span className="Story__footer__number">{commentsValue}</span>
        </a>
        <a className="Story__footer__link" onClick={() => onShareClick()}>
          <i className="iconfont icon-share_fill Story__footer__share" />
          <span className="Story__footer__number">{sharesValue}</span>
        </a>
      </div>
    </div>);
};

Story.propTypes = {
  userFollowed: PropTypes.bool,
  onLikeClick: PropTypes.func,
  onDislikeClick: PropTypes.func,
  onCommentClick: PropTypes.func,
  onShareClick: PropTypes.func,
};

Story.defaultProps = {
  onLikeClick: () => {},
  onDislikeClick: () => {},
  onCommentClick: () => {},
  onShareClick: () => {},
  likes: 0,
  dislikes: 0,
  comments: 0,
  shares: 0,
  payout: 0,
  userFollowed: false,
};

export default Story;
