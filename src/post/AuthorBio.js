import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import steemAPI from '../steemAPI';
import Avatar from '../widgets/Avatar';
import Loading from '../widgets/Loading';
import Follow from '../widgets/Follow';
import './AuthorBio.scss';

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
    this.setAuthor(this.props.authorName);
  }

  setAuthor = (authorName) => {
    steemAPI.getAccounts([authorName], (err, result) => {
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

  componentWillReceiveProps(newProps) {
    if (newProps.authorName !== this.props.authorName) {
      this.setAuthor(newProps.authorName);
    }
  }

  render() {
    const { authorName, following } = this.props;
    const { author } = this.state;

    if (author && !following.isFetching) {
      const { about, name } = author.json_metadata.profile || {};
      const displayName = name || authorName;

      return (
        <div className="AuthorBio py-5">
          <div className="mr-3">
            <Avatar lg username={authorName} />
          </div>
          <div className="AuthorBio__right">
            <Link to={`/@${authorName}`}>
              {displayName}
            </Link>
            {' '}
            <Follow username={authorName} />
            <p className="mt-2">{about}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="my-5">
        <Loading />
      </div>
    );
  }
}

export default AuthorBio;
