import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { isSmall } from 'react-responsive-utils';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';
import * as commentActions from './commentsActions';
import './CommentForm.scss';

@withRouter
@connect(
  state => ({
    comments: state.comments,
    posts: state.posts,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    sendComment: depth => commentActions.sendComment(depth),
    updateCommentingDraft: commentActions.updateCommentingDraft,
  }, dispatch)
)
export default class CommentFormEmbedded extends Component {
  constructor(props) {
    super(props);
  }

  static PropTypes = {
    parentId: React.PropTypes.string.isRequired,
    isReplayToComment: React.PropTypes.bool,
  };

  static defaultProps = {
    isReplayToComment: false,
  };

  updateDraft() {
    this.props.updateCommentingDraft({
      id: this.props.parentId,
      body: this._input.value,
    });
  }

  handleSubmit(e, commentDepth) {
    e.stopPropagation();
    this.updateDraft();
    this.props.sendComment(commentDepth);
  }

  componentWillUnmount() {
    this.updateDraft();
  }

  render() {
    const { comments, posts, isReplyToComment, parentId } = this.props;

    const commentsClass = classNames({
      CommentForm: true,
      'CommentForm--embedded': true,
      'py-1': true,
      mobile: isSmall(),
    });

    let parentTitle = '';
    // will need depth in optimistic payload since it's used to style nested comments
    let commentDepth;
    const commentsData = comments.comments;

    if (isReplyToComment) {
      const replyingComment = commentsData[parentId];
      parentTitle = `${replyingComment.author} in ${replyingComment.root_title}`;
      commentDepth = commentsData[parentId].depth + 1;
    } else {
      parentTitle = posts[parentId].title;
      commentDepth = 1;
    }

    const draftValue =
      comments.commentingDraft[parentId] &&
      comments.commentingDraft[parentId].body || '';

    return (
      <div className={commentsClass}>
        <div className="container">

          <div className="my-2">
            <i className="icon icon-sm material-icons">reply</i>
            {' '}<FormattedMessage id="reply_to" />{' '}
            <b>{parentTitle}</b>
          </div>

          <Textarea
            ref={(c) => { this._input = c; }}
            className="CommentForm__input my-2 p-2"
            onKeyDown={e => this.handleKey(e)}
            placeholder={'Write a comment...'}
            defaultValue={draftValue}
          />
          <button
            onClick={e => this.handleSubmit(e, commentDepth)}
            className="btn btn-success CommentForm__submit"
          >
            <Icon name="send" />
          </button>
        </div>
      </div>
    );
  }
}
