import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import api from './../steemAPI';
import Header from '../app/Header';
import Body from './body';
import Comments from './../comments/Comments';
import TriggerPost from './../app/Trigger/TriggerPost';
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
  dispatch => ({
    reblog: (q) => dispatch(postActions.reblog(q)),
    closePostModal: () => dispatch(closePostModal()),
  })
)
export default class PostSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
    };
  }

  componentWillMount() {
    if (!this.props.modal && this.props.params) {
      // TODO(p0o): refactor this later with redux
      api.getContentAsync(this.props.params.author, this.props.params.permlink)
        .then((content) => {
          this.setState({
            content
          });
        })
        .catch(err => console.log(err));
    }
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

        { (!modal) &&
          <PostSinglePage content={content} onClickReblog={this.handleReblog} />
        }
      </div>
    );
  }
}
