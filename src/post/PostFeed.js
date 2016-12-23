import React, { Component } from 'react';
import { has } from 'lodash/object';
import steemembed from 'steemembed';

import PostFeedCard from './Feed/PostFeedCard';
import PostFeedList from './Feed/PostFeedList';

const getJsonMetaData = (props) => {
  let jsonMetaData;
  try {
    jsonMetaData = JSON.parse(props.post.json_metadata);
  } catch (e) {
    jsonMetaData = {};
  }
  return jsonMetaData;
};


export default class PostFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
      showLikes: false,
    };
  }

  handleShowCommentsRequest = () => {
    this.setState({
      showComments: !this.state.showComments,
      showLikes: false,
    });
  };

  handleShowLikesRequest = () => {
    this.setState({
      showLikes: !this.state.showLikes,
      showComments: false,
    });
  };

  render() {
    const {
      post,
      onCommentRequest,
      app,
      bookmarks,
      toggleBookmark,
      notify
    } = this.props;
    const jsonMetaData = getJsonMetaData(this.props);
    const imageName = has(jsonMetaData, 'image[0]') ? jsonMetaData.image[0] : '';
    const imagePath = imageName
      ? `https://img1.steemit.com/600x400/${imageName}`
      : '';
    const embeds = steemembed.getAll(post.body);
    let ItemComponent = PostFeedCard;
    ItemComponent = (app.layout === 'list') ? PostFeedList : ItemComponent;
    return (
      <ItemComponent
        post={post}
        onCommentRequest={onCommentRequest}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        notify={notify}
        jsonMetaData={jsonMetaData}
        imageName={imageName}
        imagePath={imagePath}
        embeds={embeds}
        openPostModal={this.props.openPostModal}
        reblog={this.props.reblog}
        isReblogged={this.props.isReblogged}
        showComments={this.state.showComments}
        showLikes={this.state.showLikes}
        handleShowCommentsRequest={this.handleShowCommentsRequest}
        handleShowLikesRequest={this.handleShowLikesRequest}
      />
    );
  }
}

