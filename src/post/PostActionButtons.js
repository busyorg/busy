import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
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
    likePost: votePower => postActions.votePost(ownProps.post.id, votePower),
    unlikePost: () => postActions.votePost(ownProps.post.id, 0),
    dislikePost: () => postActions.votePost(ownProps.post.id, -1000),
  }, dispatch)
)
@injectIntl
export default class PostActionButtons extends Component {
  constructor(props) {
    super(props);
  }

  handleCommentBoxClick(e) {
    e.stopPropagation();
    if (!this.props.auth.isAuthenticated) {
      const msg = this.props.intl.formatMessage({
        id: '@post/need_login',
        defaultMessage: 'You need to login in order to write comments.',
      });
      this.props.notify(msg);
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
      const msg = this.props.intl.formatMessage({
        id: '@post/login_to_reblog',
        defaultMessage: 'You need to login in order to reblog posts.',
      });
      notify(msg);
      return;
    }
    reblog(post.id);
  }

  render() {
    const { post, auth, layout } = this.props;

    const isPostLiked =
      auth.isAuthenticated &&
      post.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);
    const canReblog = auth.isAuthenticated && auth.user.name !== post.author;
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
            onClick={() => { this.props.onShowPayoutRequest(); }}
            post={post}
          />
        </li>
        <li>
          <a onClick={e => this.handleCommentBoxClick(e)}>
            <Icon name="reply" sm />
            {isCardLayout &&
              <span className="hidden-xs"> <FormattedMessage id="comment" defaultMessage="Comment" /></span>
            }
          </a>
          {isListLayout &&
            <span> {numeral(post.children).format('0,0')}</span>
          }
        </li>
        {canReblog &&
          <li>
            <ReblogButton
              onClick={() => this.handleReblog()}
              active={this.props.isReblogged}
              layout={layout}
            />
          </li>
        }
      </ul>
    );
  }
}
