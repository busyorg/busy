import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import { getPostContent, getIsFetching, getIsPostEdited } from '../reducers';
import { deleteEditedPost } from './Write/editorActions';
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
  }), { getContent, deleteEditedPost })
export default class Post extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    edited: PropTypes.bool,
    content: PropTypes.shape(),
    fetching: PropTypes.bool,
    getContent: PropTypes.func,
    deleteEditedPost: PropTypes.func,
  };

  static defaultProps = {
    edited: false,
    content: undefined,
    fetching: false,
    getContent: () => {},
    deleteEditedPost: () => {},
  };

  state = {
    commentsVisible: false,
  };

  componentWillMount() {
    if ((!this.props.content || this.props.edited) && !this.props.fetching) {
      this.props.getContent(this.props.match.params.author, this.props.match.params.permlink);
      if (this.props.edited) this.props.deleteEditedPost(this.props.match.params.permlink);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { author, permlink } = nextProps.match.params;
    if ((!nextProps.content || nextProps.edited)
      && nextProps.match.params !== this.props.match.params
      && !nextProps.fetching) {
      this.setState({
        commentsVisible: false,
      }, () => {
        this.props.getContent(author, permlink);
        if (nextProps.edited) nextProps.deleteEditedPost(permlink);
      });
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
              {content && <VisibilitySensor onChange={this.handleCommentsVisibility} />}
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
