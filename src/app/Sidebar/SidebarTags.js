import React, { Component } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import Icon from '../../widgets/Icon';

const limit = 25;

export default class SidebarUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  filterTagsBySearch(tags = []) {
    const { search } = this.state;
    return tags.filter(tag => _.startsWith(tag, search));
  }

  renderFavoritedTags() {
    const { favorites } = this.props;
    const favoritedCategories = favorites.categories;
    return this.filterTagsBySearch(favoritedCategories)
      .sort()
      .slice(0, limit)
      .map((category, idx) =>
        <li key={idx}>
          <Link to={`/trending/${category}`} activeClassName="active">
            # {category}{' '}
            <Icon name="star" xs />
          </Link>
        </li>
      );
  }

  renderTags() {
    const { categories, favorites } = this.props;

    if (categories) {
      // excluding items in favorite to avoid repetition
      const categoriesWithoutFavorites = _.difference(categories, favorites.categories);

      return this.filterTagsBySearch(categoriesWithoutFavorites)
        .slice(0, limit - favorites.categories.length)
        .map((category, idx) =>
          <li key={idx}>
            <Link to={`/trending/${category}`} activeClassName="active">
              # {category}
            </Link>
          </li>
        );
    }
    return [];
  }

  renderSearchAsTag() {
    const { search } = this.state;
    const { categories, favorites } = this.props;
    if (search
      && !categories.includes(search)
      && !favorites.categories.includes(search)
    ) {
      return (
        <li>
          <Link to={`/trending/${search}`} activeClassName="active">
            # {search}
          </Link>
        </li>
      );
    }
    return [];
  }

  search = (e) => {
    this.setState({ search: e.target.value });
  };

  render() {
    return (
      <div>
        <ul>
          <li>
            <ul>
              <li className="Sidebar__search">
                <div className="input-group">
                  <span className="input-group-addon"><Icon name="search" sm /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={this.state.search}
                    onChange={this.search}
                  />
                </div>
              </li>
              { this.renderSearchAsTag() }
              { this.renderFavoritedTags() }
              { this.renderTags() }
              <li><Link to="/tags" activeClassName="active"><FormattedMessage id="see_more" /></Link></li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}
