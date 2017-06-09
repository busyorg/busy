import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Comment from './Comment';
import './Comments.less';

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
    const { comments, commentsChildren } = this.props;
    
    return (
      <div className="Comments">
        <div className="Comments__sort" onClick={this.handleSortClick}>
          <a className={classNames({ active: this.state.sort === 'BEST' })} data-type="BEST">Best</a>
          <a className={classNames({ active: this.state.sort === 'TRENDING' })} data-type="TRENDING">Trending</a>
          <a className={classNames({ active: this.state.sort === 'NEWEST' })} data-type="NEWEST">Newest</a>
        </div>
        {
          comments && comments.map(comment =>
            <Comment key={comment.id} comment={comment} commentsChildren={commentsChildren} />
          )
        }
      </div>);
  }
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape()),
  commentsChildren: PropTypes.shape(),
};

export default Comments;
