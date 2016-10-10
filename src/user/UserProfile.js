import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './../app/header';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
} from './../feed/feedActions';
import { getUserComments, getMoreUserComments } from './userProfileActions';
import appActions from './../actions';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
    comments: state.comments,
  }),
  dispatch => bindActionCreators({
    getFeedContent,
    getMoreFeedContent,
    getUserFeedContent,
    getMoreUserFeedContent,
    getUserComments,
    getMoreUserComments,
    setMenu: appActions.setMenu,
  }, dispatch)
)
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.props.setMenu('secondary');
  }

  render() {
    const { auth } = this.props;
    const account = auth.user && auth.user.name;

    return (
      <div className="main-panel">
        { auth.isFetching ?
          <div>
            <Header account={account} />
            <h1>Logging in...</h1>
          </div>
          :
          <div>
            <Header account={account} />
            { React.cloneElement(
              this.props.children,
              {
                ...this.props,
                limit: 10,
              }
            ) }
          </div>
        }
      </div>
    );
  }
}
