import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import numeral from 'numeral';
import { Link } from 'react-router';
import LikeButton from './actionButtons/LikeButton';
import PayoutLabel from './actionButtons/PayoutLabel';
import * as postActions from './postActions';
import Icon from '../widgets/Icon';

@connect(
  state => ({
    auth: state.auth,
  }),
  (dispatch, ownProps) => bindActionCreators({
    likePost: () => postActions.likePost(ownProps.post.id),
  }, dispatch)
)
export default class PostActionButtons extends Component {
  constructor(props) {
    super(props);
  }

  handleCommentBoxClick(e) {
    e.stopPropagation();
    if (!this.props.auth.isAuthenticated) {
      this.props.notify('You need to login in order to write comments.');
      return;
    }

    const { id, category, author, permlink } = this.props.post;
    this.props.onCommentRequest({
      parentAuthor: author,
      parentPermlink: permlink,
      category,
      id,
    });
  }

  handleCommentsTextClick(e) {
    e.stopPropagation();
    this.props.onShowCommentsRequest();
  }

  handleReblog() {
    const { auth, post, reblog, notify } = this.props;

    if (!auth.isAuthenticated) {
      notify('You need to login in order to reblog posts.');
      return;
    }
    reblog(post.id);
  }

  render() {
    const { post } = this.props;
    const payout = parseFloat(post.total_payout_value) + parseFloat(post.total_pending_payout_value);

    return (
      <ul>
        <li>
          <LikeButton
            onClick={this.props.likePost}
            active={this.state.voted}
            numberOfVotes={ numeral(post.net_votes).format('0,0') }
          />
        </li>
        <li>
          <PayoutLabel
            value={numeral(payout).format('$0,0.00')}
          />
        </li>

        <li>
          <a onClick={e => this.handleCommentBoxClick(e)}>
            <i className="icon icon-sm material-icons">reply</i>
          </a>
          { ' ' }
          <a onClick={e => this.handleCommentsTextClick(e)}>
            { numeral(post.children).format('0,0') }
            <span className="hidden-xs"> Comments</span>
          </a>
        </li>

        <li>
          <a
            onClick={() => this.handleReblog()}
            className={this.props.isReblogged ? 'active' : '' }
          >
            <Icon small name="repeat" />
            <span className="hidden-xs">
              { ' ' }
              Reblog
            </span>
          </a>
        </li>
      </ul>
    );
  }
}
