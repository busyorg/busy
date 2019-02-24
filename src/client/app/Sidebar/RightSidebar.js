import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { getIsAuthenticated, getIsAuthFetching } from '../../reducers';
import InterestingPeopleContainer from '../../containers/InterestingPeopleContainer';
import PostRecommendationContainer from '../../containers/PostRecommendationContainer';
import SignUp from '../../components/Sidebar/SignUp';
import Loading from '../../components/Icon/Loading';
import UserActivitySearch from '../../activity/UserActivitySearch';
import WalletSidebar from '../../components/Sidebar/WalletSidebar';
import FeedSidebar from '../../components/Sidebar/FeedSidebar';

const RightSidebar = ({ authenticated, isAuthFetching }) => {
  if (isAuthFetching) {
    return <Loading />;
  }

  return (
    <div>
      {!authenticated && <SignUp />}
      <Switch>
        <Route exact path="/activity" component={UserActivitySearch} />
        <Route exact path="/@:name/activity" component={UserActivitySearch} />
        <Route exact path="/@:name/transfers" render={WalletSidebar} />
        <Route exact path="/(trending|created|hot|promoted)/:tag?" component={FeedSidebar} />
        <Route exact path="/(replies|bookmarks)?" component={InterestingPeopleContainer} />
        <Route
          exact
          path="/@:user/(comments|followed|followers)?"
          component={InterestingPeopleContainer}
        />
        <Route
          exact
          path="/:category?/@:author/:permlink"
          component={PostRecommendationContainer}
        />
      </Switch>
    </div>
  );
};

RightSidebar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isAuthFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  isAuthFetching: getIsAuthFetching(state),
});

export default withRouter(connect(mapStateToProps)(RightSidebar));
