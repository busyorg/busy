import React, { Component } from 'react';
import { connect } from 'react-redux';
import steemConnect from 'steemconnect';
import numeral from 'numeral';
import { Link } from 'react-router';
import action from '../actions';
import LikeButton from './actionButtons/LikeButton';
import PayoutLabel from './actionButtons/PayoutLabel';

import Icon from '../widgets/Icon';

@connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => ({})
)
export default class PostActionButtons extends Component {
  constructor() {
    this.state = {
      voted: false
    };
  }

  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.post.active_votes.forEach((entry, key) => {
        if (entry.voter === this.props.auth.user.name) {
          this.setState({ voted: true });
        }
      });
    }
  }

  vote(voter, author, permlink, weight) {
    if (this.props.auth.isAuthenticated) {
      steemConnect.vote(voter, author, permlink, weight, (err, result) => {
        if (!err) this.setState({ voted: true });
      });
    }
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
    const voter = (this.props.auth.isAuthenticated) ? this.props.auth.user.name : '';
    const post = this.props.post;
    const payout = parseFloat(post.total_payout_value) + parseFloat(post.total_pending_payout_value);
    return (
      <ul>
        <li>
          <LikeButton
            onClick={() => this.vote(voter, post.author, post.permlink, 10000)}
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
