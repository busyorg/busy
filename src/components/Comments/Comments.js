import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loading from '../Icon/Loading';
import CommentForm from './CommentForm';
import Comment from './Comment';
import './Comments.less';

const sortComments = (comments, sortType = 'BEST') => {
  const sortedComments = [...comments];

  switch (sortType) {
    case 'BEST':
      return sortedComments.sort((a, b) => a.net_votes - b.net_votes).reverse();
    case 'NEWEST':
      return sortedComments.sort((a, b) => Date.parse(a.created) - Date.parse(b.created)).reverse();
    case 'OLDEST':
      return sortedComments.sort((a, b) => Date.parse(a.created) - Date.parse(b.created));
    default:
      return sortedComments;
  }
};

class Comments extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    parentPost: PropTypes.shape(),
    comments: PropTypes.arrayOf(PropTypes.shape()),
    commentsChildren: PropTypes.shape(),
    loading: PropTypes.bool,
    show: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onSendComment: PropTypes.func,
  };

  static defaultProps = {
    parentPost: undefined,
    comments: [],
    commentsChildren: undefined,
    loading: false,
    show: false,
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
    };
  }

  handleSortClick = (e) => {
    const type = e.target.dataset.type;
    if (type) {
      this.setState({
        sort: type,
      });
    }
  };

  handleImageInserted = (blob, callback, errorCallback) => {
    const { authenticated, user } = this.props;
    if (!authenticated) return;

    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${user.name}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => errorCallback());
  };

  submitComment = (parentPost, commentValue) => {
    this.setState({ showCommentFormLoading: true });
    this.props
      .onSendComment(parentPost, commentValue)
      .then(() => {
        this.setState({ showCommentFormLoading: false, commentFormText: '' });
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
      comments,
      loading,
      show,
      commentsChildren,
      onLikeClick,
      onDislikeClick,
      authenticated,
      user,
    } = this.props;
    const { sort } = this.state;

    return (
      <div className="Comments">
        <div className="Comments__header">
          <h2>Comments</h2>
          <div
            role="presentation"
            className="Comments__header__sort"
            onClick={this.handleSortClick}
          >
            <a className={classNames({ active: sort === 'BEST' })} data-type="BEST">
              Best
            </a>
            <a className={classNames({ active: sort === 'NEWEST' })} data-type="NEWEST">
              Newest
            </a>
            <a className={classNames({ active: sort === 'OLDEST' })} data-type="OLDEST">
              Oldest
            </a>
          </div>
        </div>

        {authenticated &&
          <CommentForm
            parentPost={this.props.parentPost}
            username={user.name}
            onSubmit={this.submitComment}
            isLoading={this.state.showCommentFormLoading}
            inputValue={this.state.commentFormText}
            onImageInserted={this.handleImageInserted}
          />}
        {loading && <Loading />}
        {!loading &&
          show &&
          comments &&
          sortComments(comments, sort).map(comment =>
            (<Comment
              authenticated={authenticated}
              user={user}
              key={comment.id}
              comment={comment}
              rootPostAuthor={this.props.parentPost && this.props.parentPost.author}
              commentsChildren={commentsChildren}
              onLikeClick={onLikeClick}
              onDislikeClick={onDislikeClick}
              onSendComment={this.props.onSendComment}
            />),
          )}
      </div>
    );
  }
}

export default Comments;
