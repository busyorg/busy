import React from 'react';
import { connect } from 'react-redux';
import { getShowPostModal, getCurrentShownPost } from '../reducers';
import { hidePostModal as hidePostModalAction } from '../app/appActions';
import PostModal from './PostModal';

const PostModalContainer = ({ showPostModal, currentShownPost, hidePostModal }) =>
  showPostModal && (
    <PostModal
      showPostModal={showPostModal}
      currentShownPost={currentShownPost}
      hidePostModal={hidePostModal}
    />
  );

export default connect(
  state => ({
    showPostModal: getShowPostModal(state),
    currentShownPost: getCurrentShownPost(state),
  }),
  {
    hidePostModal: hidePostModalAction,
  },
)(PostModalContainer);
