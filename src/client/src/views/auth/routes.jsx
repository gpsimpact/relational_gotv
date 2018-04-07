import React from 'react';
import { Route, Switch } from 'react-router';
import FourOhFour from '../routes/404';

import Login from './Login';
// import RPR from './requestpasswordreset';
// import ResetPasswordGQL from './resetpassword';

export const Routes = (
  <div>
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route component={FourOhFour} />
    </Switch>
  </div>
);

/*

      <Route path="/auth/reset-password" component={ResetPasswordGQL} />
      <Route path="/auth/request-password-reset" component={RPR} />

*/
