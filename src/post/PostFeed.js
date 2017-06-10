import React, { Component } from "react";
// import embedjs from 'embedjs';
// import { jsonParse } from '../helpers/formatter';
// import { image } from '../helpers/steemitLinks';
// import PostFeedCard from './Feed/PostFeedCard';
// import PostFeedList from './Feed/PostFeedList';
import Story from "../components/Story/Story";

export default class PostFeed extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     showComments: false,
  //     showLikes: false,
  //     showPayout: false
  //   };
  // }

  // handleShowCommentsRequest = () => {
  //   this.setState({
  //     showComments: !this.state.showComments,
  //     showLikes: false,
  //     showPayout: false
  //   });
  // };

  // handleShowLikesRequest = () => {
  //   this.setState({
  //     showLikes: !this.state.showLikes,
  //     showComments: false,
  //     showPayout: false
  //   });
  // };

  // handleShowPayoutRequest = () => {
  //   this.setState({
  //     showLikes: false,
  //     showComments: false,
  //     showPayout: !this.state.showPayout
  //   });
  // };

  render() {
    const { post } = this.props;
    // const { post, onCommentRequest, app, bookmarks, toggleBookmark, notify } = this.props;
    // const jsonMetadata = jsonParse(this.props.post.json_metadata);
    // let imagePath = '';
    // let bodyImg;
    // if (jsonMetadata.image && jsonMetadata.image[0]) {
    //   imagePath = `https://steemitimages.com/600x800/${jsonMetadata.image[0]}`;
    // } else if ((bodyImg = post.body.match(image())) && bodyImg.length) {
    //   // eslint-disable-line no-cond-assign
    //   imagePath = `https://steemitimages.com/600x800/${bodyImg[0]}`;
    // }

    // const embeds = embedjs.getAll(post.body);
    // const ItemComponent = app.layout === 'list' ? PostFeedList : PostFeedCard;
    return post
      ? <div style={{ margin: "1em" }}>
          <Story
            post={post}
            onFollowClick={() => console.log("Follow click")}
            onSaveClick={() => console.log("Save click")}
            onReportClick={() => console.log("Report click")}
            onLikeClick={() => console.log("Like click")}
            onDislikeClick={() => console.log("Dislike click")}
            onCommentClick={() => console.log("Comment click")}
            onShareClick={() => console.log("Share click")}
          />
        </div>
      : <div />;
    // <ItemComponent
    //   post={post}
    //   onCommentRequest={onCommentRequest}
    //   bookmarks={bookmarks}
    //   toggleBookmark={toggleBookmark}
    //   notify={notify}
    //   jsonMetadata={jsonMetadata}
    //   imagePath={imagePath}
    //   embeds={embeds}
    //   reblog={this.props.reblog}
    //   isReblogged={this.props.isReblogged}
    //   showComments={this.state.showComments}
    //   showLikes={this.state.showLikes}
    //   showPayout={this.state.showPayout}
    //   handleShowCommentsRequest={this.handleShowCommentsRequest}
    //   handleShowLikesRequest={this.handleShowLikesRequest}
    //   handleShowPayoutRequest={this.handleShowPayoutRequest}
    //   layout={app.layout}
    //   openPostModal={this.props.openPostModal}
    // />
  }
}
