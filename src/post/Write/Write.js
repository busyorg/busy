import React from 'react';
import { connect } from 'react-redux';
import kebabCase from 'lodash/kebabCase';
import { createPost, saveDraft, newPost } from './EditorActions';
import Editor from '../../components/Editor/Editor';

const version = require('../../../package.json').version;

@connect(state => ({
  user: state.auth.user,
  editor: state.editor,
}), {
  createPost, saveDraft, newPost,
})
class Write extends React.Component {
  componentDidMount() {
    this.props.newPost();
  }

  onSubmit = (form) => {
    const data = this.getNewPostData(form);
    this.props.createPost(data);
  }

  getNewPostData = (form) => {
    const data = {
      body: form.body,
      title: form.title,
    };

    data.parentAuthor = '';
    data.author = this.props.user.name || '';

    // TODO: Extract images

    const tags = form.topics;
    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    const links = [];
    const linkRegex = /\[.+?]\((.*?)\)/g;
    let matches;

    const postBody = form.body;

    // eslint-disable-next-line
    while (matches = userRegex.exec(postBody)) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    // eslint-disable-next-line
    while (matches = linkRegex.exec(postBody)) {
      if (links.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
        links.push(matches[1]);
      }
    }

    if (data.title && !data.permalink) {
      data.permlink = kebabCase(data.title);
    }

    const metaData = {
      app: `busy/${version}`,
      format: 'markdown',
    };

    if (tags.length) { metaData.tags = tags; }
    if (users.length) { metaData.users = users; }
    if (links.length) { metaData.links = links; }
    // if (image.length) { metaData.image = image; }

    data.parentPermlink = tags.length ? tags[0] : 'general';
    data.jsonMetadata = metaData;

    return data;
  }

  render() {
    return (
      <div className="shifted">
        <div className="container">
          <Editor onSubmit={this.onSubmit} />
        </div>
      </div>
    );
  }
}

export default Write;
