import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import VisibilitySensor from 'react-visibility-sensor';
import formatter from '../helpers/steemitFormatter';
import { getCryptoDetails } from '../helpers/cryptosHelper';
import {
  getPostContent,
  getIsPostEdited,
  getIsPostFetching,
  getIsPostLoaded,
  getIsPostFailed,
  getIsAuthFetching,
} from '../reducers';
import { getContent } from './postActions';
import Error404 from '../statics/Error404';
import Comments from '../comments/Comments';
import Loading from '../components/Icon/Loading';
import PostContent from './PostContent';
import Affix from '../components/Utils/Affix';
import HiddenPostMessage from './HiddenPostMessage';
import PostRecommendation from '../components/Sidebar/PostRecommendation';
import CryptoTrendingCharts from '../components/Sidebar/CryptoTrendingCharts';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    edited: getIsPostEdited(state, ownProps.match.params.permlink),
    content: getPostContent(state, ownProps.match.params.author, ownProps.match.params.permlink),
    isAuthFetching: getIsAuthFetching(state),
    fetching: getIsPostFetching(
      state,
      ownProps.match.params.author,
      ownProps.match.params.permlink,
    ),
    loaded: getIsPostLoaded(state, ownProps.match.params.author, ownProps.match.params.permlink),
    failed: getIsPostFailed(state, ownProps.match.params.author, ownProps.match.params.permlink),
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
    isAuthFetching: PropTypes.bool.isRequired,
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

    const shouldUpdate = author !== prevAuthor || permlink !== prevPermlink;
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

  renderCryptoTrendingCharts() {
    const { content } = this.props;
    const parsedJsonMetadata = _.attempt(JSON.parse, content.json_metadata);

    if (_.isError(parsedJsonMetadata)) {
      return null;
    }

    const tags = _.get(parsedJsonMetadata, 'tags', []);
    const allCryptoDetails = [];

    _.each(tags, (tag) => {
      const cryptoDetails = getCryptoDetails(tag);
      if (!_.isEmpty(cryptoDetails)) {
        allCryptoDetails.push(cryptoDetails);
      }
    });

    const cryptoTags = _.map(_.uniqBy(allCryptoDetails, 'symbol'), crypto => crypto.symbol);
    return !_.isEmpty(cryptoTags) && <CryptoTrendingCharts cryptos={cryptoTags} />;
  }

  render() {
    const { content, fetching, loaded, failed, isAuthFetching } = this.props;

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
                {loaded && this.renderCryptoTrendingCharts()}
                <PostRecommendation isAuthFetching={isAuthFetching} />
              </div>
            </Affix>
            {showPost ? (
              <div className="center" style={{ paddingBottom: '24px' }}>
                <PostContent content={content} />
                <VisibilitySensor onChange={this.handleCommentsVisibility} />
                <div id="comments">
                  <Comments show={this.state.commentsVisible} post={content} />
                </div>
              </div>
            ) : (
              <HiddenPostMessage onClick={this.handleShowPost} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
