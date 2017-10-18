import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import people from '../../helpers/people';

import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getFollowingList,
} from '../../reducers';

import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import StartNow from '../../components/Sidebar/StartNow';
import SignUp from '../../components/Sidebar/SignUp';
import PostRecommendation from '../../components/Sidebar/PostRecommendation';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    followingList: getFollowingList(state),
  }),
)
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    showPostRecommendation: PropTypes.bool,
  };

  static defaultProps = {
    showPostRecommendation: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      randomPeople: this.getRandomPeople(),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const diffAuthenticated = this.props.authenticated !== nextProps.authenticated;
    const diffAuthenticatedUser =
      JSON.stringify(this.props.authenticatedUser) !== JSON.stringify(nextProps.authenticatedUser);
    const diffRandomPeople =
      JSON.stringify(this.state.randomPeople) !== JSON.stringify(nextState.randomPeople);
    return diffAuthenticated || diffAuthenticatedUser || diffRandomPeople;
  }

  getRandomPeople = () => people
    .reduce((res, item) => {
      if (!this.props.followingList.includes(item)) {
        res.push({ name: item });
      }
      return res;
    }, [])
    .sort(() => 0.5 - Math.random()).slice(0, 5);

  handleRefreshInterestingPeople = () => this.setState({
    randomPeople: this.getRandomPeople(),
  });

  render() {
    const { authenticated, authenticatedUser, showPostRecommendation } = this.props;
    const InterestingPeopleWithData = () => (
      <InterestingPeople
        users={this.state.randomPeople}
        onRefresh={this.handleRefreshInterestingPeople}
      />
    );

    return authenticated
      ? <Switch>
        <Route path="/@:name" component={InterestingPeopleWithData} />
        <Route
          path="/"
          render={() => (
            <div>
              {authenticatedUser.last_root_post === '1970-01-01T00:00:00' && <StartNow />}
              {showPostRecommendation ? <PostRecommendation /> : <InterestingPeopleWithData />}
            </div>
          )}
        />
      </Switch>
      : <div>
        <SignUp />
        {showPostRecommendation && <PostRecommendation />}
      </div>;
  }
}
