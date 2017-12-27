import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import steemAPI from '../steemAPI';
import Loading from '../components/Icon/Loading';
import Tag from './Tag';
import { getFavoriteCategories } from '../reducers';
import * as favoriteActions from '../favorites/favoritesActions';

const sortTags = tags =>
  Object.keys(tags)
    .sort((key1, key2) => tags[key1].comments - tags[key2].comments)
    .reverse()
    .map(tagKey => tags[tagKey]);

@connect(
  state => ({
    favorites: getFavoriteCategories(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        addCategoryFavorite: favoriteActions.addCategoryFavorite,
        removeCategoryFavorite: favoriteActions.removeCategoryFavorite,
      },
      dispatch,
    ),
)
export default class Tags extends React.Component {
  static propTypes = {
    favorites: PropTypes.arrayOf(PropTypes.string),
    addCategoryFavorite: PropTypes.func,
    removeCategoryFavorite: PropTypes.func,
  };

  static defaultProps = {
    favorites: [],
    addCategoryFavorite: () => {},
    removeCategoryFavorite: () => {},
  };

  state = {
    tags: {},
  };

  componentDidMount() {
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
          {sortedTags.map(
            tag =>
              tag.name ? (
                <Tag
                  key={tag.name}
                  tag={tag}
                  favorited={this.props.favorites.includes(tag.name)}
                  addCategoryFavorite={this.props.addCategoryFavorite}
                  removeCategoryFavorite={this.props.removeCategoryFavorite}
                />
              ) : (
                []
              ),
          )}
        </ul>

        {isFetching && (
          <div className="my-5">
            <Loading />
          </div>
        )}
      </div>
    );
  }
}
