import React, { Component } from 'react';
import steemAPI from '../steemAPI';
import Loading from '../widgets/Loading';
import Header from '../app/Header';
import Tag from './Tag';

const sortTags = tags =>
  Object.keys(tags)
  .sort((key1, key2) => (tags[key1].comments - tags[key2].comments))
  .reverse()
  .map(tagKey => tags[tagKey]);

export default class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {},
    };
  }

  componentWillMount() {
    steemAPI.getState('tags', (err, result) => {
      this.setState({ tags: result.tags });
    });
  }

  render() {
    const { tags } = this.state;
    const sortedTags = sortTags(tags);
    const isFetching = !sortedTags.length;

    return (
      <div className="main-panel">
        <Header />
        <ul>
          { sortedTags.map((tag, idx) => (tag.name ? <Tag key={idx} tag={tag} /> : [])) }
        </ul>

        { isFetching &&
          <Loading />
        }
      </div>
    );
  }
}
