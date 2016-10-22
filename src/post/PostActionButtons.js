let React = require('react'),
  ReactRedux = require('react-redux'),
  steemConnect = require('steemconnect'),
  numeral = require('numeral'),
  actions = require('./../actions'),
  Link = require('react-router').Link;

const Actions = React.createClass({
  getInitialState() {
    return {
      voted: false
    };
  },
  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.post.active_votes.forEach((entry, key) => {
        if (entry.voter === this.props.auth.user.name) {
          this.setState({ voted: true });
        }
      });
    }
  },
  vote(voter, author, permlink, weight) {
    if (this.props.auth.isAuthenticated) {
      steemConnect.vote(voter, author, permlink, weight, (err, result) => {
        if (!err) this.setState({ voted: true });
      });
    }
  },
  init() {

  },

  handleCommentBoxClick(e) {
    e.stopPropagation();
    if (!this.props.auth.isAuthenticated) {
      return;
    }

    const { id, category, author, permlink } = this.props.post;
    this.props.onCommentRequest({
      parentAuthor: author,
      parentPermlink: permlink,
      category,
      id,
    });
  },

  render() {
    const voter = (this.props.auth.isAuthenticated) ? this.props.auth.user.name : '';
    const post = this.props.post;
    const payout = parseFloat(post.total_payout_value) + parseFloat(post.total_pending_payout_value);
    return (
      <ul>
        <li><a onClick={() => this.vote(voter, post.author, post.permlink, 10000)} className={this.state.voted ? 'active' : ''}><i className="icon icon-sm material-icons">thumb_up</i></a> {numeral(post.net_votes).format('0,0')}<span className="hidden-xs"> Likes</span></li>
        <li><span className="hidden-xs"><i className="icon icon-sm material-icons">attach_money</i> </span>{numeral(payout).format('$0,0.00')}</li>

        <li>
          <a onClick={e => this.handleCommentBoxClick(e)}>
            <i className="icon icon-sm material-icons">comment</i>
          </a>
          { ' ' }
          {numeral(post.children).format('0,0')}
          <span className="hidden-xs"> Comments</span>
        </li>

        <li>
          <a>
            <i className="icon icon-sm material-icons">repeat</i>
            <span className="hidden-xs">
              { ' ' }
              Reblog
            </span>
          </a>
        </li>
      </ul>
    );
  }
});

const mapStateToProps = function (state) {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = function (dispatch) {
  return {};
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Actions);
