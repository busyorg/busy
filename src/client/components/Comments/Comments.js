import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { MAXIMUM_UPLOAD_SIZE_HUMAN } from '../../helpers/image';
import { sortComments } from '../../helpers/sortHelpers';
import Loading from '../Icon/Loading';
import CommentForm from './CommentForm';
import Comment from './Comment';
import './Comments.less';

@injectIntl
class Comments extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    parentPost: PropTypes.shape(),
    comments: PropTypes.arrayOf(PropTypes.shape()),
    commentsChildren: PropTypes.shape(),
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        percent: PropTypes.number,
      }),
    ),
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
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
    comments: [],
    commentsChildren: undefined,
    pendingVotes: [],
    sliderMode: 'auto',
    loading: false,
    show: false,
    notify: () => {},
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onSendComment: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      sort: 'BEST',
      showCommentFormLoading: false,
      commentFormText: '',
      commentSubmitted: false,
    };
  }

  handleSortClick = (e) => {
    const type = e.target.parentNode && e.target.parentNode.dataset.type;
    if (type) {
      this.setState({
        sort: type,
      });
    }
  };

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

  submitComment = (parentPost, commentValue) => {
    this.setState({ showCommentFormLoading: true });
    this.props
      .onSendComment(parentPost, commentValue)
      .then(() => {
        this.setState({ showCommentFormLoading: false, commentFormText: '', commentSubmitted: true });
      })
      .catch(() => {
        this.setState({
          showCommentFormLoading: false,
          commentFormText: commentValue,
        });
      });
  };

  render() {
    const {
      user,
      comments,
      loading,
      show,
      commentsChildren,
      pendingVotes,
      onLikeClick,
      onDislikeClick,
      authenticated,
      username,
      sliderMode,
      rewardFund,
      defaultVotePercent,
    } = this.props;
    const { sort } = this.state;

    return (
      <div className="Comments">
        <div className="Comments__header">
          <h2>
            <FormattedMessage id="comments" defaultMessage="Comments" />
          </h2>
          <div
            role="presentation"
            className="Comments__header__sort"
            onClick={this.handleSortClick}
          >
            <a className={classNames({ active: sort === 'BEST' })} data-type="BEST">
              <FormattedMessage id="sort_best" defaultMessage="Best" />
            </a>
            <a className={classNames({ active: sort === 'NEWEST' })} data-type="NEWEST">
              <FormattedMessage id="sort_newest" defaultMessage="Newest" />
            </a>
            <a className={classNames({ active: sort === 'OLDEST' })} data-type="OLDEST">
              <FormattedMessage id="sort_oldest" defaultMessage="Oldest" />
            </a>
          </div>
        </div>

        {authenticated && (
          <CommentForm
            parentPost={this.props.parentPost}
            username={username}
            onSubmit={this.submitComment}
            isLoading={this.state.showCommentFormLoading}
            inputValue={this.state.commentFormText}
            submitted={this.state.commentSubmitted}
            onImageInserted={this.handleImageInserted}
            onImageInvalid={this.handleImageInvalid}
          />)}
        {loading && <Loading />}
        {!loading &&
          show &&
          comments &&
          sortComments(comments, sort).map(comment => (
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
              onLikeClick={onLikeClick}
              onDislikeClick={onDislikeClick}
              onSendComment={this.props.onSendComment}
            />
          ))}
      </div>
    );
  }
}

export default Comments;
