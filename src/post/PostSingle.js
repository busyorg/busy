import React from 'react';
import { connect } from 'react-redux';
import api from './../steemAPI';
import * as postActions from './postActions';
import { closePostModal } from './../actions';
import PostSingleModal from './PostSingleModal';
import PostSinglePage from './PostSinglePage';

@connect(
  ({ posts, app }) => ({
    content: app.activePostModal ? posts[app.activePostModal] : {},
    activePostModal: app.activePostModal,
    sidebarIsVisible: app.sidebarIsVisible,
  }),
  (dispatch, ownProps) => ({
    reblog: (q) => dispatch(postActions.reblog(q)),
    closePostModal: () => dispatch(closePostModal()),
    getContent: () => dispatch(postActions.getContent(
      ownProps.params.author,
      ownProps.params.permlink
    ))
  })
)
export default class PostSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getContent();
  }

  handleReblog = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const content = this.props.modal ? this.props.content : this.state.content;

    if (!content) {
      // TODO wait
      return;
    }

    this.props.reblog({
      account: content.author, // TODO What is this
      author: content.author,
      permlink: content.permlink,
    });
  };

  render() {
    const { modal, activePostModal, sidebarIsVisible } = this.props;
    const content = this.props.modal ? this.props.content : this.state.content;

    return (
      <div>
        { (modal && activePostModal) &&
          <PostSingleModal
            content={content}
            sidebarIsVisible={sidebarIsVisible}
            onClickReblog={this.handleReblog}
            closePostModal={this.props.closePostModal}
            route={this.props.route}
          />
        }

        { (!modal && content.author) &&
          <PostSinglePage content={content} onClickReblog={this.handleReblog} />
        }
      </div>
    );
  }
}
