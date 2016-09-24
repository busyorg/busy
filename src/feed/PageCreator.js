import React from 'react';
import Page from './page';

// Use it as a hack to make React Router's activeClassName and restore scroll work
export default function() {
  return class PageCreator extends React.Component {
    render() {
      return (
        <Page {...this.props} />
      );
    }
  };
}
