import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommentsList from './CommentsList';

@connect (mapStateToProps)
export default class Comments extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    postId: React.PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.props.getComments(this.props.postId);
  }

  render() {
    // TODO(p0o): remove default when postId is passed from the top (not implemented yet)
    const postId = this.props.postId || 0;

    return (
      <div>
        <CommentsList commentsData={ commentsData[postId] } />
      </div>
    );
  }
}

const mapStateToProps = ({ comments }) => {
  return {
    comments
  };
};
