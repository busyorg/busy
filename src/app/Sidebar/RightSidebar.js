import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

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

const RightSidebar = ({ auth }) =>
  (auth.user.name !== undefined
    ? <Switch>
      <Route path="/@:name" render={() => <InterestingPeopleWithData />} />
      <Route
        path="/"
        render={() =>
          (<div>
            <StartNow />
            <InterestingPeopleWithData />
          </div>)}
      />
    </Switch>
    : <SignUp />);

RightSidebar.propTypes = {
  auth: PropTypes.shape().isRequired,
};

export default RightSidebar;
