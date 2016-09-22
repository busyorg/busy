import React from 'react';
import Header from './../app/header';
import PageActions from './../app/PageActions';
import Feed from './feed';

const Page = ({ account, category, sortBy, path }) => {
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
};

Page.propTypes = {
  account: React.PropTypes.string,
  category: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  path: React.PropTypes.string,
};

export default Page;
