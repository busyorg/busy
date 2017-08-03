import React from 'react';
import { FormattedMessage } from 'react-intl';
import UserCard from '../widgets/UserCard';
import team from '../helpers/team';
import advisors from '../helpers/advisors';
import contributors from '../helpers/contributors';

export default () =>
  (<div className="main-panel">
    <div className="container text-center my-5">
      <h1>
        <FormattedMessage id="team" defaultMessage="Team" />
      </h1>
      <p>
        <FormattedMessage
          id="@statics/busy_team"
          defaultMessage="The Busy team draws on years of experience across multiple successful startup projects and helps guide the foundation towards its strategic goals."
        />
      </p>
      <div className="row my-5">
        {team.map(user =>
          (<UserCard
            key={user.name}
            name={user.name}
            username={user.username}
            label={
              <h4>
                {user.role}
              </h4>
            }
          />),
        )}
      </div>
      <h1>
        <FormattedMessage id="advisors" defaultMessage="Advisors" />
      </h1>
      <div className="row my-5">
        {advisors.map(user =>
          <UserCard key={user.name} name={user.name} username={user.username} />,
        )}
      </div>
      <h1>
        <FormattedMessage id="contributors" defaultMessage="Contributors" />
      </h1>
      <div className="row my-5">
        {contributors.map(user =>
          <UserCard key={user.name} name={user.name} username={user.username} />,
        )}
      </div>
    </div>
  </div>);
