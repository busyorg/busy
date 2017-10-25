import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getIsAuthFetching,
  getRecommendations,
} from '../../reducers';
import { updateRecommendations } from '../../user/userActions';

import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import StartNow from '../../components/Sidebar/StartNow';
import SignUp from '../../components/Sidebar/SignUp';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    isAuthFetching: getIsAuthFetching(state),
    recommendations: getRecommendations(state),
  }), {
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
    updateRecommendations: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showPostRecommendation: false,
  };


  render() {
    const { authenticated, authenticatedUser, showPostRecommendation, isAuthFetching } = this.props;
    const InterestingPeopleWithData = () => (
      <InterestingPeople
        users={this.props.recommendations}
        onRefresh={this.props.updateRecommendations}
      />
    );

    return (
      <div>
        {!authenticated && <SignUp />}
        <Switch>
          <Route path="/@:name" component={InterestingPeopleWithData} />
          <Route
            path="/"
            render={() => (
              <div>
                {authenticatedUser.last_root_post === '1970-01-01T00:00:00' && <StartNow />}
                {!showPostRecommendation && <InterestingPeopleWithData />}
              </div>
            )}
          />
        </Switch>
        {showPostRecommendation && <PostRecommendation isAuthFetching={isAuthFetching} />}
      </div>
    );
  }
}
