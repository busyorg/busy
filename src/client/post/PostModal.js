import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import VisibilitySensor from 'react-visibility-sensor';
import PostContent from './PostContent';
import Comments from '../comments/Comments';
import './PostModal.less';

class PostModal extends React.Component {
  static propTypes = {
    currentShownPost: PropTypes.shape(),
    showPostModal: PropTypes.bool.isRequired,
    hidePostModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentShownPost: {},
  };

  static pushURLState(post) {
    if (window) window.history.pushState({}, post.title, post.url);
  }

  static replaceURLState(title, url) {
    if (window) window.history.replaceState({}, title, url);
  }

  constructor(props) {
    super(props);

    const previousURL = window ? window.location.href : '';
    this.state = {
      commentsVisible: false,
      previousURL,
    };

    this.handleCommentsVisibility = this.handleCommentsVisibility.bind(this);
  }

  componentDidMount() {
    if (document) {
      const modalContents = document.getElementsByClassName('ant-modal-wrap');
      const modalContentElement = _.get(modalContents, 0);
      if (modalContentElement) {
        modalContentElement.scrollTop = 0;
      }
    }

    if (window) {
      const { currentShownPost } = this.props;
      PostModal.pushURLState(currentShownPost);
    }
  }

  componentWillUnmount() {
    this.props.hidePostModal();
    PostModal.pushURLState({ title: 'Busy', url: this.state.previousURL });
  }

  handleCommentsVisibility(visible) {
    if (visible) {
      this.setState({
        commentsVisible: true,
      });
    }
  }

  render() {
    const { showPostModal, currentShownPost } = this.props;
    const category = _.get(currentShownPost, 'category', '');
    const author = _.get(currentShownPost, 'author', '');
    const permlink = _.get(currentShownPost, 'permlink', '');

    return (
      <Modal
        title={null}
        footer={null}
        visible={showPostModal}
        onCancel={this.props.hidePostModal}
        width={720}
        wrapClassName="PostModal"
        destroyOnClose
      >
        <div className="PostModal__back">
          <a
            className="PostModal__back__link"
            role="presentation"
            onClick={this.props.hidePostModal}
          >
            <i className="iconfont icon-return" />
            <FormattedMessage id="back" defaultMessage="Back" />
          </a>
        </div>
        <div className="PostModal__actions-container">
          <a role="presentation" onClick={this.props.hidePostModal} className="PostModal__action">
            <i className="iconfont icon-close-big PostModal__icon" />
          </a>
          <Link to={`/${category}/@${author}/${permlink}`} className="PostModal__action">
            <i className="iconfont icon-send PostModal__icon" />
          </Link>
        </div>
        <PostContent content={currentShownPost} />
        <VisibilitySensor onChange={this.handleCommentsVisibility} />
        <div id="comments">
          <Comments show={this.state.commentsVisible} post={currentShownPost} />
        </div>
      </Modal>
    );
  }
}

export default PostModal;
