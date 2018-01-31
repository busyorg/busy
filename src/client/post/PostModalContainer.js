import { connect } from 'react-redux';
import { getShowPostModal, getCurrentShownPost } from '../reducers';
import { hidePostModal } from '../app/appActions';
import PostModal from './PostModal';

export default connect(
  state => ({
    showPostModal: getShowPostModal(state),
    currentShownPost: getCurrentShownPost(state),
  }),
  dispatch => ({
    hidePostModal: post => dispatch(hidePostModal(post)),
  }),
)(PostModal);
