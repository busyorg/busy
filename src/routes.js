var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./wrapper'),

  Dashboard = require('./app/dashboard'),
  Login = require('./auth/login'),
  Callback = require('./widgets/callback'),
  Settings = require('./app/settings'),

  About = require('./statics/about'),
  Team = require('./statics/team'),
  Projects = require('./statics/projects'),
  Jobs = require('./statics/jobs'),
  Donate = require('./statics/donate'),
  Help = require('./statics/help'),

  PostSinglePage = require('./post/PostSinglePage'),
  Category = require('./feed/category'),

  Edit = require('./user/edit'),
  Posts = require('./user/posts'),
  Feed = require('./user/feed'),
  Replies = require('./user/replies'),
  Profile = require('./user/profile'),
  Followers = require('./user/UserFollowersList'),
  Followed = require('./user/UserFollowedList'),
  Wallet = require('./user/wallet'),

  Trending = require('./feed/trending'),
  Hot = require('./feed/hot'),
  Cashout = require('./feed/cashout'),
  Created = require('./feed/created'),
  Active = require('./feed/active'),
  Responses = require('./feed/responses'),
  Votes = require('./feed/votes'),
  Write = require('./post/newPost/NewPost').default,
  Messages = require('./messages/Messages');

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

    <Route path="/:category/@:author/:permlink" component={ PostSinglePage } />
    <Route path="/:sortBy/:category" component={Category} />
  </Route>
);
