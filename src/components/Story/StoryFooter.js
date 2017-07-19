import React, { PropTypes } from 'react';
import numeral from 'numeral';
import { Tooltip, Modal } from 'antd';
import classNames from 'classnames';

import PayoutDetail from '../PayoutDetail';
import './StoryFooter.less';

class StoryFooter extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      shareModalVisible: false,
    };
  }

  handleShareClick = () => {
    this.setState({
      shareModalVisible: !this.state.shareModalVisible,
    });
  }

  handleShareOk = () => {
    this.setState({
      shareModalVisible: false,
    });
  }

  handleShareCancel = () => {
    this.setState({
      shareModalVisible: false,
    });
  }

  render() {
    const { post, postState, onLikeClick, onCommentClick, onShareClick } = this.props;
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
            <i className="iconfont icon-praise_fill" />
            <span className="StoryFooter__number">{likesValue}</span>
          </a>
        </Tooltip>
        <Tooltip title="Comment" placement="top">
          <a className="StoryFooter__link" onClick={() => onCommentClick()}>
            <i className="iconfont icon-message_fill" />
            <span className="StoryFooter__number">{commentsValue}</span>
          </a>
        </Tooltip>
        <Tooltip title="Reblog" placement="top">
          <a className={rebloggedClass} onClick={this.handleShareClick}>
            <i className="iconfont icon-send StoryFooter__share" />
          </a>
          <Modal
            title="test"
            visible={this.state.shareModalVisible}
            onOk={this.handleShareOk}
            onCancel={this.handleShareCancel}
          >
            Test
          </Modal>
        </Tooltip>
      </div>
    );
  }
}

export default StoryFooter;
