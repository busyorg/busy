import React from 'react';
import Header from './../app/header';
import PageActions from './../app/PageActions';
import Feed from './feed';
import PageHOC from './PageHOC';

@PageHOC
export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { account, category, sortBy, path } = this.props;
    return (
      <div className="main-panel">
        <PageActions
          messages
          add
        />
        <Header
          account={account}
          category={category}
        />
        <Feed
          path={path}
          sortBy={sortBy}
        />
      </div>
    );
  }
};

Page.propTypes = {
  account: React.PropTypes.string,
  category: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  path: React.PropTypes.string,
};
