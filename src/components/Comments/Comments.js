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

  render() {
    const { comments, commentsChildren, onLikeClick, onDislikeClick } = this.props;
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
        <CommentForm />
        {
          comments && sortComments(comments, sort).map(comment =>
            <Comment
              key={comment.id}
              comment={comment}
              commentsChildren={commentsChildren}
              onLikeClick={onLikeClick}
              onDislikeClick={onDislikeClick}
            />
          )
        }
      </div>);
  }
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape()),
  commentsChildren: PropTypes.shape(),
  onLikeClick: PropTypes.func,
  onDislikeClick: PropTypes.func,
};

Comments.defaultProps = {
  count: 0,
  onLikeClick: () => {},
  onDislikeClick: () => {},
};

export default Comments;
