import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import OrgRoutes from './OrgRoutes';
import UserRoutes from './UserRoutes';
import Login from './Login';

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route path="/org" component={OrgRoutes} />
    <Route path="/u" component={UserRoutes} />
  </Switch>
);

export default Main;
