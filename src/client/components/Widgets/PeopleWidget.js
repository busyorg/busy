import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import BaseWidget from './BaseWidget';
import Avatar from '../Avatar';
import Action from '../Button/Action';
import './PeopleWidget.less';

function User({ name }) {
  return (
    <div className="User">
      <div className="User__left">
        <Link to={`/@${name}`} title={name}>
          <Avatar username={name} size={34} />
        </Link>
        <Link to={`/@${name}`} title={name} className="User__left__name">
          <span className="username">{name}</span>
        </Link>
      </div>
      <div className="User__follow">
        <Action>Follow</Action>
      </div>
    </div>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired,
};

export default function PeopleWidget({ people, onRefresh }) {
  return (
    <BaseWidget
      refreshable
      icon="icon-group"
      title="Interesting People"
      footer={
        <Link to={'/discover'}>
          <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
        </Link>
      }
      onRefresh={onRefresh}
    >
      {people.map(person => <User key={person} name={person} />)}
    </BaseWidget>
  );
}

PeopleWidget.propTypes = {
  people: PropTypes.arrayOf(PropTypes.string),
  onRefresh: PropTypes.func.isRequired,
};

PeopleWidget.defaultProps = {
  people: [],
};
