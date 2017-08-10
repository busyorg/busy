import React from 'react';
import Page from './Page';
import { getFeedContent } from './feedActions';

// These components are only used as a temporarily hack to make-
// activeClassName on React Router <Link /> components work.
export const Trending = props => <Page {...props} />;
export const Hot = props => <Page {...props} />;
export const Cashout = props => <Page {...props} />;
export const Created = props => <Page {...props} />;
export const Active = props => <Page {...props} />;
export const Responses = props => <Page {...props} />;
export const Votes = props => <Page {...props} />;


Trending.needs = [
  ({ category }) => getFeedContent({ sortBy: 'trending', category, limit: 10 }),
];
Hot.needs = [
  ({ category }) => getFeedContent({ sortBy: 'hot', category, limit: 10 }),
];
Cashout.needs = [
  ({ category }) => getFeedContent({ sortBy: 'cashout', category, limit: 10 }),
];
Created.needs = [
  ({ category }) => getFeedContent({ sortBy: 'created', category, limit: 10 }),
];
Active.needs = [
  ({ category }) => getFeedContent({ sortBy: 'active', category, limit: 10 }),
];
Responses.needs = [
  ({ category }) => getFeedContent({ sortBy: 'responses', category, limit: 10 }),
];
Votes.needs = [
  ({ category }) => getFeedContent({ sortBy: 'votes', category, limit: 10 }),
];
