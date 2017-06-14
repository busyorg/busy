import React from 'react';

export default function PageHOC(ComposedComponent) {
  const PageHost = (props) => {
    const { auth, match: { path, params } } = props;
    let sortBy = (path && path.split('/:')[0].substring(1)) || 'created';
    const { category } = params || {};

    if (!path && auth.isAuthenticated) {
      sortBy = 'feed';
    } else if (!path) {
      sortBy = 'trending';
    }

    return (
      <ComposedComponent {...props} limit={10} path={path} sortBy={sortBy} category={category} />
    );
  };
  return PageHost;
}
