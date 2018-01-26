import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import VisibilitySensor from 'react-visibility-sensor';
import PostContent from './PostContent';
import Comments from '../comments/Comments';
import './PostModal.less';

class PostModal extends React.Component {
  static propTypes = {
    currentShownPostID: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    currentFeed: PropTypes.arrayOf(PropTypes.shape()),
    showPostModal: PropTypes.func.isRequired,
    hidePostModal: PropTypes.func.isRequired,
    loadMoreFeedContent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentFeed: [],
  };

  static scrollPostFromFeedIntoView(content) {
    const elementID = `${content.author}-${content.permlink}`;
    if (document) {
      const element = document.getElementById(elementID);
      element.scrollIntoView();
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      commentsVisible: false,
    };

    this.handleCommentsVisibility = this.handleCommentsVisibility.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.navigateToNextPost = this.navigateToNextPost.bind(this);
    this.navigateToPrevPost = this.navigateToPrevPost.bind(this);
  }

  componentWillMount() {
    if (document) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentShownPostID !== this.props.currentShownPostID) {
      this.setState({
        commentsVisible: false,
      });
    }
  }

  componentWillUnmount() {
    if (document) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  handleKeyDown(key) {
    let activeElementTag;

    if (document) {
      activeElementTag = document.activeElement.tagName;
    }

    if (activeElementTag === 'TEXTAREA') {
      return;
    }

    if (key.code === 'ArrowRight') {
      this.navigateToNextPost();
    } else if (key.code === 'ArrowLeft') {
      this.navigateToPrevPost();
    }
  }

  navigateToNextPost() {
    const { currentFeed, currentShownPostID } = this.props;
    const currentPostIndex = _.findIndex(currentFeed, post => post.id === currentShownPostID);
    const nextPostIndex = currentPostIndex + 1;

    if (nextPostIndex > currentFeed.length - 1) {
      this.props.loadMoreFeedContent();
    } else {
      const nextPost = _.get(currentFeed, nextPostIndex, currentPostIndex);
      const nextPostID = nextPost.id;

      this.props.showPostModal(nextPostID);
      PostModal.scrollPostFromFeedIntoView(nextPost);
    }
  }

  navigateToPrevPost() {
    const { currentFeed, currentShownPostID } = this.props;
    const currentPostIndex = _.findIndex(currentFeed, post => post.id === currentShownPostID);
    const prevPostIndex = currentPostIndex - 1;

    if (prevPostIndex >= 0) {
      const prevPost = _.get(currentFeed, prevPostIndex, currentPostIndex);
      const prevPostID = prevPost.id;

      this.props.showPostModal(prevPostID);
      PostModal.scrollPostFromFeedIntoView(prevPost);
    }
  }

  handleCommentsVisibility(visible) {
    if (visible) {
      this.setState({
        commentsVisible: true,
      });
    }
  }

  handleModalClose() {
    const { hidePostModal, currentShownPostID, currentFeed } = this.props;
    const post = _.find(currentFeed, ['id', currentShownPostID]);
    hidePostModal();
    PostModal.scrollPostFromFeedIntoView(post);
  }

  render() {
    const { visible, currentFeed, currentShownPostID } = this.props;
    let post = _.find(currentFeed, ['id', currentShownPostID]);

    if (_.isUndefined(post)) {
      post = _.head(currentFeed);
    }

    return (
      <Modal
        title={null}
        footer={null}
        visible={visible}
        onCancel={this.handleModalClose}
        width={720}
        wrapClassName="PostModal"
        destroyOnClose
        maskStyle={{ backgroundColor: 'rgba(255, 255, 255, .8)' }}
      >
        <div className="PostModal__back">
          <a className="PostModal__back__link" role="presentation" onClick={this.handleModalClose}>
            <i className="iconfont icon-return" />
            <FormattedMessage id="back" defaultMessage="Back" />
          </a>
        </div>
        <PostContent content={post} />
        <VisibilitySensor onChange={this.handleCommentsVisibility} />
        <div id="comments">
          <Comments show={this.state.commentsVisible} post={post} />
        </div>
      </Modal>
    );
  }
}

export default PostModal;
