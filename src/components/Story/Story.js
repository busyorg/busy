import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Menu } from 'antd';
import { Link } from 'react-router';
import embedjs from 'embedjs';
import PostFeedEmbed from '../../post/PostFeedEmbed';
import StoryFooter from './StoryFooter';
import BodyShort from '../../post/BodyShort';
import { jsonParse } from '../../helpers/formatter';
import { image } from '../../helpers/steemitLinks';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import {
  getPositions,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf
} from '../../post/Feed/PostFeedCardHelper';
import { getHtml } from '../../post/Body';
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

    const jsonMetadata = jsonParse(this.props.post.json_metadata);
    let imagePath = ''; let bodyImg;
    if (jsonMetadata.image && jsonMetadata.image[0]) {
      imagePath = `https://steemitimages.com/600x800/${jsonMetadata.image[0]}`;
    } else if ((bodyImg = post.body.match(image())) && bodyImg.length) { // eslint-disable-line no-cond-assign
      imagePath = `https://steemitimages.com/600x800/${bodyImg[0]}`;
    }
    const embeds = embedjs.getAll(post.body);

    const preview = {
      text: () => (
        <div key="text" className="Story__body">
          <BodyShort body={post.body} />
        </div>
      ),

      embed: () => (embeds && embeds[0]) && <PostFeedEmbed key="embed" embed={embeds[0]} />,

      image: () => (
        <Link key="image" to={post.url}>
          <img alt="post" key={imagePath} src={imagePath} />
        </Link>
      ),
    };

    const htmlBody = getHtml(post.body, {}, 'text');
    const tagPositions = getPositions(htmlBody);
    const bodyData = [];

    if (isPostStartsWithAPicture(tagPositions)) {
      bodyData.push(preview.image());
      bodyData.push(preview.text());
    } else if (isPostStartsWithAnEmbed(tagPositions)) {
      bodyData.push(preview.embed());
      bodyData.push(preview.text());
    } else if (isPostWithPictureBeforeFirstHalf(tagPositions)) {
      bodyData.push(preview.text());
      bodyData.push(preview.image());
    } else if (isPostWithEmbedBeforeFirstHalf(tagPositions)) {
      bodyData.push(preview.text());
      bodyData.push(preview.embed());
    } else {
      bodyData.push(preview.text());
    }

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
          <Link to={`/@${post.author}`}>
            <Avatar username={post.author} size={40} />
          </Link>
          <div className="Story__header__text">
            <Link to={`/@${post.author}`}>
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
        <div className="Story__content" ref={(div) => { this.contentDiv = div; }} onClick={this.onContentClick}>
          <Link to={post.url}>
            <h2 className="Story__content__title">{post.title}</h2>
          </Link>
          {bodyData}
          <Link to={post.url}>
            Read more
          </Link>
        </div>
        <StoryFooter
          post={post}
          onLikeClick={onLikeClick}
          onDislikeClick={onDislikeClick}
          onCommentClick={onCommentClick}
          onShareClick={onShareClick}
        />
      </div>);
  }
}

export default Story;
