import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import VisibilitySensor from 'react-visibility-sensor';
import formatter from '../helpers/steemitFormatter';
import { getCryptoDetails } from '../helpers/cryptosHelper';
import { getPostContent, getIsFetching, getIsPostEdited, getIsAuthFetching } from '../reducers';
import { getContent } from './postActions';
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
    fetching: getIsFetching(state),
    isAuthFetching: getIsAuthFetching(state),
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
    isAuthFetching: PropTypes.bool.isRequired,
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
    showHiddenPost: false,
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

  handleCommentsVisibility = visible => {
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
    const cryptoTags = [];

    _.each(tags, (tag) => {
      const cryptoDetails = getCryptoDetails(tag);
      if (!_.isEmpty(cryptoDetails)) {
        cryptoTags.push(tag);
      }
    });

    return !_.isEmpty(cryptoTags) && <CryptoTrendingCharts cryptos={cryptoTags} />;
  }

  render() {
    const { content, fetching, edited, isAuthFetching } = this.props;
    const { showHiddenPost } = this.state;
    const loading = !content || (fetching && edited);
    const reputation = loading ? 0 : formatter.reputation(content.author_reputation);
    const showPost = reputation >= 0 || showHiddenPost;

    return (
      <div className="main-panel">
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="post-layout container">
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                {!loading && this.renderCryptoTrendingCharts()}
                <PostRecommendation isAuthFetching={isAuthFetching} />
              </div>
            </Affix>
            {showPost
              ? <div className="center" style={{ paddingBottom: '24px' }}>
                {!loading ? <PostContent content={content} /> : <Loading />}
                {!loading && <VisibilitySensor onChange={this.handleCommentsVisibility} />}
                <div id="comments">
                  {!loading && <Comments show={this.state.commentsVisible} post={content} />}
                </div>
              </div>
              : <HiddenPostMessage onClick={this.handleShowPost} />}
          </div>
        </div>
      </div>
    );
  }
}
