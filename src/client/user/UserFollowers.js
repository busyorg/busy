import React from 'react';
import PropTypes from 'prop-types';
import { getFollowers } from '../helpers/apiHelpers';
import UserDynamicList from './UserDynamicList';

export default class UserFollowers extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  static limit = 50;

  constructor(props) {
    super(props);

    this.fetcher = this.fetcher.bind(this);
  }

  fetcher(previous) {
    const { match } = this.props;
    return getFollowers(
      match.params.name,
      previous[previous.length - 1],
      'blog',
      UserFollowers.limit,
    );
  }

  render() {
    return <UserDynamicList limit={UserFollowers.limit} fetcher={this.fetcher} />;
  }
}
