import React, { Component } from 'react';
import { values, sortBy, size } from 'lodash';

import steemAPI from '../steemAPI';
import Loading from '../widgets/Loading';
import Header from '../app/Header';
import Tag from './Tag';

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
    const tags = this.state.tags;
    return (
      <div className="main-panel">
        <Header />
        { size(tags)
          ? <ul>
            { values(sortBy(tags, 'comments')).reverse().map((tag, key) =>
              tag.name
                ? <Tag key={key} tag={tag} />
                : []
            )}
          </ul>
          : <Loading />
        }
      </div>
    );
  }
}
