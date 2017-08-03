import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import steemAPI from '../steemAPI';
import Loading from '../components/Icon/Loading';
import Tag from './Tag';
import * as favoriteActions from '../favorites/favoritesActions';

const sortTags = tags =>
  Object.keys(tags)
    .sort((key1, key2) => (tags[key1].comments - tags[key2].comments))
    .reverse()
    .map(tagKey => tags[tagKey]);


@connect(
  state => ({
    favorites: state.favorites.categories,
  }),
  dispatch => bindActionCreators({
    addCategoryFavorite: favoriteActions.addCategoryFavorite,
    removeCategoryFavorite: favoriteActions.removeCategoryFavorite,
  }, dispatch),
)
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
        <ul>
          { sortedTags.map((tag, idx) => (tag.name ?
            <Tag
              key={idx}
              tag={tag}
              isFavorited={this.props.favorites.includes(tag.name)}
              addCategoryFavorite={this.props.addCategoryFavorite}
              removeCategoryFavorite={this.props.removeCategoryFavorite}
            />
            : []
          )) }
        </ul>

        { isFetching &&
          <div className="my-5">
            <Loading />
          </div>
        }
      </div>
    );
  }
}
