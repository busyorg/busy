import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import numeral from 'numeral';
import { Tabs, Icon, Tooltip, Modal } from 'antd';
import classNames from 'classnames';
import { getUpvotes, getDownvotes } from '../../helpers/voteHelpers';
import ReactionsList from './ReactionsList';
import PayoutDetail from '../PayoutDetail';
import './StoryFooter.less';

class StoryFooter extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    pendingLike: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    onLikeClick: () => {},
    onShareClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      shareModalVisible: false,
      shareModalLoading: false,
      reactionsModalVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postState.isReblogging !== this.props.postState.isReblogging) {
      this.setState({
        shareModalLoading: nextProps.postState.isReblogging,
        shareModalVisible:
          !(!nextProps.postState.isReblogging && this.props.postState.isReblogging) &&
          this.state.shareModalVisible,
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
  };

  handleShareOk = () => {
    this.props.onShareClick();
  };

  handleShareCancel = () => {
    this.setState({
      shareModalVisible: false,
    });
  };

  handleShowReactions = () => this.setState({
    reactionsModalVisible: true,
  });

  handleCloseReactions = () => this.setState({
    reactionsModalVisible: false,
  })

  render() {
    const { post, postState, pendingLike, onLikeClick } = this.props;
    const maxPayout = parseFloat(post.max_accepted_payout) || 0;
    const payout = parseFloat(post.pending_payout_value) || parseFloat(post.total_payout_value);
    const payoutValue = numeral(payout).format('$0,0.00');

    const upVotes = getUpvotes(post.active_votes);
    const downVotes = getDownvotes(post.active_votes);

    const likesValue = numeral(upVotes.length).format(
      '0,0',
    );
    const dislikesValue = numeral(downVotes.length).format(
      '0,0',
    );

    const commentsValue = numeral(post.children).format('0,0');
    const likeClass = classNames({ active: postState.isLiked, StoryFooter__link: true });
    const rebloggedClass = classNames({ active: postState.isReblogged, StoryFooter__link: true });

    return (
      <div className="StoryFooter">
        <span className="StoryFooter__payout">
          <Tooltip title={<PayoutDetail post={post} />}>
            <span
              className={classNames({
                'StoryFooter__payout--rejected': maxPayout === 0,
              })}
            >
              {payoutValue}
            </span>
          </Tooltip>
          {post.percent_steem_dollars === 0 &&
            <Tooltip title="100% Steem Power">
              <i className="iconfont icon-flashlight" />
            </Tooltip>}
        </span>
        <Tooltip title="Like">
          <a role="presentation" className={likeClass} onClick={() => onLikeClick()}>
            {pendingLike ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill" />}
          </a>
        </Tooltip>
        <span className="StoryFooter__number" role="presentation" onClick={this.handleShowReactions}>
          {likesValue}
        </span>
        <Tooltip title="Comment">
          <Link
            className="StoryFooter__link"
            to={{
              pathname: post.url,
              hash: '#comments',
            }}
          >
            <i className="iconfont icon-message_fill" />
          </Link>
        </Tooltip>
        <span className="StoryFooter__number">
          {commentsValue}
        </span>
        <Tooltip
          title={postState.isReblogged ? 'You already reblogged this post' : 'Reblog'}
        >
          <a role="presentation" className={rebloggedClass} onClick={this.handleShareClick}>
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
            </Modal>}
          <Modal
            visible={this.state.reactionsModalVisible}
            onOk={this.handleCloseReactions}
            onCancel={this.handleCloseReactions}
          >
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane
                tab={
                  <span>
                    <i className="iconfont icon-praise_fill" />
                    <span className="StoryFooter__icon-text">{likesValue}</span>
                  </span>
                }
                key="1"
              >
                <ReactionsList users={upVotes.map(vote => vote.voter)} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <i className="iconfont icon-praise_fill StoryFooter__dislike" />
                    <span className="StoryFooter__icon-text StoryFooter__icon-text-dislike">{dislikesValue}</span>
                  </span>
                }
                key="2"
              >
                <ReactionsList users={downVotes.map(vote => vote.voter)} />
              </Tabs.TabPane>
            </Tabs>
          </Modal>
        </Tooltip>
      </div>
    );
  }
}

export default StoryFooter;
