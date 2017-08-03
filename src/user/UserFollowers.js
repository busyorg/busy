import React, { PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import UserList from './UserList';
import Loading from '../components/Icon/Loading';
import { getAllFollowers } from '../helpers/apiHelpers';
import './UserFollowers.less';

@withRouter
export default class UserFollowers extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  state = {
    isLoading: false,
    isLoaded: false,
    users: [],
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    getAllFollowers(this.props.match.params.name).then(users =>
      this.setState({
        isLoading: false,
        isLoaded: true,
        users: users.sort(),
      }),
    );
  }

  render() {
    return (
      <div className="UserFollowers">
        <div className="container UserFollowers__container">
          {this.state.users && <UserList users={this.state.users} />}
          {this.state.isLoading && <Loading />}
        </div>
      </div>
    );
  }
}
