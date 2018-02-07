import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getShowPostModal, getCurrentShownPost, getUser } from '../reducers';
import { hidePostModal as hidePostModalAction } from '../app/appActions';
import PostModal from './PostModal';

const PostModalContainer = ({ showPostModal, currentShownPost, hidePostModal, author }) =>
  showPostModal && (
    <PostModal
      showPostModal={showPostModal}
      currentShownPost={currentShownPost}
      hidePostModal={hidePostModal}
      author={author}
    />
  );

export default connect(
  state => {
    const currentShownPost = getCurrentShownPost(state);
    const author = _.get(currentShownPost, 'author');
    return {
      showPostModal: getShowPostModal(state),
      author: getUser(state, author),
      currentShownPost,
    };
  },
  {
    hidePostModal: hidePostModalAction,
  },
)(PostModalContainer);
