import React from 'react';
// import { Route } from 'react-router-dom';
// import User from '../../components/Sidebar/User';
import { Route, Switch } from 'react-router-dom';


export const LeftSidebar = () => (
  <Switch>
    <Route exact path="/" render={() => <div>LeftPage</div>} />
    <Route path="/trending/:category?" render={() => <div>LeftTrending</div>} />
    <Route path="/hot/:category?" render={() => <div>LeftHot</div>} />
    <Route path="/cashout/:category?" render={() => <div>LeftCashout</div>} />
    <Route path="/created/:category?" render={() => <div>LeftCreated</div>} />
    <Route path="/active/:category?" render={() => <div>LeftActive</div>} />
    <Route path="/responses/:category?" render={() => <div>LeftResponses</div>} />
    <Route path="/votes/:category?" render={() => <div>LeftVotes</div>} />
  </Switch>
);

export const RightSidebar = (props) => {
  console.log('RightSidebar', props);
  return (<Switch>
    <Route exact path="/" render={() => <div>RightPage</div>} />
    <Route path="/trending/:category?" render={() => <div>RightTrending</div>} />
    <Route path="/hot/:category?" render={() => <div>RightHot</div>} />
    <Route path="/cashout/:category?" render={() => <div>RightCashout</div>} />
    <Route path="/created/:category?" render={() => <div>RightCreated</div>} />
    <Route path="/active/:category?" render={() => <div>RightActive</div>} />
    <Route path="/responses/:category?" render={() => <div>RightResponses</div>} />
    <Route path="/votes/:category?" render={() => <div>RightVotes</div>} />
  </Switch>);
};
