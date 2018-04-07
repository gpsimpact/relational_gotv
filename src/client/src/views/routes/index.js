import React from 'react';
import { Route, Switch } from 'react-router';
import FourOhFour from './404';
import HomePage from '../homePage';
import Auth from '../auth';
// import Login from '../auth/Login';
// import ForgotPassword from '../../components/ForgotPassword';
// import ResetPassword from '../../components/ResetPassword';
// import OrgRoutes from '../../components/OrgRoutes';
// import UserRoutes from '../../components/UserRoutes';
export const Routes = (
  <div>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/auth" component={Auth} />
      <Route component={FourOhFour} />
    </Switch>
  </div>
);

/*

      <Route exact path="/forgotPassword" component={ForgotPassword} />
      <Route exact path="/passwordReset" component={ResetPassword} />
      <Route path="/org" component={OrgRoutes} />
      <Route path="/u" component={UserRoutes} />
      
*/
