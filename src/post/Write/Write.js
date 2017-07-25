import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import kebabCase from 'lodash/kebabCase';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import 'url-search-params-polyfill';
import { createPost, saveDraft, newPost } from './EditorActions';
import Editor from '../../components/Editor/Editor';
import Affix from '../../components/Utils/Affix';

const version = require('../../../package.json').version;

@connect(state => ({
  user: state.auth.user,
  editor: state.editor,
}), {
  createPost, saveDraft, newPost,
})
class Write extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialTitle: '',
      initialTopics: [],
      initialBody: '',
      initialReward: '50',
      initialUpvote: true,
    };
  }

  componentDidMount() {
    this.props.newPost();
    const { editor: { draftPosts }, location: { search } } = this.props;
    const draftId = new URLSearchParams(search).get('draft');
    const draftPost = draftPosts[draftId];
    const postData = draftPost && draftPost.postData;

    if (postData) {
      const { jsonMetadata } = postData;
      let tags = [];
      if (isArray(jsonMetadata.tags)) { tags = jsonMetadata.tags; }
      // eslint-disable-next-line
      this.setState({
        initialTitle: postData.title || '',
        initialTopics: tags || [],
        initialBody: postData.body || '',
        initialReward: postData.reward || '50',
        initialUpvote: postData.upvote,
      });
    }
  }


  onSubmit = (form) => {
    const data = this.getNewPostData(form);
    const { location: { search } } = this.props;
    const id = new URLSearchParams(search).get('draft');
    if (id) {
      data.draftId = id;
    }
    this.props.createPost(data);
  }

  onImagePasted = (image, callback) => {
    // NOTE: Upload image to server.
    setTimeout(() => callback('https://placehold.it/200x200'), 500);
  }

  getNewPostData = (form) => {
    const data = {
      body: form.body,
      title: form.title,
      reward: form.reward,
      upvote: form.upvote,
    };

    console.log('setting to', data.upvote);

    data.parentAuthor = '';
    data.author = this.props.user.name || '';

    const tags = form.topics;
    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    const links = [];
    const linkRegex = /\[.+?]\((.*?)\)/g;
    const images = [];
    const imageRegex = /!\[.+?]\((.*?)\)/g;
    let matches;

    const postBody = data.body;

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

    // eslint-disable-next-line
    while (matches = imageRegex.exec(postBody)) {
      if (images.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
        images.push(matches[1]);
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
    if (images.length) { metaData.image = images; }

    data.parentPermlink = tags.length ? tags[0] : 'general';
    data.jsonMetadata = metaData;

    return data;
  }

  saveDraft = debounce((form) => {
    const data = this.getNewPostData(form);
    const postBody = data.body;
    const { location: { search } } = this.props;
    let id = new URLSearchParams(search).get('draft');

    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    let redirect = false;

    if (id === null) {
      id = Date.now().toString(16);
      redirect = true;
    }

    this.props.saveDraft({ postData: data, id }, redirect);
  }, 400);

  render() {
    const { initialTitle, initialTopics, initialBody, initialReward, initialUpvote } = this.state;
    const { editor: { loading } } = this.props;

    console.log('up', initialUpvote);

    return (
      <div className="shifted">
        <div className="post-layout container">
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              WIP
            </div>
          </Affix>
          <div className="center">
            <Editor
              ref={this.setForm}
              title={initialTitle}
              topics={initialTopics}
              body={initialBody}
              reward={initialReward}
              upvote={initialUpvote}
              loading={loading}
              onUpdate={this.saveDraft}
              onSubmit={this.onSubmit}
              onImagePasted={this.onImagePasted}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Write);
