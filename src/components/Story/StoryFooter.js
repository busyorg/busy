import React, { PropTypes } from 'react';
import numeral from 'numeral';
import { Icon, Tooltip, Modal } from 'antd';
import classNames from 'classnames';

import PayoutDetail from '../PayoutDetail';
import './StoryFooter.less';

class StoryFooter extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
    pendingLike: PropTypes.bool,
  }

  static defaultProps = {
    pendingLike: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      shareModalVisible: false,
      shareModalLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postState.isReblogging !== this.props.postState.isReblogging) {
      this.setState({
        shareModalLoading: nextProps.postState.isReblogging,
        shareModalVisible: (!(!nextProps.postState.isReblogging
          && this.props.postState.isReblogging) && this.state.shareModalVisible),
      });
    }
  }

  handleShareClick = (e) => {
    e.preventDefault();
    if (this.props.postState.isReblogged) {
      return;
    }

    this.setState({
      shareModalVisible: true,
    });
  }

  handleShareOk = () => {
    this.props.onShareClick();
  }

  handleShareCancel = () => {
    this.setState({
      shareModalVisible: false,
    });
  }

  render() {
    const { post, postState, pendingLike, onLikeClick, onCommentClick } = this.props;
    const maxPayout = parseFloat(post.max_accepted_payout) || 0;
    const payout = parseFloat(post.pending_payout_value) || parseFloat(post.total_payout_value);
    const payoutValue = numeral(payout).format('$0,0.00');
    const likesValue = numeral(post.active_votes.filter(vote => vote.percent > 0).length).format(
      '0,0'
    );
    const commentsValue = numeral(post.children).format('0,0');
    const likeClass = classNames({ active: postState.isLiked, StoryFooter__link: true });
    const rebloggedClass = classNames({ active: postState.isReblogged, StoryFooter__link: true });

    return (
      <div className="StoryFooter">
        <span className={classNames('StoryFooter__payout', { 'StoryFooter__payout--rejected': maxPayout === 0 })}>
          <Tooltip title={<PayoutDetail post={post} />} placement="top">
            {payoutValue}
          </Tooltip>
        </span>
        <Tooltip title="Like" placement="top">
          <a className={likeClass} onClick={() => onLikeClick()}>
            {(pendingLike) ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill" />}
            <span className="StoryFooter__number">{likesValue}</span>
          </a>
        </Tooltip>
        <Tooltip title="Comment" placement="top">
          <a className="StoryFooter__link" onClick={() => onCommentClick()}>
            <i className="iconfont icon-message_fill" />
            <span className="StoryFooter__number">{commentsValue}</span>
          </a>
        </Tooltip>
        <Tooltip title={(postState.isReblogged) ? 'You already reblogged this post' : 'Reblog'} placement="top">
          <a className={rebloggedClass} onClick={this.handleShareClick}>
            <i className="iconfont icon-send StoryFooter__share" />
          </a>
          {!postState.isReblogged &&
          <Modal
            title="Reblog this post?"
            visible={this.state.shareModalVisible}
            confirmLoading={this.state.shareModalLoading}
            okText="Reblog"
            onOk={this.handleShareOk}
            onCancel={this.handleShareCancel}
          >
            This post will appear on your personal feed. This action <b>cannot</b> be reversed.
          </Modal>
          }
        </Tooltip>
      </div>
    );
  }
}

export default StoryFooter;
