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

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentShownPostID !== this.props.currentShownPostID) {
      this.setState({
        commentsVisible: false,
      });
    }
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

    return (
      <Modal
        title={null}
        footer={null}
        visible={visible}
        onCancel={this.props.hidePostModal}
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
