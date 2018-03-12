import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getPostContent,
  getIsPostEdited,
  getIsPostFetching,
  getIsPostLoaded,
  getIsPostFailed,
} from '../reducers';
import { getContent } from '../post/postActions';
import { getAccount } from '../user/usersActions';
import Error404 from '../statics/Error404';
import Comments from '../comments/Comments';
import Loading from '../components/Icon/Loading';

@connect(
  (state, ownProps) => ({
    edited: getIsPostEdited(state, ownProps.match.params.permlink),
    content: getPostContent(state, ownProps.match.params.author, ownProps.match.params.permlink),
    fetching: getIsPostFetching(
      state,
      ownProps.match.params.author,
      ownProps.match.params.permlink,
    ),
    loaded: getIsPostLoaded(state, ownProps.match.params.author, ownProps.match.params.permlink),
    failed: getIsPostFailed(state, ownProps.match.params.author, ownProps.match.params.permlink),
  }),
  { getContent, getAccount },
)
export default class Post extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    edited: PropTypes.bool,
    content: PropTypes.shape(),
    fetching: PropTypes.bool,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getContent: PropTypes.func,
    getAccount: PropTypes.func,
  };

  static defaultProps = {
    edited: false,
    content: undefined,
    fetching: false,
    loaded: false,
    failed: false,
    getContent: () => {},
    getAccount: () => {},
  };

  static fetchData(store, match) {
    const { author, permlink } = match.params;
    return Promise.all([
      store.dispatch(getAccount(author)),
      store.dispatch(getContent(author, permlink)),
    ]);
  }

  componentDidMount() {
    const { match, edited, fetching, loaded, failed } = this.props;
    const { author, permlink } = match.params;

    const shouldUpdate = (!loaded && !failed) || edited;
    if (shouldUpdate && !fetching) {
      this.props.getContent(author, permlink);
      this.props.getAccount(author);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { author, permlink } = nextProps.match.params;
    const { author: prevAuthor, permlink: prevPermlink } = this.props.match.params;

    const shouldUpdate = author !== prevAuthor || permlink !== prevPermlink;
    if (shouldUpdate && !nextProps.fetching) {
      this.props.getContent(author, permlink);
      this.props.getAccount(author);
    }
  }

  render() {
    const { content, fetching, failed } = this.props;

    if (failed) return <Error404 />;
    if (fetching || !content) return <Loading />;

    return (
      <div>
        <Comments fullWidth show post={content} />
      </div>
    );
  }
}
