import React, { Component } from 'react';

export default function PageHOC(ComposedComponent) {
  return class PageHost extends Component {
    constructor() {
      super();
    }

    render() {
      const { auth, route, params } = this.props;
      let path = route.path && route.path.substring(1);
      let sortBy = 'created';
      let category;

      if(path === '') {
        path = auth.isAuthenticated && '@' + auth.user.name + '/feed';
      }

      if (params.category && params.sortBy) {
        sortBy = params.sortBy;
        category = params.category;
      }
      return (
        <ComposedComponent
          {...this.props}
          path={path}
          sortBy={sortBy}
          category={category}
        />
      );
    }
  }
};
