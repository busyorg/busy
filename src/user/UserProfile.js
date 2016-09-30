import React from 'react';
import { connect } from 'react-redux';
import Header from './../app/header';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  })
)
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { auth } = this.props;
    const account = auth.user && auth.user.name;
    let content, isFetching, hasMore, loadContentAction, loadMoreContentAction;

    return (
      <div className="main-panel">
        { auth.isFetching ?
          <div>
            <Header account={account}/>
            <h1>Logging in...</h1>
          </div>
          :
          <div>
            <Header account={account}/>
            { this.props.children }
          </div>
        }
      </div>
    );
  }
};
