import React from 'react';
import { Link } from 'react-router';

module.exports = React.createClass({
  render() {
    const username = this.props.username;
    return (
      <ul className="app-nav">
        <li><Link to={`/@${username}`} activeClassName="active"><i className="icon icon-md material-icons">assignment_ind</i><span className="hidden-xs"> Profile</span></Link></li>
        <li><Link to={`/@${username}/posts`} activeClassName="active"><i className="icon icon-md material-icons">library_books</i><span className="hidden-xs"> Posts</span></Link></li>
        <li><Link to={`/@${username}/feed`} activeClassName="active"><i className="icon icon-md  material-icons">subject</i><span className="hidden-xs"> Feed</span></Link></li>
        <li className="hide"><Link to={`/@${username}/replies`} activeClassName="active"><i className="icon icon-md  material-icons">comment</i><span className="hidden-xs"> Replies</span></Link></li>
        <li><Link to={`/@${username}/wallet`} activeClassName="active"><i className="icon icon-md material-icons">account_balance_wallet</i><span className="hidden-xs"> Wallet</span></Link></li>
        <li className="hide"><Link to={`/@${username}/permissions`} activeClassName="active"><i className="icon icon-md material-icons">lock</i><span className="hidden-xs"> Permissions</span></Link></li>
      </ul>
    );
  }
});
