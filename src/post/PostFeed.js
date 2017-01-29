import React, { Component } from 'react';
import steemembed from 'steemembed';
import PostFeedCard from './Feed/PostFeedCard';
import PostFeedList from './Feed/PostFeedList';

const getjsonMetadata = (props) => {
  let jsonMetadata;
  try {
    jsonMetadata = JSON.parse(props.post.json_metadata);
  } catch (e) {
    jsonMetadata = {};
  }
  return jsonMetadata;
};


export default class PostFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
      showLikes: false,
      showPayout: false,
    };
  }

  handleShowCommentsRequest = () => {
    this.setState({
      showComments: !this.state.showComments,
      showLikes: false,
      showPayout: false,
    });
  };

  handleShowLikesRequest = () => {
    this.setState({
      showLikes: !this.state.showLikes,
      showComments: false,
      showPayout: false,
    });
  };

  handleShowPayoutRequest = () => {
    this.setState({
      showLikes: false,
      showComments: false,
      showPayout: !this.state.showPayout,
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
    const jsonMetadata = getjsonMetadata(this.props);
    const imagePath = jsonMetadata.image && jsonMetadata.image[0]
      ? `https://steemitimages.com/600x800/${jsonMetadata.image[0]}`
      : '';
    const embeds = steemembed.getAll(post.body);
    const ItemComponent = (app.layout === 'list')
      ? PostFeedList
      : PostFeedCard;
    return (
      <ItemComponent
        post={post}
        onCommentRequest={onCommentRequest}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        notify={notify}
        jsonMetadata={jsonMetadata}
        imagePath={imagePath}
        embeds={embeds}
        openPostModal={this.props.openPostModal}
        reblog={this.props.reblog}
        isReblogged={this.props.isReblogged}
        showComments={this.state.showComments}
        showLikes={this.state.showLikes}
        showPayout={this.state.showPayout}
        handleShowCommentsRequest={this.handleShowCommentsRequest}
        handleShowLikesRequest={this.handleShowLikesRequest}
        handleShowPayoutRequest={this.handleShowPayoutRequest}
        layout={app.layout}
      />
    );
  }
}

