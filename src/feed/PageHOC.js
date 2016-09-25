import React, { Component } from 'react';

export default function PageHOC(ComposedComponent) {
  return class PageHost extends Component {
    constructor() {
      super();
    }

    render() {
      const { auth, route, params } = this.props;
      let path = route.path && route.path.substring(1);

      let sortBy = (path && path.split('(')[0]) || 'created';
      const category = params.category;

      if (path === '' && auth.isAuthenticated) {
        path = '@' + auth.user.name + '/feed';
        sortBy = 'created';
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
  };
};
