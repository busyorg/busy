import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import formatter from '../helpers/steemitFormatter';
import { getPostContent, getIsPostEdited, getIsPostFetching, getIsPostLoaded, getIsPostFailed } from '../reducers';
import { getContent } from './postActions';
import Error404 from '../statics/Error404';
import Comments from '../comments/Comments';
import Loading from '../components/Icon/Loading';
import PostContent from './PostContent';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import HiddenPostMessage from './HiddenPostMessage';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    edited: getIsPostEdited(state, ownProps.match.params.permlink),
    content: getPostContent(state, ownProps.match.params.author, ownProps.match.params.permlink),
    fetching: getIsPostFetching(state),
    loaded: getIsPostLoaded(state),
    failed: getIsPostFailed(state),
  }),
  { getContent },
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
  };

  static defaultProps = {
    edited: false,
    content: undefined,
    fetching: false,
    loaded: false,
    failed: false,
    getContent: () => {},
  };

  static fetchData(store, match) {
    return store.dispatch(getContent(match.params.author, match.params.permlink));
  }

  state = {
    commentsVisible: false,
    showHiddenPost: false,
  };

  componentDidMount() {
    const { edited, fetching, loaded, failed } = this.props;

    const shouldUpdate = (!loaded && !failed) || edited;
    if (shouldUpdate && !fetching) {
      this.props.getContent(this.props.match.params.author, this.props.match.params.permlink);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { author, permlink } = nextProps.match.params;
    const { author: prevAuthor, permlink: prevPermlink } = this.props.match.params;

    const shouldUpdate = (author !== prevAuthor) || (permlink !== prevPermlink);
    if (shouldUpdate && !nextProps.fetching) {
      this.setState({ commentsVisible: false }, () => this.props.getContent(author, permlink));
    }
  }

  componentWillUnmount() {
    if (process.env.IS_BROWSER) {
      global.document.title = 'Busy';
    }
  }

  handleCommentsVisibility = (visible) => {
    if (visible) {
      this.setState({
        commentsVisible: true,
      });
    }
  };

  handleShowPost = () => {
    this.setState({
      showHiddenPost: true,
    });
  };

  render() {
    const { content, fetching, loaded, failed } = this.props;
    if (failed) return <Error404 />;
    if (fetching || !content) return <Loading />;

    const { showHiddenPost } = this.state;
    const reputation = loaded ? formatter.reputation(content.author_reputation) : 0;
    const showPost = reputation >= 0 || showHiddenPost;

    return (
      <div className="main-panel">
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="post-layout container">
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar showPostRecommendation />
              </div>
            </Affix>
            {showPost
              ? <div className="center" style={{ paddingBottom: '24px' }}>
                <PostContent content={content} />
                <VisibilitySensor onChange={this.handleCommentsVisibility} />
                <div id="comments">
                  <Comments show={this.state.commentsVisible} post={content} />
                </div>
              </div>
              : <HiddenPostMessage onClick={this.handleShowPost} />}
          </div>
        </div>
      </div>
    );
  }
}
