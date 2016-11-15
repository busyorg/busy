import React from 'react';
import { connect } from 'react-redux';
import api from '../steemAPI';
import * as postActions from './postActions';
import { closePostModal } from '../actions';
import PostSingleModal from './PostSingleModal';
import PostSinglePage from './PostSinglePage';
import * as reblogActions from '../app/reblog/reblogActions';
import * as commentsActions from '../comments/commentsActions';

@connect(
  ({ posts, app, reblog }) => ({
    content: app.lastPostId ? posts[app.lastPostId] : {},
    isPostModalOpen: app.isPostModalOpen,
    lastPostId: app.lastPostId,
    sidebarIsVisible: app.sidebarIsVisible,
    reblogList: reblog,
  }),
  (dispatch, ownProps) => ({
    reblog: (postId) => dispatch(reblogActions.reblog(postId)),
    closePostModal: () => dispatch(closePostModal()),
    getContent: () => dispatch(postActions.getContent(
      ownProps.params.author,
      ownProps.params.permlink
    )),
    openCommentingDraft: (opts) => {
      dispatch(commentsActions.openCommentingDraft(opts))
    },
    closeCommentingDraft: () => {
      dispatch(commentsActions.closeCommentingDraft())
    },
  })
)
export default class PostSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.props.modal) {
      this.props.getContent();
    }
  }

  handlePageClick(e) {
    e.stopPropagation();
    this.props.closeCommentingDraft();
  }

  render() {
    const { modal, isPostModalOpen, sidebarIsVisible, content, reblog, reblogList } = this.props;
    const openCommentingDraft = () => this.props.openCommentingDraft({
      parentAuthor: content.author,
      parentPermlink: content.permlink,
      category: content.category,
      id: content.id,
    });

    return (
      <div onClick={e => this.handlePageClick(e)}>
        { (modal && isPostModalOpen) &&
          <PostSingleModal
            content={content}
            sidebarIsVisible={sidebarIsVisible}
            closePostModal={this.props.closePostModal}
            route={this.props.route}
            reblog={() => reblog(content.id)}
            isReblogged={reblogList.includes(content.id)}
            openCommentingDraft={openCommentingDraft}
          />
        }

        { (!modal && content.author) &&
          <PostSinglePage
            content={content}
            reblog={() => reblog(content.id)}
            isReblogged={reblogList.includes(content.id)}
            openCommentingDraft={openCommentingDraft}
          />
        }
      </div>
    );
  }
}
