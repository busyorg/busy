import React, { PropTypes } from 'react';
import get from 'lodash/get';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent
} from './feedActions';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getUserFeedContentFromState,
  getUserFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import FavoriteButton from '../favorites/FavoriteButton';
import { notify } from '../app/Notification/notificationActions';
import * as favoriteActions from '../favorites/favoritesActions';
import EmptyFeed from '../statics/EmptyFeed';
import { LeftSidebar, RightSidebar } from '../app/Sidebar/index';
import TopicSelector from '../components/TopicSelector';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';

@withRouter
class TopicSelectorWrapper extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    onSortChange: PropTypes.func,
  }

  static defaultProps = {
    onSortChange: () => {},
  }

  constructor(props) {
    super(props);

    const { location, category } = this.props;

    this.state = {
      currentKey: location.pathname.split('/')[1] || 'created',
      categories: (category) ? [category] : [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location, category } = nextProps;

    if (location.pathname === this.props.location.pathname) return;

    this.setState({
      currentKey: location.pathname.split('/')[1] || 'created',
      categories: (category) ? [category] : [],
    });

    this.props.onSortChange(location.pathname.split('/')[1] || 'created');
  }

  onChange = (key) => {
    this.setState({ currentKey: key });
    this.props.onSortChange(key);

    if (this.state.categories[0]) {
      this.props.history.push(`/${key}/${this.state.categories[0]}`);
    } else {
      this.props.history.push(`/${key}`);
    }
  }

  onTopicClose = () => {
    this.setState({ categories: [] });
    this.props.history.push(`/${this.state.currentKey}`);
  }

  render() {
    return (
      <TopicSelector
        isSingle={false}
        defaultSort={this.state.currentKey}
        topics={this.state.categories}
        onSortChange={this.onChange}
        onTopicClose={this.onTopicClose}
      />);
  }
}

@connect(
  state => ({
    auth: state.auth,
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch => ({
    getFeedContent: sortBy => dispatch(getFeedContent({ sortBy, limit: 10 })),
    getMoreFeedContent: sortBy => dispatch(getMoreFeedContent({ sortBy, limit: 10 })),
  })
)
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: 'trending',
    };
  }

  // componentDidMount() {
  //   this.props.getFeedContent(this.state.currentKey);
  // }

  handleSortChange = (key) => {
    console.log('changing to', key);
    this.setState({ currentKey: key });
    // this.props.getFeedContent(key);
  };

  render() {
    const { feed, posts } = this.props;
    const { currentKey } = this.state;

    if (get(feed, `${currentKey}.all.isLoaded`)) {
      // getFeedContentFromState(currentKey, undefined, feed, posts);
      // getFeedLoadingFromState(currentKey, undefined, feed);
      // getFeedHasMoreFromState(currentKey, undefined, feed);
    }

    console.log('outside', currentKey);

    // return (
    //   <div>
    //     <Helmet>
    //       <title>Busy</title>
    //     </Helmet>
    //     <ScrollToTop />
    //     <div className="shifted">
    //       <div className="feed-layout container">
    //         <Affix className="leftContainer" stickPosition={77}>
    //           <div className="left">
    //             <LeftSidebar auth={auth} />
    //           </div>
    //         </Affix>
    //         <Affix className="rightContainer" stickPosition={77}>
    //           <div className="right">
    //             <RightSidebar auth={auth} />
    //           </div>
    //         </Affix>
    //         <div className="center">
    //           <TopicSelectorWrapper category={undefined} onSortChange={this.handleSortChange} />
    //           <Feed
    //             content={content}
    //             isFetching={isFetching}
    //             hasMore={hasMore}
    //             loadMoreContent={() => this.props.getMoreFeedContent(currentKey)}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );

    return <TopicSelectorWrapper category={undefined} onSortChange={this.handleSortChange} />;
  }
}

export default Page;
