import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import { getPostContent, getIsFetching, getIsPostEdited } from '../reducers';
import { getContent } from './postActions';
import Comments from '../comments/Comments';
import Loading from '../components/Icon/Loading';
import PostContent from './PostContent';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    edited: getIsPostEdited(state, ownProps.match.params.permlink),
    content: getPostContent(state, ownProps.match.params.author, ownProps.match.params.permlink),
    fetching: getIsFetching(state),
  }),
  { getContent },
)
export default class Post extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    edited: PropTypes.bool,
    content: PropTypes.shape(),
    fetching: PropTypes.bool,
    getContent: PropTypes.func,
  };

  static defaultProps = {
    edited: false,
    content: undefined,
    fetching: false,
    getContent: () => {},
  };

  static fetchData(store, match) {
    return store.dispatch(getContent(match.params.author, match.params.permlink));
  }

  state = {
    commentsVisible: false,
  };

  componentDidMount() {
    if ((!this.props.content || this.props.edited) && !this.props.fetching) {
      this.props.getContent(this.props.match.params.author, this.props.match.params.permlink);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { author, permlink } = nextProps.match.params;
    if (
      (!nextProps.content || nextProps.edited) &&
      nextProps.match.params !== this.props.match.params &&
      !nextProps.fetching
    ) {
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

  render() {
    const { content, fetching, edited } = this.props;
    const loading = !content || (fetching && edited);

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
            <div className="center" style={{ paddingBottom: '24px' }}>
              {!loading ? <PostContent content={content} /> : <Loading />}
              {!loading && <VisibilitySensor onChange={this.handleCommentsVisibility} />}
              <div id="comments">
                {!loading && <Comments show={this.state.commentsVisible} post={content} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
