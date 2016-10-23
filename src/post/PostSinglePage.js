import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Promise from 'bluebird';
import request from 'superagent';

import api from './../steemAPI';
import Header from './../app/header';
import Loading from './../widgets/Loading';
import Body from './body';
import Replies from './replies';
import PageActions from './../app/PageActions';

class PostSinglePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
    };
  }

  componentWillMount() {
    this.setState({ content: {} });
    api.getContent(this.props.params.author, this.props.params.permlink, (err, content) => {
      this.setState({ content });
    });
  }

  hasReblog() {
    const { content } = this.state;
    if (!content) return false;
    const { isAuthenticated, user } = this.props.auth;
    if (!isAuthenticated || !user) return false;
    return content.author !== user.name;
  }

  onClickReblog = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { content } = this.state;

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

  renderContent() {
    const { content } = this.state;
    if (!_.has(content, 'author')) {
      return <Loading />;
    }

    return (
      <div className="container">
        <div
          style={{
            overflow: 'hidden',
            height: '40px',
            lineHeight: '40px',
            marginTop: '15px',
          }}
        >
          <Link to={'/@' + content.author}>
            <span className="avatar avatar-sm pull-left">
              <img src={'https://img.busy6.com/@' + content.author} width="40" height="40" />
            </span>
            <span className="pull-left mls">
              @{content.author}
            </span>
          </Link>

          <span className="pull-right">
            {moment(content.created).fromNow()}
            <a><i className="icon icon-md material-icons">bookmark_border</i></a>
          </span>
        </div>

        <div className="single-content">
          <h1 className="mvl">{content.title}</h1>
          <Body body={content.body} jsonMetadata={content.json_metadata} />
        </div>

        {content.children > 0 && (
          <div className="single-replies">
            <h2>Comments</h2>
            <Replies
              parent={content.author}
              parentPermlink={content.permlink}
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="main-panel">
        <PageActions
          params={this.props.params}
          likes
          reblog={this.hasReblog()}
          replies
          onClickReblog={this.onClickReblog}
        />
        <Header />
        <div className="single">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

Promise.promisifyAll(request.Request.prototype);

function reblog(query) {
  return (dispatch) => dispatch({
    type: 'REBLOG',
    payload: {
      promise: request.get(`${process.env.STEEMCONNECT_API_HOST}/reblog`)
        .query(query)
        .withCredentials()
        .endAsync(),
    }
  });
}

PostSinglePage = connect(() => ({}), {
  reblog,
})(PostSinglePage);

export default PostSinglePage;
