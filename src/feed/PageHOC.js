import React, { Component } from 'react';

export default function PageHOC(ComposedComponent) {
  return class PageHost extends Component {
    constructor() {
      super();
    }

    render() {
      const { auth, route: { path }, params } = this.props;

      let sortBy = (path && path.split('(')[0].substring(1)) || 'created';
      const { category } = params;

      if (!path && auth.isAuthenticated) {
        sortBy = 'feed';
      } else if (!path) {
        sortBy = 'trending';
      }

      return (
        <ComposedComponent
          {...this.props}
          limit={ 10 }
          path={path}
          sortBy={sortBy}
          category={category}
        />
      );
    }
  };
};
