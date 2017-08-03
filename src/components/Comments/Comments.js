import React, { PropTypes } from 'react';
import classNames from 'classnames';
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

  submitComment = (parentPost, commentValue) => {
    this.setState({ showCommentFormLoading: true });
    this.props.onSendComment(parentPost, commentValue)
      .then(() => {
        this.setState({ showCommentFormLoading: false, commentFormText: '' });
      })
      .catch(() => {
        this.setState({
          showCommentFormLoading: false,
          commentFormText: commentValue,
        });
      });
  }

  render() {
    const { comments, commentsChildren, onLikeClick, onDislikeClick, auth } = this.props;
    const { sort } = this.state;

    return (
      <div className="Comments">
        <div className="Comments__header">
          <h2>
            Comments
          </h2>
          <div className="Comments__header__sort" onClick={this.handleSortClick}>
            <a className={classNames({ active: sort === 'BEST' })} data-type="BEST">Best</a>
            <a className={classNames({ active: sort === 'NEWEST' })} data-type="NEWEST">Newest</a>
            <a className={classNames({ active: sort === 'OLDEST' })} data-type="OLDEST">Oldest</a>
          </div>
        </div>

        {auth && auth.isAuthenticated &&
          <CommentForm
            parentPost={this.props.parentPost}
            username={auth.user.name}
            onSubmit={this.submitComment}
            isLoading={this.state.showCommentFormLoading}
            inputValue={this.state.commentFormText}
          />
        }
        {
          comments && sortComments(comments, sort).map(comment => (
            <Comment
              auth={auth}
              key={comment.id}
              comment={comment}
              commentsChildren={commentsChildren}
              onLikeClick={onLikeClick}
              onDislikeClick={onDislikeClick}
              onSendComment={this.props.onSendComment}
            />))
        }
      </div>);
  }
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape()),
  commentsChildren: PropTypes.shape(),
  onLikeClick: PropTypes.func,
  onDislikeClick: PropTypes.func,
  auth: PropTypes.shape(),
};

Comments.defaultProps = {
  comments: [],
  commentsChildren: undefined,
  onLikeClick: () => {},
  onDislikeClick: () => {},
  auth: undefined,
};

export default Comments;
