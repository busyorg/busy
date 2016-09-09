var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./containers/wrapper'),

  Dashboard = require('./components/dashboard'),
  Login = require('./components/auth/login'),
  Callback = require('./components/auth/callback'),
  Settings = require('./components/settings'),

  About = require('./about/about'),
  Team = require('./about/team'),
  Projects = require('./about/projects'),
  Jobs = require('./about/jobs'),
  Donate = require('./about/donate'),
  Help = require('./about/help'),

  Single = require('./components/content'),
  Category = require('./components/feed/category'),

  Edit = require('./components/user/edit'),
  Posts = require('./components/user/posts'),
  Feed = require('./components/user/feed'),
  Replies = require('./components/user/replies'),
  Profile = require('./components/user/profile'),
  Followers = require('./components/user/followers'),
  Followed = require('./components/user/followed'),
  Wallet = require('./components/user/wallet'),

  Trending = require('./components/feed/trending'),
  Hot = require('./components/feed/hot'),
  Cashout = require('./components/feed/cashout'),
  Created = require('./components/feed/created'),
  Active = require('./components/feed/active'),
  Responses = require('./components/feed/responses'),
  Votes = require('./components/feed/votes'),

  Write = require('./components/write/write'),

  Messages = require('./components/messages/messages');

module.exports = (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Dashboard} />
    <Route path="/login/@:name" component={Login} />
    <Route path="/callback" component={Callback} />
    <Route path="/settings" component={Settings} />

    <Route path="/about" component={About} />
    <Route path="/team" component={Team} />
    <Route path="/projects" component={Projects} />
    <Route path="/jobs" component={Jobs} />
    <Route path="/donate" component={Donate} />
    <Route path="/help" component={Help} />

    <Route path="/trending" component={Trending} />
    <Route path="/hot" component={Hot} />
    <Route path="/cashout" component={Cashout} />
    <Route path="/created" component={Created} />
    <Route path="/active" component={Active} />
    <Route path="/responses" component={Responses} />
    <Route path="/votes" component={Votes} />

    <Route path="/write" component={Write} />

    <Route path="/messages" component={Messages} />
    <Route path="/messages/:to" component={Messages} />

    <Route path="/profile/edit" component={Edit} />
    <Route path="/@:name/posts" component={Posts} />
    <Route path="/@:name/feed" component={Feed} />
    <Route path="/@:name/replies" component={Replies} />
    <Route path="/@:name/followers" component={Followers} />
    <Route path="/@:name/followed" component={Followed} />
    <Route path="/@:name/wallet" component={Wallet} />
    <Route path="/@:name" component={Profile} />

    <Route path="/:category/@:author/:permlink" component={Single} />
    <Route path="/:sortBy/:category" component={Category} />
  </Route>
);
