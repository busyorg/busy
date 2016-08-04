var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),
  Dashboard = require('./components/dashboard'),
  Profile = require('./components/profile'),
  Trending = require('./components/trending'),
  Hot = require('./components/hot'),
  Cashout = require('./components/cashout'),
  Created = require('./components/created'),
  Active = require('./components/active'),
  Responses = require('./components/responses'),
  Votes = require('./components/votes'),
  Tag = require('./components/tag'),
  Single = require('./components/content');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/:tag/@:author/:permlink" component={Single} />
    <Route path="/trending/:tag" component={Tag} />
    <Route path="/@:name" component={Profile} />
    <Route path="/trending" component={Trending} />
    <Route path="/hot" component={Hot} />
    <Route path="/cashout" component={Cashout} />
    <Route path="/created" component={Created} />
    <Route path="/active" component={Active} />
    <Route path="/responses" component={Responses} />
    <Route path="/votes" component={Votes} />
  </Route>
);