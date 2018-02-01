import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
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

  constructor(props) {
    super(props);

    this.state = {
      commentsVisible: false,
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
    const { category, author, permlink, title, url } = currentShownPost;
    const baseURL = window ? window.location.origin : 'https://busy.org';
    const postURL = `${baseURL}${url}`;
    const twitterShareURL = `https://twitter.com/intent/tweet/?text=${title}&url=${postURL}`;

    return (
      <Modal
        title={null}
        footer={null}
        visible={showPostModal}
        onCancel={this.props.hidePostModal}
        width={767}
        wrapClassName={classNames('PostModal', { PostModal__hidden: !showPostModal })}
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
            <i className="iconfont icon-close PostModal__icon" />
          </a>
          <Link to={`/${category}/@${author}/${permlink}`} className="PostModal__action">
            <i className="iconfont icon-send PostModal__icon" />
          </Link>
          <a href={twitterShareURL} target="_blank" className="PostModal__action">
            <i className="iconfont icon-twitter PostModal__icon" />
          </a>
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
