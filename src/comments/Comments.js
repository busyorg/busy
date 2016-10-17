import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommentsList from './CommentsList';
import * as commentsActions from './commentsActions';
import { getCommentsFromState } from './../helpers/stateHelpers';

@connect(
  state => ({
    comments: state.comments,
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
  }, dispatch)
)
export default class Comments extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    postId: React.PropTypes.string.isRequired,
    comments: React.PropTypes.object,
    getComments: React.PropTypes.func,
  };

  componentDidMount() {
    this.props.getComments(this.props.postId);
  }

  render() {
    const { postId, comments } = this.props;
    const commentsData = getCommentsFromState(postId, comments);

    return (
      <div>
        <CommentsList comments={commentsData} />
      </div>
    );
  }
}

