var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),
  Dashboard = require('./components/dashboard'),
  About = require('./components/about'),
  Profile = require('./components/profile'),
  Trending = require('./components/trending'),
  Hot = require('./components/hot'),
  Cashout = require('./components/cashout'),
  Created = require('./components/created'),
  Active = require('./components/active'),
  Responses = require('./components/responses'),
  Votes = require('./components/votes'),
  Category = require('./components/category'),
  Single = require('./components/content'),
  Posts = require('./components/posts'),
  Replies = require('./components/replies'),
  Chat = require('./components/chat');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/about" component={About} />
    <Route path="/:category/@:author/:permlink" component={Single} />
    <Route path="/trending/:category" component={Category} />
    <Route path="/@:name/posts" component={Posts} />
    <Route path="/@:name/replies" component={Replies} />
    <Route path="/@:name" component={Profile} />
    <Route path="/trending" component={Trending} />
    <Route path="/hot" component={Hot} />
    <Route path="/cashout" component={Cashout} />
    <Route path="/created" component={Created} />
    <Route path="/active" component={Active} />
    <Route path="/responses" component={Responses} />
    <Route path="/votes" component={Votes} />
    <Route path="/chat" component={Chat} />
  </Route>
);