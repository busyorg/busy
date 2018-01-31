import React from 'react';
import PropTypes from 'prop-types';
import { getFollowing } from '../helpers/apiHelpers';
import UserDynamicList from './UserDynamicList';

export default class UserFollowing extends React.Component {
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
    return getFollowing(
      match.params.name,
      previous[previous.length - 1],
      'blog',
      UserFollowing.limit,
    );
  }

  render() {
    return <UserDynamicList limit={UserFollowing.limit} fetcher={this.fetcher} />;
  }
}
