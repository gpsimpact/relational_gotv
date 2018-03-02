import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

const OrgRoutes = () => {
  return isLoggedIn() ? (
    <Switch>
      <Route path="/" render={() => <div>This is user area</div>} />
    </Switch>
  ) : (
    <Redirect to="/login" />
  );
};

export default OrgRoutes;
