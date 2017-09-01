import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
  getIsAuthenticated,
  getAuthenticatedUser,
} from '../../reducers';

import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import StartNow from '../../components/Sidebar/StartNow';
import SignUp from '../../components/Sidebar/SignUp';

const InterestingPeopleWithData = () =>
  (<InterestingPeople
    users={[
      { name: 'liondani', about: 'Inch by Inch, Play by Play' },
      {
        name: 'good-karma',
        about: '"Action expresses priorities!" / Witness - Developer of eSteem…',
      },
      {
        name: 'furion',
        about: 'I’ve developed SteemData and SteemSports. All things Python…',
      },
    ]}
  />);

const RightSidebar = ({ authenticated, authenticatedUser }) =>
  (authenticated
    ? <Switch>
      <Route path="/@:name" component={InterestingPeopleWithData} />
      <Route
        path="/"
        render={() =>
          (<div>
            {authenticatedUser.last_root_post === '1970-01-01T00:00:00' &&
              <StartNow />
            }
            <InterestingPeopleWithData />
          </div>)}
      />
    </Switch>
    : <SignUp />);

RightSidebar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authenticatedUser: PropTypes.shape().isRequired,
};

export default connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
  }),
)(RightSidebar);
