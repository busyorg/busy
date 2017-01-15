import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import steemAPI from '../steemAPI';
import Avatar from '../widgets/Avatar';
import Loading from '../widgets/Loading';
import Follow from '../widgets/Follow';

@connect(
  ({ user }) => ({ following: user.following })
)
class AuthorBio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: null,
    };
  }

  componentDidMount() {
    steemAPI.getAccounts([this.props.authorName], (err, result) => {
      if (result.length) {
        const author = result[0];
        try {
          author.json_metadata = JSON.parse(result[0].json_metadata);
        } catch (e) {
          author.json_metadata = {};
        }
        this.setState({ author });
      }
    });
  }

  render() {
    const { authorName, following } = this.props;
    const { author } = this.state;

    if (author && !following.isFetching) {
      const { about, name } = author.json_metadata.profile || {};
      const displayName = name || `@${authorName}`;

      return (
        <div>
          <div className="pull-left">
            <Avatar lg username={authorName} />
          </div>
          <div className="pull-left">
            <Link to={`/@${authorName}`}>
              {displayName}
            </Link>
            {' '}
            <Follow username={authorName} />
            <div>{about}</div>
          </div>
        </div>
      );
    }

    return <Loading />;
  }
}

export default AuthorBio;
