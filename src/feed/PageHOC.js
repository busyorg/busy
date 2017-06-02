import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

export default function PageHOC(ComposedComponent) {
  class PageHost extends Component {
    render() {
      const { auth, match: { path, params } } = this.props;
      console.log('PageHOC', this.props);
      let sortBy = (path && path.split('/:')[0].substring(1)) || 'created';
      const { category } = params || {};

      if (!path && auth.isAuthenticated) {
        sortBy = 'feed';
      } else if (!path) {
        sortBy = 'trending';
      }

      return (
        <ComposedComponent
          {...this.props}
          limit={10}
          path={path}
          sortBy={sortBy}
          category={category}
        />
      );
    }
  }

  return withRouter(PageHost);
}
