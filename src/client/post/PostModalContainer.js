import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getShowPostModal, getCurrentShownPost, getUser, getPostContent } from '../reducers';
import { hidePostModal as hidePostModalAction } from '../app/appActions';
import PostModal from './PostModal';

const PostModalContainer = ({
  showPostModal,
  currentShownPost,
  hidePostModal,
  author,
  shownPostContents,
}) =>
  showPostModal && (
    <PostModal
      showPostModal={showPostModal}
      currentShownPost={currentShownPost}
      hidePostModal={hidePostModal}
      author={author}
      shownPostContents={shownPostContents}
    />
  );

export default connect(
  state => {
    const currentShownPost = getCurrentShownPost(state);
    const author = _.get(currentShownPost, 'author');
    const permlink = _.get(currentShownPost, 'permlink');
    return {
      showPostModal: getShowPostModal(state),
      author: getUser(state, author),
      currentShownPost,
      shownPostContents: getPostContent(state, author, permlink),
    };
  },
  {
    hidePostModal: hidePostModalAction,
  },
)(PostModalContainer);
