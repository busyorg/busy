import React, { PropTypes } from 'react';
import _ from 'lodash';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Link } from 'react-router-dom';
import { Popover, Tooltip } from 'antd';
import Lightbox from 'react-image-lightbox';
import Body from './Body';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './StoryFull.less';

class StoryFull extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
    pendingFollow: PropTypes.bool,
    commentCount: PropTypes.number,
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    onShareClick: PropTypes.func,
  };

  static defaultProps = {
    pendingFollow: false,
    commentCount: 0,
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onCommentClick: () => {},
    onShareClick: () => {},
    postState: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      lightbox: {
        open: false,
        index: 0,
      },
    };
  }

  componentDidMount() {
    document.body.classList.add('white-bg');
  }

  componentWillUnmount() {
    document.body.classList.remove('white-bg');
  }

  handleClick = (key) => {
    switch (key) {
      case 'follow':
        this.props.onFollowClick(this.props.post);
        return;
      case 'save':
        this.props.onSaveClick();
        return;
      case 'report':
        this.props.onReportClick();
        break;
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
              index: i,
            },
          });
        }
      }
    }
  };

  render() {
    const {
      post,
      postState,
      pendingFollow,
      commentCount,
      onLikeClick,
      onCommentClick,
      onShareClick,
    } = this.props;

    const { open, index } = this.state.lightbox;
    const images = JSON.parse(post.json_metadata).image;
    const tags = _.union(JSON.parse(post.json_metadata).tags, [post.category]);

    let followText = '';

    if (postState.userFollowed && !pendingFollow) {
      followText = 'Unfollow';
    } else if (postState.userFollowed && pendingFollow) {
      followText = 'Unfollowing';
    } else if (!postState.userFollowed && !pendingFollow) {
      followText = 'Follow';
    } else if (!postState.userFollowed && pendingFollow) {
      followText = 'Following';
    }

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
            <Tooltip
              placement="bottom"
              title={
                <span>
                  <FormattedDate value={`${post.created}Z`} />
                  {' '}
                  <FormattedTime value={`${post.created}Z`} />
                </span>
              }
            >
              <span className="StoryFull__header__text__date">
                <FormattedRelative value={`${post.created}Z`} />
              </span>
            </Tooltip>
          </div>
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <PopoverMenu onSelect={this.handleClick} bold={false}>
                <PopoverMenuItem key="follow" disabled={pendingFollow}>
                  <i className="iconfont icon-people" />
                  {`${followText} ${post.author}`}
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
                  open: false,
                },
              });
            }}
            onMovePrevRequest={() =>
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  index: (index + (images.length - 1)) % images.length,
                },
              })}
            onMoveNextRequest={() =>
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  index: (index + (images.length + 1)) % images.length,
                },
              })}
          />}
        <div className="StoryFull__topics">
          {tags && tags.map(tag => <Topic key={tag} name={tag} />)}
        </div>
        <StoryFooter
          post={post}
          postState={postState}
          onLikeClick={onLikeClick}
          onCommentClick={onCommentClick}
          onShareClick={onShareClick}
        />
      </div>
    );
  }
}

export default StoryFull;
