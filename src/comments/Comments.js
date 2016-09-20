import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommentsList from './CommentsList';

@connect (mapStateToProps)
export default class Comments extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    contentPermlink: React.PropTypes.string.isRequired,
    contentAuthor: React.PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <CommentsList />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {state};
};
