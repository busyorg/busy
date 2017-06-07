import React, { PropTypes } from 'react';
import numeral from 'numeral';
import { FormattedRelative } from 'react-intl';
import { Menu } from 'antd';
import { Link } from 'react-router';
import Body from '../post/Body';
import Avatar from './Avatar';
import Topic from './Button/Topic';
import './Story.less';

const SubMenu = Menu.SubMenu;

class Story extends React.Component {
  static propTypes = {
    post: PropTypes.shape(),
    userFollowed: PropTypes.bool,
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    onShareClick: PropTypes.func,
  };

  static defaultProps = {
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onCommentClick: () => {},
    onShareClick: () => {},
    userFollowed: false,
  };

  handleClick = (e) => {
    switch (e.key) {
      case 'follow':
        this.props.onFollowClick();
        return;
      case 'save':
        this.props.onSaveClick();
        return;
      case 'report':
        this.props.onReportClick();
        return;
      default:
        return;
    }
  }

  render() {
    const {
      post,
      userFollowed,
      onLikeClick,
      onDislikeClick,
      onCommentClick,
      onShareClick
    } = this.props;

    const payout = parseFloat(post.pending_payout_value) || parseFloat(post.total_payout_value);
    const payoutValue = numeral(payout).format('$0,0.00');
    const likesValue = numeral(post.active_votes.filter(vote => vote.percent > 0).length).format('0,0');
    const dislikesValue = numeral(post.active_votes.filter(vote => vote.percent < 0).length).format('0,0');
    const commentsValue = numeral(post.children).format('0,0');
    const sharesValue = 0;

    return (
      <div className="Story">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[]}
          className="Story__more"
          mode="horizontal"
        >
          <SubMenu className="Story__more__item" title={<i className="iconfont icon-unfold Story__more__icon" />}>
            <Menu.Item key="follow"><i className="iconfont icon-people Story__submenu__icon" /> {(!userFollowed) ? 'Follow' : 'Unfollow'} {post.author}</Menu.Item>
            <Menu.Item key="save"><i className="iconfont icon-collection Story__submenu__icon" /> Save post</Menu.Item>
            <Menu.Item key="report"><i className="iconfont icon-flag Story__submenu__icon" /> Report post</Menu.Item>
          </SubMenu>
        </Menu>
        <div className="Story__header">
          <Avatar username={post.author} size={40} />
          <div className="Story__header__text">
            <Link to={`/${post.author}`}>
              <h4>{post.author}</h4>
            </Link>
            <span className="Story__date">
              <FormattedRelative value={`${post.created}Z`} />
            </span>
          </div>
          <div className="Story__topics">
            <Topic name={post.category} />
          </div>
        </div>
        <div className="Story__content">
          <h2 className="Story__content__title">{post.title}</h2>
          <Body body={post.body} json_metadata={post.json_metadata} />
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
  }
}

export default Story;
