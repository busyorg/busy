import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import { getPostContent } from '../reducers';
import { getContent } from './postActions';
import Comments from '../comments/Comments';
import Loading from '../components/Icon/Loading';
import PostContent from './PostContent';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    content: getPostContent(state, ownProps.match.params.author, ownProps.match.params.permlink),
  }),
  dispatch =>
    ({
      getContent: (author, permlink) => dispatch(getContent({ author, permlink })),
    }),
)
export default class Post extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    content: PropTypes.shape(),
    getContent: PropTypes.func,
  };

  static defaultProps = {
    content: undefined,
    getContent: () => {},
  };

  state = {
    commentsVisible: false,
  };

  componentWillMount() {
    if (!this.props.content) {
      this.props.getContent(this.props.match.params.author, this.props.match.params.permlink);
    }
  }

  componentWillUpdate(nextProps) {
    const { author, permlink } = nextProps.match.params;
    if (!nextProps.content && nextProps.match.params !== this.props.match.params) {
      this.props.getContent(author, permlink);
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
    const { content } = this.props;

    return (
      <div className="main-panel">
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="post-layout container">
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar />
              </div>
            </Affix>
            <div className="center" style={{ paddingBottom: '24px' }}>
              {content ? <PostContent content={content} /> : <Loading />}
              <VisibilitySensor onChange={this.handleCommentsVisibility} />
              <div id="comments">
                {content && <Comments show={this.state.commentsVisible} post={content} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
