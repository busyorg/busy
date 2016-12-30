import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import numeral from 'numeral';
import LikeButton from './actionButtons/LikeButton';
import PayoutLabel from './actionButtons/PayoutLabel';
import * as postActions from './postActions';
import Icon from '../widgets/Icon';
import ReblogButton from './actionButtons/ReblogButton';

@connect(
  state => ({
    auth: state.auth,
  }),
  (dispatch, ownProps) => bindActionCreators({
    likePost: () => postActions.votePost(ownProps.post.id),
    unlikePost: () => postActions.votePost(ownProps.post.id, 0),
    dislikePost: () => postActions.votePost(ownProps.post.id, -1000),
  }, dispatch)
)
export default class PostActionButtons extends Component {
  constructor(props) {
    super(props);
  }

  handleCommentBoxClick(e) {
    e.stopPropagation();
    if (!this.props.auth.isAuthenticated) {
      this.props.notify('You need to login in order to write comments.');
      return;
    }

    const { id, category, author, permlink } = this.props.post;
    this.props.onCommentRequest({
      parentAuthor: author,
      parentPermlink: permlink,
      category,
      id,
    });
  }

  handleCommentsTextClick(e) {
    e.stopPropagation();
    this.props.onShowCommentsRequest();
  }

  handleLikesTextClick(e) {
    e.stopPropagation();
    this.props.onShowLikesRequest();
  }

  handleReblog() {
    const { auth, post, reblog, notify } = this.props;

    if (!auth.isAuthenticated) {
      notify('You need to login in order to reblog posts.');
      return;
    }
    reblog(post.id);
  }

  render() {
    const { post, auth, layout } = this.props;
    const payout = parseFloat(post.total_payout_value)
      + parseFloat(post.total_pending_payout_value);
    const isPostLiked =
      auth.isAuthenticated &&
      post.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);
    const isCardLayout = layout === 'card';
    const isListLayout = layout === 'list';

    return (
      <ul>
        <li>
          <LikeButton
            onClick={isPostLiked ? this.props.unlikePost : this.props.likePost}
            onTextClick={e => this.handleLikesTextClick(e)}
            active={isPostLiked}
            numberOfVotes={numeral(post.net_votes).format('0,0')}
            layout={layout}
          />
        </li>
        <li>
          <PayoutLabel
            value={numeral(payout).format('$0,0.00')}
          />
        </li>

        <li>
          <a onClick={e => this.handleCommentBoxClick(e)}>
            <Icon name="reply" sm />
          </a>
          { ' ' }

          { (post.children && isCardLayout) &&
            <a onClick={e => this.handleCommentsTextClick(e)}>
              {numeral(post.children).format('0,0')}
                <span className="hidden-xs"> Comment
                  { post.children > 1 && 's' }
                </span>
            </a>
          }

          { (!post.children && isCardLayout) &&
            <span className="hidden-xs">0 Comment</span>
          }

          { isListLayout &&
            <span>
              { numeral(post.children).format('0,0') }
            </span>
          }

        </li>

        <li>
          <ReblogButton
            onClick={() => this.handleReblog()}
            active={this.props.isReblogged}
            layout={layout}
          />
        </li>
      </ul>
    );
  }
}
