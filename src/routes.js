var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),

  Dashboard = require('./components/dashboard'),
  Callback = require('./components/auth/callback'),

  About = require('./components/about/about'),
  Team = require('./components/about/team'),
  Projects = require('./components/about/projects'),
  Jobs = require('./components/about/jobs'),
  Donate = require('./components/about/donate'),
  Help = require('./components/about/help'),

  Single = require('./components/content'),
  Category = require('./components/category'),

  Posts = require('./components/user/posts'),
  Feed = require('./components/user/feed'),
  Replies = require('./components/user/replies'),
  Profile = require('./components/user/profile'),

  Trending = require('./components/trending'),
  Hot = require('./components/hot'),
  Cashout = require('./components/cashout'),
  Created = require('./components/created'),
  Active = require('./components/active'),
  Responses = require('./components/responses'),
  Votes = require('./components/votes'),

  Write = require('./components/write/write'),

  Chat = require('./components/chat/chat');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/callback" component={Callback} />

    <Route path="/about" component={About} />
    <Route path="/team" component={Team} />
    <Route path="/projects" component={Projects} />
    <Route path="/jobs" component={Jobs} />
    <Route path="/donate" component={Donate} />
    <Route path="/help" component={Help} />

    <Route path="/:category/@:author/:permlink" component={Single} />
    <Route path="/:sortBy/:category" component={Category} />

    <Route path="/@:name/posts" component={Posts} />
    <Route path="/@:name/feed" component={Feed} />
    <Route path="/@:name/replies" component={Replies} />
    <Route path="/@:name" component={Profile} />

    <Route path="/trending" component={Trending} />
    <Route path="/hot" component={Hot} />
    <Route path="/cashout" component={Cashout} />
    <Route path="/created" component={Created} />
    <Route path="/active" component={Active} />
    <Route path="/responses" component={Responses} />
    <Route path="/votes" component={Votes} />

    <Route path="/write" component={Write} />

    <Route path="/chat" component={Chat} />
  </Route>
);