import React, { PropTypes } from 'react';
import _ from 'lodash';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';
import Lightbox from 'react-image-lightbox';
import Body from './Body';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './StoryFull.less';

class StoryFull extends React.Component {
  static propTypes = {
    post: PropTypes.shape(),
    commentCount: PropTypes.number,
    userFollowed: PropTypes.bool,
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    onShareClick: PropTypes.func
  };

  static defaultProps = {
    commentCount: 0,
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onCommentClick: () => {},
    onShareClick: () => {},
    userFollowed: false,
    postState: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      lightbox: {
        open: false,
        index: 0
      }
    };
  }

  handleClick = (key) => {
    switch (key) {
      case 'follow':
        this.props.onFollowClick();
        return;
      case 'save':
        this.props.onSaveClick();
        return;
      case 'report':
        this.props.onReportClick();

      default:
    }
  };

  onContentClick = (e) => {
    if (e.target.tagName === 'IMG') {
      const tags = this.contentDiv.getElementsByTagName('img');
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] === e.target) {
          this.setState({
            lightbox: {
              open: true,
              index: i
            }
          });
        }
      }
    }
  };

  render() {
    const {
      post,
      postState,
      commentCount,
      userFollowed,
      onLikeClick,
      onDislikeClick,
      onCommentClick,
      onShareClick
    } = this.props;

    const { open, index } = this.state.lightbox;
    const images = JSON.parse(post.json_metadata).image;
    const tags = _.union(JSON.parse(post.json_metadata).tags, [post.category]);

    return (
      <div className="StoryFull">
        <h1 className="StoryFull__title">
          {post.title}
        </h1>
        <h3 className="StoryFull__comments_title">{commentCount} Comments</h3>
        <div className="StoryFull__header">
          <Link to={`/@${post.author}`}>
            <Avatar username={post.author} size={60} />
          </Link>
          <div className="StoryFull__header__text">
            <Link to={`/@${post.author}`}>
              {post.author}
            </Link>
            <span className="StoryFull__header__text__date">
              <FormattedRelative value={`${post.created}Z`} />
            </span>
          </div>
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <PopoverMenu onSelect={this.handleClick}>
                <PopoverMenuItem key="follow">
                  <i className="iconfont icon-people" /> {!userFollowed ? 'Follow' : 'Unfollow'}
                  {' '}{post.author}
                </PopoverMenuItem>
                <PopoverMenuItem key="save">
                  <i className="iconfont icon-collection" /> Save post
                </PopoverMenuItem>
                <PopoverMenuItem key="report">
                  <i className="iconfont icon-flag" /> Report post
                </PopoverMenuItem>
              </PopoverMenu>
            }
          >
            <i className="iconfont icon-more StoryFull__header__more" />
          </Popover>
        </div>
        <div
          className="StoryFull__content"
          ref={(div) => {
            this.contentDiv = div;
          }}
          onClick={this.onContentClick}
        >
          <Body body={post.body} json_metadata={post.json_metadata} />
        </div>
        {open &&
          <Lightbox
            mainSrc={images[index]}
            nextSrc={images[(index + 1) % images.length]}
            prevSrc={images[(index + (images.length - 1)) % images.length]}
            onCloseRequest={() => {
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  open: false
                }
              });
            }}
            onMovePrevRequest={() =>
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  index: (index + (images.length - 1)) % images.length
                }
              })}
            onMoveNextRequest={() =>
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  index: (index + (images.length + 1)) % images.length
                }
              })}
          />}
        <div className="StoryFull__topics">
          {tags && tags.map((tag, i) => <Topic key={i} name={tag} />)}
        </div>
        <StoryFooter
          post={post}
          postState={postState}
          onLikeClick={onLikeClick}
          onDislikeClick={onDislikeClick}
          onCommentClick={onCommentClick}
          onShareClick={onShareClick}
        />
      </div>
    );
  }
}

export default StoryFull;
