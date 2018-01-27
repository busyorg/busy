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
    currentShownPostID: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    currentFeed: PropTypes.arrayOf(PropTypes.shape()),
    hidePostModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentFeed: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      commentsVisible: false,
    };

    this.handleCommentsVisibility = this.handleCommentsVisibility.bind(this);
  }

  componentDidMount() {
    if (document) {
      const modalContents = document.getElementsByClassName('ant-modal-content');
      const modalContentElement = _.get(modalContents, 0);
      if (modalContentElement) {
        modalContentElement.scrollIntoView();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentShownPostID !== this.props.currentShownPostID) {
      this.setState({
        commentsVisible: false,
      });
      if (document) {
        _.debounce(() => {
          console.log('DEBOUNCEDD');
          const modalContents = document.getElementsByClassName('ant-modal-content');
          const modalContentElement = _.get(modalContents, 0);
          if (modalContentElement) {
            modalContentElement.scrollIntoView();
          }
        }, 2000);
      }
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
    const { visible, currentFeed, currentShownPostID } = this.props;
    let post = _.find(currentFeed, ['id', currentShownPostID]);

    if (_.isUndefined(post)) {
      post = _.head(currentFeed);
    }

    const category = _.get(post, 'category', '');
    const author = _.get(post, 'author', '');
    const permlink = _.get(post, 'permlink', '');

    return (
      <Modal
        title={null}
        footer={null}
        visible={visible}
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
        <div className="PostModal__actions-container" id="PostModal-post-title">
          <a role="presentation" onClick={this.props.hidePostModal} className="PostModal__action">
            <i className="iconfont icon-close PostModal__icon" />
          </a>
          <Link to={`/${category}/@${author}/${permlink}`} className="PostModal__action">
            <i className="iconfont icon-send PostModal__icon" />
          </Link>
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
