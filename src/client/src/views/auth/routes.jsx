import React from 'react';
import { Route, Switch } from 'react-router';
import FourOhFour from '../routes/404';

import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Register from './Register';
// import RPR from './requestpasswordreset';
// import ResetPasswordGQL from './resetpassword';

export const Routes = (
  <div>
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/forgot" component={ForgotPassword} />
      <Route path="/auth/reset-password" component={ResetPassword} />
      <Route path="/auth/register" component={Register} />
      <Route component={FourOhFour} />
    </Switch>
  </div>
);
