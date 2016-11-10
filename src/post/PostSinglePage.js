import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import Header from '../app/Header';
import Body from './body';
import Comments from './../comments/Comments';
import TriggerPost from './../app/Trigger/TriggerPost';
import PostSingleContent from './PostSingleContent';
import Loading from './../widgets/Loading';
import CommentForm from './../comments/CommentForm';

export default class PostSinglePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { content, reblog, isReblogged, openCommentingDraft } = this.props;
    return (
      <div>
        <Header />
        <TriggerPost
          reblog={reblog}
          isReblogged={isReblogged}
          openCommentingDraft={openCommentingDraft}
        />
        { content.author ?
          <PostSingleContent content={content} />
          :
          <Loading />
        }

        <CommentForm />
      </div>
    );
  }
}
