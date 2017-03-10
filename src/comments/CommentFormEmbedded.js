import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { isSmall } from 'react-responsive-utils';
import _ from 'lodash';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import Icon from '../widgets/Icon';
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
    sendComment: (depth, parentId) => commentActions.sendComment(depth, parentId),
    updateCommentingDraft: commentActions.updateCommentingDraft,
  }, dispatch)
)
export default class CommentFormEmbedded extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftValue: '',
    };
  }

  static PropTypes = {
    parentId: React.PropTypes.string.isRequired,
    isReplyToComment: React.PropTypes.bool,
  };

  static defaultProps = {
    isReplyToComment: false,
  };

  componentDidMount() {
    const { parentId, posts, comments, isReplyToComment, isEditing } = this.props;
    const content = isReplyToComment ? comments.comments[parentId] : posts[parentId];
    let payload;

    if (isEditing) {
      payload = {
        id: parentId,
        parentAuthor: content.parent_author,
        category: content.category,
        permlink: content.permlink,
        parentPermlink: content.parent_permlink,
        isReplyToComment: true,
        isEditing: true,
        body: content.body,
      };
    } else {
      payload = {
        id: parentId,
        body: '',
        parentAuthor: content.author,
        parentPermlink: content.permlink,
        category: content.category,
        isReplyToComment,
      };
    }

    this.props.updateCommentingDraft(payload);
    this.loadDraft();
  }

  componentWillReceiveProps(nextProps) {
    const { parentId, comments } = nextProps;
    const draftValue =
      (comments.commentingDraft[parentId] && comments.commentingDraft[parentId].body);

    this.setState({ draftValue });
  }

  updateDraft = _.debounce(() => {
    this.props.updateCommentingDraft({
      id: this.props.parentId,
      body: this.state.draftValue,
    });
  }, 1000);

  loadDraft() {
    const { parentId, comments } = this.props;
    const draftValue =
      (comments.commentingDraft[parentId] && comments.commentingDraft[parentId].body);

    this.setState({ draftValue });
  }

  handleSubmit(e, commentDepth) {
    e.stopPropagation();
    this.updateDraft();
    this.props.sendComment(commentDepth, this.props.parentId).then(() => {
      this.setState({ draftValue: '' });
      if (_.isFunction(this.props.onSubmit)) this.props.onSubmit();
    });
  }

  handleTextChange = (e) => {
    this.setState({ draftValue: e.target.value });
    this.updateDraft();
  };

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

    return (
      <div className={commentsClass}>
        <div className="container">

          <div className="my-2">
            <i className="icon icon-sm material-icons">reply</i>
            {' '}<FormattedMessage id="reply_to" />{' '}
            <b>{parentTitle}</b>
          </div>

          <Textarea
            className="CommentForm__input my-2 p-2"
            placeholder={'Write a comment...'}
            value={this.state.draftValue}
            onChange={this.handleTextChange}
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
