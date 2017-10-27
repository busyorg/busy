import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import User from './User';
import Loading from '../../components/Icon/Loading';
import './InterestingPeople.less';
import steemAPI from '../../steemAPI';

class InterestingPeopleWithAPI extends Component {
  static propTypes = {
    authenticatedUser: PropTypes.shape({
      name: PropTypes.string,
    }),
    followingList: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    authenticatedUser: {
      name: '',
    },
    followingList: [],
  };

  state = {
    users: [],
    loading: true,
    noUsers: false,
  };

  componentWillMount() {
    const authenticatedUsername = this.props.authenticatedUser.name;
    const usernameValidator = window.location.pathname.match(/@(.*)/);
    const username = usernameValidator ? usernameValidator[1] : authenticatedUsername;
    this.getBlogAuthors(username);
  }

  getBlogAuthors = (username = '') =>
    steemAPI
      .getBlogAuthorsAsync(username)
      .then((result) => {
        const followers = this.props.followingList;
        const users = _.sortBy(result, user => user[1])
          .reverse()
          .filter(user => !followers.includes(user[0]))
          .slice(0, 5)
          .map(user => ({ name: user[0] }));
        if (users.length > 0) {
          this.setState({
            users,
            loading: false,
            noUsers: false,
          });
        } else {
          this.setState({
            noUsers: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          noUsers: true,
        });
      });

  render() {
    const { users, loading, noUsers } = this.state;

    if (noUsers) {
      return <div />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="InterestingPeople">
        <div className="InterestingPeople__container">
          <h4 className="InterestingPeople__title">
            <i className="iconfont icon-group InterestingPeople__icon" />
            {' '}
            <FormattedMessage id="interesting_people" defaultMessage="Interesting People" />
          </h4>
          <div className="InterestingPeople__divider" />
          {users && users.map(user => <User key={user.name} user={user} />)}
          <h4 className="InterestingPeople__more">
            <Link to={'/latest-comments'}>
              <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
            </Link>
          </h4>
        </div>
      </div>
    );
  }
}

export default InterestingPeopleWithAPI;
