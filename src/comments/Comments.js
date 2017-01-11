import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import CommentsList from './CommentsList';
import * as commentsActions from './commentsActions';
import Loading from '../widgets/Loading';
import './Comments.scss';

@connect(
  state => ({
    comments: state.comments,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
    showMoreComments: commentsActions.showMoreComments,
    likeComment: id => commentsActions.likeComment(id),
    unlikeComment: id => commentsActions.likeComment(id, 0),
    dislikeComment: id => commentsActions.likeComment(id, -10000),
    openCommentingDraft: commentsActions.openCommentingDraft,
  }, dispatch)
)
export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: 'trending',
    };
  }

  static propTypes = {
    postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    comments: PropTypes.object,
    getComments: PropTypes.func,
    className: PropTypes.string,
  };

  componentDidMount() {
    if (this.props.show) {
      this.props.getComments(this.props.postId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && prevProps.show !== this.props.show) {
      this.props.getComments(this.props.postId);
    }
  }

  handleShowMore = (e) => {
    e.stopPropagation();
    this.props.showMoreComments(this.props.postId);
  };

  handleSortChange = ({ value }) => {
    if (value !== this.state.sortOrder) {
      this.setState({ sortOrder: value });
    }
  };

  render() {
    const { postId, comments, className, show } = this.props;
    if (!show) {
      return null;
    }

    const hasMore = (comments.listByPostId[postId] && comments.listByPostId[postId].hasMore);
    const isFetching = (comments.listByPostId[postId] && comments.listByPostId[postId].isFetching);

    const sortingOptions = [
      { value: 'trending', label: 'Trending' },
      { value: 'votes', label: 'Votes' },
      { value: 'new', label: 'New' }
    ];

    const classNames = className ? `Comments ${className}` : 'Comments';
    return (
      <div className={classNames}>

        { this.props.isSinglePage &&
          <div style={{ width: '200px' }}>
            <span>
              Sort by:
            </span>
            <Select
              value={this.state.sortOrder}
              options={sortingOptions}
              onChange={this.handleSortChange}
              clearable={false}
            />
          </div>
        }

        <CommentsList
          postId={postId}
          comments={comments}
          likeComment={this.props.likeComment}
          unlikeComment={this.props.unlikeComment}
          dislikeComment={this.props.dislikeComment}
          auth={this.props.auth}
          openCommentingDraft={this.props.openCommentingDraft}
          isSinglePage={this.props.isSinglePage}
          sortOrder={this.state.sortOrder}
        />

        {isFetching &&
          <Loading />
        }

        {(hasMore && !this.props.isSinglePage) &&
          <a
            className="Comments__showMore"
            tabIndex="0"
            onClick={this.handleShowMore}
          >
            <FormattedMessage id="see_more_comments" />
          </a>
        }

      </div>
    );
  }
}
