import React from 'react';
import { FormattedMessage } from 'react-intl';
import MenuHelp from '../app/Menu/MenuHelp';
import UserCard from '../widgets/UserCard';
import team from '../helpers/team';
import advisors from '../helpers/advisors';
import contributors from '../helpers/contributors';

export default () =>
  <div className="main-panel">
    <MenuHelp />
    <div className="container text-center my-5">
      <h1><FormattedMessage id="team" /></h1>
      <p>
        <FormattedMessage
          id="@statics/busy_team"
          defaultMessage="The Busy team draws on years of experience across multiple successful startup projects and helps guide the foundation towards its strategic goals."
        />
      </p>
      <div className="row my-5">
        {team.map((user, idx) =>
          <UserCard
            key={idx}
            name={user.name}
            username={user.username}
            label={<h4>{user.role}</h4>}
          />
        )}
      </div>
      <h1><FormattedMessage id="advisors" /></h1>
      <div className="row my-5">
        {advisors.map((user, idx) =>
          <UserCard
            key={idx}
            name={user.name}
            username={user.username}
          />
        )}
      </div>
      <h1><FormattedMessage id="contributors" /></h1>
      <div className="row my-5">
        {contributors.map((user, idx) =>
          <UserCard
            key={idx}
            name={user.name}
            username={user.username}
          />
        )}
      </div>
    </div>
  </div>;
