import React, { Component } from 'react';
import steemdb from 'steemdb';
import { connect } from 'react-redux';

import Avatar from '../widgets/Avatar';
import Loading from '../widgets/Loading';
import Follow from '../widgets/Follow';
import { followUser, unfollowUser } from '../user/userActions';

@connect(
  ({ auth }) => ({ auth }),
  dispatch => ({
    followUser: (...args) => dispatch(followUser(...args)),
    unfollowUser: (...args) => dispatch(unfollowUser(...args)),
  })
)
class AuthorBio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: null,
    };
  }

  componentDidMount() {
    steemdb.accounts({
      account: this.props.authorName
    }, (err, result) => {
      if (result.length) {
        const jsonMetaData = result[0].json_metadata;
        const author = result[0];
        try {
          author.json_metadata = JSON.parse(jsonMetaData);
        } catch (e) {
          author.json_metadata = {};
        }

        this.setState({ author });
      }
    });
  }

  render() {
    const { authorName, auth } = this.props;
    const { author } = this.state;
    const loggedInUser = auth.user.name;

    if (author) {
      const isFollowing = author ? author.followers.indexOf(loggedInUser) >= 0 : false;
      const onClickFollowFn = isFollowing ? this.props.unfollowUser : this.props.followUser;
      const { about, name } = author.json_metadata.profile || {};
      const displayName = name || `@${authorName}`;

      return (
        <div className="col-md-4">
          <div>
            <Avatar lg username={authorName} />
            {displayName}
            <Follow
              hasFollow={authorName !== loggedInUser}
              isFollowing={isFollowing}
              onClickFollow={() => onClickFollowFn(authorName)}
            />
          </div>
          <div style={{ display: 'inline-block' }}>
            <span>{about}</span>
          </div>
        </div>
      );
    }

    return <Loading />;
  }
}

export default AuthorBio;
