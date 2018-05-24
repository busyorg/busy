import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { message } from 'antd';
import { MAXIMUM_UPLOAD_SIZE_HUMAN } from '../../helpers/image';
import { sortComments } from '../../helpers/sortHelpers';
import Loading from '../Icon/Loading';
import SortSelector from '../SortSelector/SortSelector';
import CommentForm from './CommentForm';
import Comment from './Comment';
import './Comments.less';
import MoreCommentsButton from './MoreCommentsButton';
import { findTopComment, getLinkedComment } from '../../helpers/commentHelpers';

@injectIntl
class Comments extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    parentPost: PropTypes.shape(),
    comments: PropTypes.shape(),
    rootLevelComments: PropTypes.arrayOf(PropTypes.shape()),
    commentsChildren: PropTypes.shape(),
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        percent: PropTypes.number,
      }),
    ),
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    rewriteLinks: PropTypes.bool,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    loading: PropTypes.bool,
    show: PropTypes.bool,
    notify: PropTypes.func,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onSendComment: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    parentPost: undefined,
    comments: {},
    rootLevelComments: [],
    commentsChildren: undefined,
    pendingVotes: [],
    rewriteLinks: false,
    sliderMode: 'auto',
    loading: false,
    show: false,
    notify: () => {},
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onSendComment: () => {},
  };

  static SHOW_COMMENTS_INCREMENT = 20;

  constructor(props) {
    super(props);

    this.state = {
      sort: 'BEST',
      showCommentFormLoading: false,
      commentFormText: '',
      commentSubmitted: false,
      nRenderedComments: 20,
    };

    this.detectSort = this.detectSort.bind(this);
    this.setSort = this.setSort.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.handleShowMoreComments = this.handleShowMoreComments.bind(this);
  }

  componentDidMount() {
    this.detectSort(this.props.comments);
  }

  componentWillReceiveProps(nextProps) {
    this.detectSort(nextProps.comments);
  }

  setSort(sort) {
    this.setState({
      sort,
    });
  }

  detectSort(comments) {
    if (
      comments.length > 0 &&
      comments.filter(comment => comment.active_votes.length > 0).length === 0
    ) {
      this.setSort('OLDEST');
    }
  }

  handleSortChange(type) {
    this.setSort(type);
  }

  handleShowMoreComments() {
    this.setState(prevState => ({
      nRenderedComments: prevState.nRenderedComments + Comments.SHOW_COMMENTS_INCREMENT,
    }));
  }

  handleImageInserted = (blob, callback, errorCallback) => {
    const { authenticated, username } = this.props;
    if (!authenticated) return;

    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${username}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => errorCallback());
  };

  handleImageInvalid = () => {
    const { formatMessage } = this.props.intl;
    this.props.notify(
      formatMessage(
        {
          id: 'notify_uploading_image_invalid',
          defaultMessage:
            'This file is invalid. Only image files with maximum size of {size} are supported',
        },
        { size: MAXIMUM_UPLOAD_SIZE_HUMAN },
      ),
      'error',
    );
  };

  handleSubmitComment(parentPost, commentValue) {
    const { intl } = this.props;

    this.setState({ showCommentFormLoading: true });
    return this.props
      .onSendComment(parentPost, commentValue)
      .then(() => {
        message.success(
          intl.formatMessage({
            id: 'notify_comment_sent',
            defaultMessage: 'Comment submitted',
          }),
        );

        this.setState({
          showCommentFormLoading: false,
          commentFormText: '',
          commentSubmitted: true,
        });
      })
      .catch(() => {
        this.setState({
          showCommentFormLoading: false,
          commentFormText: commentValue,
        });
        return {
          error: true,
        };
      });
  }

  commentsToRender(rootLevelComments, rootLinkedComment) {
    const { nRenderedComments, sort } = this.state;

    const filteredComments = sortComments(rootLevelComments, sort)
      .filter(comment => comment.id !== (rootLinkedComment && rootLinkedComment.id))
      .slice(
        0,
        rootLinkedComment
          ? nRenderedComments - Comments.SHOW_COMMENTS_INCREMENT
          : nRenderedComments,
      );
    return rootLinkedComment ? [rootLinkedComment, ...filteredComments] : filteredComments;
  }

  render() {
    const {
      user,
      parentPost,
      comments,
      rootLevelComments,
      commentsChildren,
      loading,
      show,
      pendingVotes,
      onLikeClick,
      onDislikeClick,
      authenticated,
      username,
      sliderMode,
      rewardFund,
      defaultVotePercent,
      rewriteLinks,
    } = this.props;
    const { sort } = this.state;

    const linkedComment = getLinkedComment(comments);
    const rootLinkedComment = findTopComment(parentPost, comments, linkedComment);
    const commentsToRender = this.commentsToRender(rootLevelComments, rootLinkedComment);

    return (
      <div className="Comments">
        <div className="Comments__header">
          <h2>
            <FormattedMessage id="comments" defaultMessage="Comments" />
          </h2>
          <SortSelector sort={sort} onChange={this.handleSortChange}>
            <SortSelector.Item key="BEST">
              <FormattedMessage id="sort_best" defaultMessage="Best" />
            </SortSelector.Item>
            <SortSelector.Item key="NEWEST">
              <FormattedMessage id="sort_newest" defaultMessage="Newest" />
            </SortSelector.Item>
            <SortSelector.Item key="OLDEST">
              <FormattedMessage id="sort_oldest" defaultMessage="Oldest" />
            </SortSelector.Item>
            <SortSelector.Item key="AUTHOR_REPUTATION">
              <FormattedMessage id="sort_author_reputation" defaultMessage="Reputation" />
            </SortSelector.Item>
          </SortSelector>
        </div>

        {authenticated && (
          <CommentForm
            top
            parentPost={this.props.parentPost}
            username={username}
            onSubmit={this.handleSubmitComment}
            isLoading={this.state.showCommentFormLoading}
            inputValue={this.state.commentFormText}
            submitted={this.state.commentSubmitted}
            onImageInserted={this.handleImageInserted}
            onImageInvalid={this.handleImageInvalid}
          />
        )}
        {loading && <Loading />}
        {parentPost.children === 0 && (
          <div className="Comments__empty">
            <FormattedMessage id="empty_comments" defaultMessage="There are no comments yet." />
          </div>
        )}
        {!loading &&
          show &&
          comments &&
          commentsToRender.map(comment => (
            <Comment
              key={comment.id}
              user={user}
              depth={0}
              authenticated={authenticated}
              username={username}
              comment={comment}
              parent={this.props.parentPost}
              sort={sort}
              rootPostAuthor={this.props.parentPost && this.props.parentPost.author}
              commentsChildren={commentsChildren}
              pendingVotes={pendingVotes}
              notify={this.props.notify}
              rewardFund={rewardFund}
              sliderMode={sliderMode}
              defaultVotePercent={defaultVotePercent}
              rewriteLinks={rewriteLinks}
              onLikeClick={onLikeClick}
              onDislikeClick={onDislikeClick}
              onSendComment={this.props.onSendComment}
            />
          ))}
        <MoreCommentsButton
          comments={rootLevelComments.length}
          visibleComments={commentsToRender.length}
          onClick={this.handleShowMoreComments}
        />
      </div>
    );
  }
}

export default Comments;
