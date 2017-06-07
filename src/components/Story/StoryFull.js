import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import { Menu } from 'antd';
import Lightbox from 'react-image-lightbox';
import Body from '../../post/Body';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import './StoryFull.less';

const SubMenu = Menu.SubMenu;

class StoryFull extends React.Component {
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

  constructor(props) {
    super(props);
    this.state = {
      lightbox: {
        open: false,
        index: 0,
      },
    };
  }

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

    const { open, index } = this.state.lightbox;
    const images = JSON.parse(post.json_metadata).image;

    return (
      <div className="StoryFull">
        <h1 className="StoryFull__title">
          {post.title}
        </h1>
        <div className="StoryFull__header">
          <Avatar username={post.author} size={60} />
          <div className="StoryFull__header__text">
            <Link to={`/${post.author}`}>
              {post.author}
            </Link>
            <span className="StoryFull__header__text__date">
              <FormattedRelative value={`${post.created}Z`} />
            </span>
          </div>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[]}
            className="StoryFull__header__more"
            mode="horizontal"
          >
            <SubMenu className="StoryFull__header__more__item" title={<i className="iconfont icon-more StoryFull__header__more__icon" />}>
              <Menu.Item key="follow"><i className="iconfont icon-people StoryFull__submenu__icon" /> {(!userFollowed) ? 'Follow' : 'Unfollow'} {post.author}</Menu.Item>
              <Menu.Item key="save"><i className="iconfont icon-collection StoryFull__submenu__icon" /> Save post</Menu.Item>
              <Menu.Item key="report"><i className="iconfont icon-flag StoryFull__submenu__icon" /> Report post</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="StoryFull__content" ref={(div) => { this.contentDiv = div; }} onClick={this.onContentClick}>
          <Body body={post.body} json_metadata={post.json_metadata} />
        </div>
        {
          open && <Lightbox
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
            onMovePrevRequest={() => this.setState({
              lightbox: {
                ...this.state.lightbox,
                index: (index + (images.length - 1)) % images.length,
              },
            })}
            onMoveNextRequest={() => this.setState({
              lightbox: {
                ...this.state.lightbox,
                index: (index + (images.length + 1)) % images.length,
              },
            })}
          />
        }
        <StoryFooter
          post={post}
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
