import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import User from './User';
import Loading from '../../components/Icon/Loading';
import steemAPI from '../../steemAPI';
import './InterestingPeople.less';
import './SidebarContentBlock.less';

@withRouter
class InterestingPeopleWithAPI extends React.Component {
  static propTypes = {
    authenticatedUser: PropTypes.shape({
      name: PropTypes.string,
    }),
    match: PropTypes.shape().isRequired,
    isFetchingFollowingList: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    authenticatedUser: {
      name: '',
    },
    followingList: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      loading: true,
      noUsers: false,
    };

    this.getBlogAuthors = this.getBlogAuthors.bind(this);
  }

  componentDidMount() {
    const authenticatedUsername = this.props.authenticatedUser.name;
    const username = _.has(this.props, 'match.params.name')
      ? this.props.match.params.name
      : authenticatedUsername;
    if (!this.props.isFetchingFollowingList) {
      this.getBlogAuthors(username);
    }
  }

  componentWillReceiveProps(nextProps) {
    const authenticatedUsername = this.props.authenticatedUser.name;
    const username = _.has(this.props, 'match.params.name')
      ? this.props.match.params.name
      : authenticatedUsername;
    const nextUsername = _.has(nextProps, 'match.params.name')
      ? nextProps.match.params.name
      : authenticatedUsername;
    if (username !== nextUsername || !nextProps.isFetchingFollowingList) {
      this.getBlogAuthors(nextUsername);
    }
  }

  getBlogAuthors(username = '') {
    steemAPI
      .sendAsync('call', ['follow_api', 'get_blog_authors', [username]])
      .then(result => {
        const users = _.sortBy(result, user => {
          let count = _.get(user, 1);

          if (_.isEmpty(count)) {
            count = _.get(user, 'count');
          }
          return count;
        })
          .reverse()
          .slice(0, 5)
          .map(user => {
            let name = _.get(user, 0);

            if (_.isEmpty(name)) {
              name = _.get(user, 'author');
            }
            return {
              name,
            };
          });
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
  }

  render() {
    const { users, loading, noUsers } = this.state;

    if (noUsers) {
      return <div />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-group SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="top_reblogged_users" defaultMessage="Top Reblogged Users" />
        </h4>
        <div className="SidebarContentBlock__content">
          {users && users.map(user => <User key={user.name} user={user} />)}
          <h4 className="InterestingPeople__more">
            <Link to={'/discover'}>
              <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
            </Link>
          </h4>
        </div>
      </div>
    );
  }
}

export default InterestingPeopleWithAPI;
