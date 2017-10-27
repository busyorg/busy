import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getIsAuthFetching,
  getRecommendations,
  getFollowingList,
} from '../../reducers';
import { updateRecommendations } from '../../user/userActions';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import InterestingPeopleWithAPI from '../../components/Sidebar/InterestingPeopleWithAPI';
import StartNow from '../../components/Sidebar/StartNow';
import SignUp from '../../components/Sidebar/SignUp';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    isAuthFetching: getIsAuthFetching(state),
    recommendations: getRecommendations(state),
    followingList: getFollowingList(state),
  }),
  {
    updateRecommendations,
  },
)
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    showPostRecommendation: PropTypes.bool,
    recommendations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    updateRecommendations: PropTypes.func,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    showPostRecommendation: false,
    updateRecommendations: () => {},
  };

  handleInterestingPeopleRefresh = () => this.props.updateRecommendations();

  render() {
    const {
      authenticated,
      authenticatedUser,
      showPostRecommendation,
      isAuthFetching,
      followingList,
    } = this.props;

    return (
      <div>
        {!authenticated && <SignUp />}
        <Switch>
          <Route
            path="/@:name"
            component={() =>
              authenticated &&
              <InterestingPeopleWithAPI
                authenticatedUser={authenticatedUser}
                authFetching={isAuthFetching}
                followingList={followingList}
              />}
          />
          <Route
            path="/"
            render={() => (
              <div>
                {authenticatedUser.last_root_post === '1970-01-01T00:00:00' && <StartNow />}
                {authenticated &&
                  <InterestingPeople
                    users={this.props.recommendations}
                    onRefresh={this.handleInterestingPeopleRefresh}
                  />}
              </div>
            )}
          />
        </Switch>
        {showPostRecommendation && <PostRecommendation isAuthFetching={isAuthFetching} />}
      </div>
    );
  }
}
