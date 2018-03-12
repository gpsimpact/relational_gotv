import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import OrgRoutes from './OrgRoutes';
import UserRoutes from './UserRoutes';
import Login from './Login';
import SchemaForm from './SchemaForm';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/forgotPassword" component={ForgotPassword} />
    <Route exact path="/passwordReset" component={ResetPassword} />
    <Route path="/org" component={OrgRoutes} />
    <Route path="/u" component={UserRoutes} />
    <Route path="/test" component={SchemaForm} />
  </Switch>
);

export default Main;
