import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import SubFeed from './SubFeed';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import TopicSelector from '../components/TopicSelector';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  state => ({
    auth: state.auth,
  }),
)
class Page extends React.Component {
  static propTypes = {
    auth: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentKey: 'trending',
      categories: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    const sortBy = pathname.split('/')[1];
    const category = pathname.split('/')[2];

    if (sortBy) {
      this.setState({
        currentKey: sortBy,
      });
    }

    this.setState({
      categories: (category) ? [category] : [],
    });
  }

  handleSortChange = (key) => {
    this.setState({
      currentKey: key,
    }, () => {
      if (this.state.categories[0]) {
        this.props.history.push(`/${key}/${this.state.categories[0]}`);
      } else {
        this.props.history.push(`/${key}`);
      }
    });
  };

  handleTopicClose = () => this.props.history.push(this.props.match.url);

  render() {
    const { auth, match, location } = this.props;

    const shouldDisplaySelector = location.pathname !== '/' || !auth.isAuthenticated;

    return (
      <div>
        <Helmet>
          <title>Busy</title>
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <LeftSidebar auth={auth} />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar auth={auth} />
              </div>
            </Affix>
            <div className="center">
              {shouldDisplaySelector && <TopicSelector
                isSingle={false}
                sort={this.state.currentKey}
                topics={this.state.categories}
                onSortChange={this.handleSortChange}
                onTopicClose={this.handleTopicClose}
              />}
              <Route path={`${match.path}:sortBy?/:category?`} component={SubFeed} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
