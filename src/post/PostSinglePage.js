import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import Header from '../app/Header';
import Body from './body';
import Comments from './../comments/Comments';
import TriggerPost from './../app/Trigger/TriggerPost';
import PostSingleContent from './PostSingleContent';
import Loading from './../widgets/Loading';

export default class PostSinglePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { content, onClickReblog } = this.props;
    return (
      <div>
        { content && content.author ?
          <PostSingleContent content={content} />
          :
          <Loading />
        }
      </div>
    );
  }
}
