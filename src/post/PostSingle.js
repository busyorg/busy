import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import api from './../steemAPI';
import Header from '../app/Header';
import Loading from './../widgets/Loading';
import Body from './body';
import Comments from './../comments/Comments';
import TriggerPost from './../app/Trigger/TriggerPost';
import * as postActions from './postActions';
import PostSingleModal from './PostSingleModal';
import PostSinglePage from './PostSinglePage';

@connect(
  ({ posts, app }) => ({
    content: app.activePostModal ? posts[app.activePostModal] : {},
    activePostModal: app.activePostModal,
  }),
  dispatch => ({
    reblog: (q) => dispatch(postActions.reblog(q))
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
    if (!this.props.modal) {
      // TODO(p0o): refactor this later with redux
      api.getContent(this.props.params.author, this.props.params.permlink, (err, content) => {
        this.setState({content});
      });
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
    const { modal, activePostModal } = this.props;
    const content = this.props.modal ? this.props.content : this.state.content;

    return (
      <div>
        { (modal && activePostModal) &&
          <PostSingleModal content={content} onClickReblog={this.handleReblog}/>
        }

        { !modal &&
          <PostSinglePage content={content} onClickReblog={this.handleReblog} />
        }
      </div>
    );
  }
}
